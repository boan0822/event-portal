// API 的基本網址，因為前端跟後端在同一個 port，不需要填完整網址
const API_BASE = '/api';

// 儲存目前要報名的活動 id（讓 Modal 知道要報名哪個活動）
let selectedEventId = null;

// ==========================================
// 活動相關功能
// ==========================================

// 載入所有活動
async function loadEvents() {
    const container = document.getElementById('events-container');
    container.innerHTML = '<p class="hint">載入中...</p>';

    try {
        // fetch 是瀏覽器內建的 HTTP 請求工具
        // 預設是 GET 請求
        const response = await fetch(`${API_BASE}/events`);
        const events = await response.json();  // 把回應解析成 JavaScript 物件

        if (events.length === 0) {
            container.innerHTML = '<p class="hint">目前沒有活動</p>';
            return;
        }

        // 把每個活動轉成 HTML 卡片，插入頁面
        container.innerHTML = events.map(event => `
            <div class="event-card">
                <h3>${event.title}</h3>
                <p>📍 ${event.location || '地點未定'}</p>
                <p>🕐 ${formatDateTime(event.startTime)}</p>
                <p>${event.description || '無描述'}</p>
                <p class="capacity-info">
                    名額：${event.capacity} 人
                </p>
                <div class="card-buttons">
                    <button onclick="openRegisterModal(${event.id}, '${event.title}')">
                        報名
                    </button>
                    <button class="danger" onclick="deleteEvent(${event.id})">
                        刪除
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        container.innerHTML = '<p class="hint">載入失敗，請確認後端是否啟動</p>';
        console.error('載入活動失敗：', error);
    }
}

// 新增活動
async function submitcreateEvent() {
    // 從表單取得使用者填入的資料
    const eventData = {
        title:       document.getElementById('title').value,
        description: document.getElementById('description').value,
        location:    document.getElementById('location').value,
        startTime:   document.getElementById('startTime').value || null,
        endTime:     document.getElementById('endTime').value || null,
        capacity:    parseInt(document.getElementById('capacity').value)
    };

    // 基本驗證
    if (!eventData.title || !eventData.capacity) {
        alert('請填寫標題和名額');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // 告訴後端傳的是 JSON
            },
            body: JSON.stringify(eventData)  // 把 JS 物件轉成 JSON 字串
        });

        if (response.ok) {
            alert('活動新增成功！');
            clearForm();   // 清空表單
            loadEvents();  // 重新載入列表
        } else {
            const error = await response.json();
            alert('新增失敗：' + error.message);
        }

    } catch (error) {
        alert('新增失敗，請確認後端是否啟動');
        console.error(error);
    }
}

// 刪除活動
async function deleteEvent(id) {
    if (!confirm('確定要刪除這個活動嗎？')) return;

    try {
        const response = await fetch(`${API_BASE}/events/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadEvents();  // 刪除成功後重新整理列表
        } else {
            alert('刪除失敗');
        }

    } catch (error) {
        console.error('刪除失敗：', error);
    }
}

// ==========================================
// 報名相關功能
// ==========================================

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
            headers: { 'Content-Type': 'application/json' },
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
        console.error('報名失敗：', error);
    }
}

// ==========================================
// AI 功能
// ==========================================

async function generateDescription() {
    const keywords = document.getElementById('ai-keywords').value;
    if (!keywords) {
        alert('請輸入關鍵字');
        return;
    }

    const status = document.getElementById('ai-status');
    const btn = document.getElementById('ai-btn');

    // 按鈕改成 loading 狀態，避免使用者重複點
    btn.disabled = true;
    btn.textContent = 'AI 生成中...';
    status.textContent = '請稍候';

    try {
        const response = await fetch(`${API_BASE}/ai/generate-description`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keywords })
        });

        const data = await response.json();

        if (response.ok) {
            // 把 AI 生成的描述自動填入表單的描述欄位
            document.getElementById('description').value = data.description;
            status.textContent = '✅ 描述已自動填入';
        } else {
            status.textContent = '❌ 生成失敗：' + data.message;
        }

    } catch (error) {
        status.textContent = '❌ 連線失敗';
        console.error(error);
    } finally {
        // 不管成功或失敗，都要把按鈕恢復
        btn.disabled = false;
        btn.textContent = 'AI 產生描述';
    }
}

// ==========================================
// 工具函式
// ==========================================

// 把時間格式從 "2025-10-01T09:00:00" 轉成 "2025/10/01 09:00"
function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return '時間未定';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('zh-TW', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

// 清空表單
function clearForm() {
    ['title', 'description', 'location', 'startTime', 'endTime', 'capacity']
        .forEach(id => document.getElementById(id).value = '');
    document.getElementById('ai-keywords').value = '';
    document.getElementById('ai-status').textContent = '';
}

// 頁面載入時自動抓一次活動列表
window.onload = loadEvents;