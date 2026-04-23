let selectedEventId = null;

// 頁面載入時檢查登入狀態
window.onload = function() {
    requireAuth();  // 沒登入就跳回登入頁

    // 顯示登入者資訊
    document.getElementById('header-username').textContent =
        sessionStorage.getItem('username');

    const role = getRole();
    const roleBadge = document.getElementById('header-role');
    roleBadge.textContent = role === 'ADMIN' ? '管理員' : '一般使用者';
    roleBadge.className = 'role-badge ' + (role === 'ADMIN' ? 'admin' : 'user');

    // 如果不是管理員，隱藏新增活動區塊
    if (role !== 'ADMIN') {
        document.getElementById('create-panel').style.display = 'none';
    }

    loadEvents();
};

// 所有 API 請求都帶上 Token 的 header
function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()  // JWT 標準格式
    };
}

// 載入所有活動
async function loadEvents() {
    const container = document.getElementById('events-container');
    container.innerHTML = '<p class="hint">載入中...</p>';

    try {
        const response = await fetch(`${API_BASE}/events`, {
            headers: authHeaders()
        });

        // Token 過期或無效
        if (response.status === 401) {
            logout();
            return;
        }

        const events = await response.json();

        if (events.length === 0) {
            container.innerHTML = '<p class="hint">目前沒有活動</p>';
            return;
        }

        const isAdmin = getRole() === 'ADMIN';

        container.innerHTML = events.map(event => `
            <div class="event-card">
                <h3>${event.title}</h3>
                <p>📍 ${event.location || '地點未定'}</p>
                <p>🕐 ${formatDateTime(event.startTime)}</p>
                <p>${event.description || '無描述'}</p>
                <p class="capacity-info">名額：${event.capacity} 人</p>
                <div class="card-buttons">
                    <button onclick="openRegisterModal(${event.id}, '${event.title}')">
                        報名
                    </button>
                    ${isAdmin ? `
                        <button onclick="viewRegistrations(${event.id}, '${event.title}')">
                            查看報名
                        </button>
                        <button class="danger" onclick="deleteEvent(${event.id})">
                            刪除
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');

    } catch (error) {
        container.innerHTML = '<p class="hint">載入失敗</p>';
    }
}

// 新增活動
async function submitCreateEvent() {
    const eventData = {
        title:       document.getElementById('title').value,
        description: document.getElementById('description').value,
        location:    document.getElementById('location').value,
        startTime:   document.getElementById('startTime').value || null,
        endTime:     document.getElementById('endTime').value || null,
        capacity:    parseInt(document.getElementById('capacity').value)
    };

    if (!eventData.title || !eventData.capacity) {
        alert('請填寫標題和名額');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(eventData)
        });

        if (response.ok) {
            alert('活動新增成功！');
            clearForm();
            loadEvents();
        } else {
            const error = await response.json();
            alert('新增失敗：' + error.error);
        }

    } catch (error) {
        alert('新增失敗');
    }
}

// 刪除活動
async function deleteEvent(id) {
    if (!confirm('確定要刪除這個活動嗎？')) return;

    try {
        const response = await fetch(`${API_BASE}/events/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });

        if (response.ok) {
            loadEvents();
        } else {
            alert('刪除失敗');
        }
    } catch (error) {
        console.error(error);
    }
}

// 開啟報名 Modal
function openRegisterModal(eventId, eventTitle) {
    selectedEventId = eventId;
    document.getElementById('modal-event-title').textContent = eventTitle;
    document.getElementById('register-modal').classList.remove('hidden');
}

// 關閉 Modal
function closeModal() {
    selectedEventId = null;
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('register-modal').classList.add('hidden');
}

// 送出報名
async function submitRegistration() {
    const name  = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;

    if (!name || !email) {
        alert('請填寫姓名和 Email');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/registrations`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
                eventId:       selectedEventId,
                attendeeName:  name,
                attendeeEmail: email
            })
        });

        if (response.ok) {
            alert('報名成功！');
            closeModal();
        } else {
            const data = await response.json();
            alert('報名失敗：' + data.error);
        }
    } catch (error) {
        console.error(error);
    }
}

