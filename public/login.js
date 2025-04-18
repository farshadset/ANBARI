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
        let credentials;
        if (loginInputType === 'email') {
            credentials = { email: userId, password };
        } else {
            // برای ورود با موبایل، از ایمیل جعلی استفاده می‌کنیم
            credentials = { email: `${userId}@anbari.app`, password };
        }

        const { data, error } = await supabase.auth.signInWithPassword(credentials);

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                alert('کاربر یافت نشد یا رمز عبور اشتباه است. لطفاً ثبت‌نام کنید یا اطلاعات را بررسی کنید.');
            } else {
                alert('خطا در ورود: ' + error.message);
            }
            return;
        }

        // ذخیره userId با استفاده از initializeUser
        await initializeUser();
        window.location.href = '/index.html';
    } catch (error) {
        console.error('Error during login:', error);
        alert('خطا در ارتباط با سرور');
    }
});

// ثبت‌نام کاربر با Supabase
document.getElementById('signup-btn').addEventListener('click', async () => {
    const userId = document.getElementById('signup-userid-input').value;
    const password = document.getElementById('password-input').value;
    const confirmPassword = document.getElementById('confirm-password-input').value;

    // اعتبارسنجی
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
        let credentials;
        if (signupInputType === 'email') {
            credentials = { email: userId, password };
        } else {
            // برای ثبت‌نام با موبایل، از ایمیل جعلی استفاده می‌کنیم
            credentials = { email: `${userId}@anbari.app`, password };
        }

        const { data, error } = await supabase.auth.signUp(credentials);

        if (error) {
            if (error.message.includes('User already registered')) {
                alert('این کاربر قبلاً ثبت‌نام کرده است. لطفاً وارد شوید.');
            } else {
                alert('خطا در ثبت‌نام: ' + error.message);
            }
            return;
        }

        // ذخیره userId با استفاده از initializeUser
        await initializeUser();
        window.location.href = '/index.html';
    } catch (error) {
        console.error('Error during signup:', error);
        alert('خطا در ارتباط با سرور');
    }
});