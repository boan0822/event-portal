const API_BASE = '/api';

// 登入
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    if (!username || !password) {
        errorMsg.textContent = '請填寫帳號和密碼';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // 把 Token 和使用者資訊存到 sessionStorage
            // sessionStorage：關掉瀏覽器分頁就清除，比 localStorage 安全
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('username', data.username);
            sessionStorage.setItem('role', data.role);

            // 登入成功跳轉到主頁面
            window.location.href = '/index.html';
        } else {
            errorMsg.textContent = data.error || '帳號或密碼錯誤';
        }

    } catch (error) {
        errorMsg.textContent = '連線失敗，請確認伺服器是否啟動';
    }
}

// 登出
function logout() {
    sessionStorage.clear();
    window.location.href = '/login.html';
}

// 取得 Token（其他頁面呼叫 API 時用）
function getToken() {
    return sessionStorage.getItem('token');
}

// 取得目前使用者角色
function getRole() {
    return sessionStorage.getItem('role');
}

// 檢查是否已登入，沒登入就跳回登入頁
function requireAuth() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
    }
}

// 允許按 Enter 鍵登入
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') login();
});

// 切換登入/註冊 Tab
function switchTab(tab) {
    const loginForm    = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs         = document.querySelectorAll('.tab');
    const errorMsg     = document.getElementById('login-error');

    errorMsg.textContent = '';

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
}

// 註冊
async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const errorMsg = document.getElementById('login-error');

    if (!username || !password) {
        errorMsg.textContent = '請填寫帳號和密碼';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('username', data.username);
            sessionStorage.setItem('role', data.role);
            window.location.href = '/index.html';
        } else {
            errorMsg.textContent = data.error || '註冊失敗';
        }

    } catch (error) {
        errorMsg.textContent = '連線失敗';
    }
}