// AI 產生描述
async function generateDescription() {
    const keywords = document.getElementById('ai-keywords').value;
    if (!keywords) {
        alert('請輸入關鍵字');
        return;
    }

    const status = document.getElementById('ai-status');
    const btn = document.getElementById('ai-btn');
    btn.disabled = true;
    btn.textContent = 'AI 生成中...';
    status.textContent = '請稍候';

    try {
        const response = await fetch(`${API_BASE}/ai/generate-description`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ keywords })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('description').value = data.description;
            status.textContent = '✅ 描述已自動填入';
        } else {
            status.textContent = '❌ 生成失敗';
        }
    } catch (error) {
        status.textContent = '❌ 連線失敗';
    } finally {
        btn.disabled = false;
        btn.textContent = 'AI 產生描述';
    }
}

// 工具函式
function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return '時間未定';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('zh-TW', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

function clearForm() {
    ['title', 'description', 'location', 'startTime', 'endTime', 'capacity']
        .forEach(id => document.getElementById(id).value = '');
    document.getElementById('ai-keywords').value = '';
    document.getElementById('ai-status').textContent = '';
}

// 查看報名名單
async function viewRegistrations(eventId, eventTitle) {
    try {
        const response = await fetch(`${API_BASE}/registrations/event/${eventId}`, {
            headers: authHeaders()
        });

        const registrations = await response.json();

        // 用 alert 顯示太陽春，改用 Modal 顯示
        showRegistrationModal(eventTitle, registrations);

    } catch (error) {
        alert('載入失敗');
    }
}

function showRegistrationModal(eventTitle, registrations) {
    // 動態建立一個 Modal 顯示名單
    const existing = document.getElementById('reg-list-modal');
    if (existing) existing.remove();  // 移除舊的

    const modal = document.createElement('div');
    modal.id = 'reg-list-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px; max-height: 80vh; overflow-y: auto;">
            <h3>📋 報名名單</h3>
            <p style="color:#666; margin-bottom:16px;">${eventTitle}</p>

            ${registrations.length === 0
                ? '<p style="color:#aaa; text-align:center; padding:20px;">目前沒有人報名</p>'
                : `
                    <p style="font-size:0.85rem; color:#1a73e8; margin-bottom:12px;">
                        共 ${registrations.length} 人報名
                    </p>
                    <table class="reg-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>姓名</th>
                                <th>Email</th>
                                <th>報名時間</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${registrations.map((reg, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${reg.attendeeName}</td>
                                    <td>${reg.attendeeEmail}</td>
                                    <td>${formatDateTime(reg.registeredAt)}</td>
                                    <td>
                                        <button class="danger small"
                                            onclick="cancelRegistration(${reg.id}, ${registrations[0]?.event?.id || ''})">
                                            取消
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `
            }

            <div class="modal-buttons" style="margin-top:20px;">
                <button onclick="closeRegListModal()">關閉</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeRegListModal() {
    const modal = document.getElementById('reg-list-modal');
    if (modal) modal.remove();
}

// 管理員取消某人的報名
async function cancelRegistration(regId, eventId) {
    if (!confirm('確定要取消這筆報名嗎？')) return;

    try {
        const response = await fetch(`${API_BASE}/registrations/${regId}`, {
            method: 'DELETE',
            headers: authHeaders()
        });

        if (response.ok) {
            // 重新載入這個活動的名單
            const modal = document.getElementById('reg-list-modal');
            const title = modal.querySelector('p').textContent;
            const regResponse = await fetch(`${API_BASE}/registrations/event/${eventId}`, {
                headers: authHeaders()
            });
            const registrations = await regResponse.json();
            showRegistrationModal(title, registrations);
        } else {
            alert('取消失敗');
        }
    } catch (error) {
        console.error(error);
    }
}