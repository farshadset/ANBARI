import { supabaseClient as supabase, getCurrentUser, initializeUser } from './script.js';

// مدیریت نمایش فرم‌ها
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');

showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// مدیریت تغییر بین موبایل و ایمیل (ورود)
const mobileToggle = document.getElementById('mobile-toggle');
const emailToggle = document.getElementById('email-toggle');
const userLabel = document.getElementById('user-label');
const userInput = document.getElementById('login-userid-input');
let loginInputType = 'mobile';

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.add('active');
    emailToggle.classList.remove('active');
    userLabel.textContent = 'شماره موبایل';
    userInput.type = 'tel';
    userInput.placeholder = 'مثال: 09123456789';
    loginInputType = 'mobile';
});

emailToggle.addEventListener('click', () => {
    emailToggle.classList.add('active');
    mobileToggle.classList.remove('active');
    userLabel.textContent = 'جیمیل';
    userInput.type = 'email';
    userInput.placeholder = 'مثال: example@gmail.com';
    loginInputType = 'email';
});

// مدیریت تغییر بین موبایل و ایمیل (ثبت‌نام)
const signupMobileToggle = document.getElementById('signup-mobile-toggle');
const signupEmailToggle = document.getElementById('signup-email-toggle');
const signupUserLabel = document.getElementById('signup-user-label');
const signupUserInput = document.getElementById('signup-userid-input');
let signupInputType = 'mobile';

signupMobileToggle.addEventListener('click', () => {
    signupMobileToggle.classList.add('active');
    signupEmailToggle.classList.remove('active');
    signupUserLabel.textContent = 'شماره موبایل';
    signupUserInput.type = 'tel';
    signupUserInput.placeholder = 'مثال: 09123456789';
    signupInputType = 'mobile';
});

signupEmailToggle.addEventListener('click', () => {
    signupEmailToggle.classList.add('active');
    signupMobileToggle.classList.remove('active');
    signupUserLabel.textContent = 'جیمیل';
    signupUserInput.type = 'email';
    signupUserInput.placeholder = 'مثال: example@gmail.com';
    signupInputType = 'email';
});

// ورود کاربر با Supabase
document.getElementById('login-btn').addEventListener('click', async () => {
    const userId = document.getElementById('login-userid-input').value;
    const password = document.getElementById('login-password-input').value;

    if (!userId || !password) {
        alert('لطفاً اطلاعات را وارد کنید');
        return;
    }

    // اعتبارسنجی
    if (loginInputType === 'mobile' && !/^\d{11}$/.test(userId)) {
        alert('لطفاً شماره موبایل معتبر (11 رقمی) وارد کنید');
        return;
    }
    if (loginInputType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userId)) {
        alert('لطفاً ایمیل معتبر وارد کنید');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, password })
        });
        const result = await response.json();

        if (!response.ok) {
            alert(result.error || 'خطا در ورود');
            return;
        }

        // ذخیره توکن و userId
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', userId);
        await initializeUser(); // اگه هنوز نیازه
        window.location.href = '/index.html';
    } catch (error) {
        console.error('Error during login:', error);
        alert('خطا در ارتباط با سرور');
    }
});

// ثبت‌نام کاربر
document.getElementById('signup-btn').addEventListener('click', async () => {
    const userId = document.getElementById('signup-userid-input').value;
    const password = document.getElementById('password-input').value;
    const confirmPassword = document.getElementById('confirm-password-input').value;

    if (!userId) {
        alert('لطفاً اطلاعات را وارد کنید');
        return;
    }
    if (signupInputType === 'mobile' && !/^\d{11}$/.test(userId)) {
        alert('لطفاً شماره موبایل معتبر (11 رقمی) وارد کنید');
        return;
    }
    if (signupInputType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userId)) {
        alert('لطفاً ایمیل معتبر وارد کنید');
        return;
    }
    if (password.length < 8) {
        alert('رمز عبور باید حداقل 8 کاراکتر باشد');
        return;
    }
    if (password !== confirmPassword) {
        alert('رمزهای عبور وارد شده یکسان نیستند');
        return;
    }

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, password })
        });
        const result = await response.json();

        if (!response.ok) {
            alert(result.error || 'خطا در ثبت‌نام');
            return;
        }

        // ورود خودکار بعد از ثبت‌نام
        const loginResponse = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, password })
        });
        const loginResult = await loginResponse.json();

        if (!loginResponse.ok) {
            alert(loginResult.error || 'خطا در ورود بعد از ثبت‌نام');
            return;
        }

        localStorage.setItem('token', loginResult.token);
        localStorage.setItem('userId', userId);
        await initializeUser();
        window.location.href = '/index.html';
    } catch (error) {
        console.error('Error during signup:', error);
        alert('خطا در ارتباط با سرور');
    }
});