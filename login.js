// login.js

// Initialize Supabase Client
const supabase = createClient('https://cdvsfkhquvxdjiljrhkg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdnNma2hxdXZ4ZGppbGpyaGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTY4NTYsImV4cCI6MjA1OTc5Mjg1Nn0.iHHiFcV5OYoxRnmupxgU7WZ8FpqGv29n7xqL6Lztlgg');

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAVeD00n7_Ma-TeqSbHnC1aKe8VmXsX7l8",
    authDomain: "anbari-c55a5.firebaseapp.com",
    projectId: "anbari-c55a5",
    storageBucket: "anbari-c55a5.firebasestorage.app",
    messagingSenderId: "554168567704",
    appId: "1:554168567704:web:503accabd09bb60f860ded",
    measurementId: "G-SKP280NV61"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const authForm = document.getElementById('auth-form');
const authBtn = document.getElementById('auth-btn');
const toggleAuth = document.getElementById('toggle-auth');
const messageDiv = document.getElementById('message');
const googleSignup = document.getElementById('google-signup');
let isLoginMode = true;

function showMessage(message, isError = true) {
    messageDiv.textContent = message;
    messageDiv.className = isError ? 'error-message' : 'success-message';
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Toggle between login and signup
toggleAuth.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    authBtn.textContent = isLoginMode ? 'ورود' : 'ثبت‌نام';
    toggleAuth.textContent = isLoginMode ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : 'قبلاً حساب کاربری دارید؟ وارد شوید';
    googleSignup.style.display = isLoginMode ? 'none' : 'block';
    messageDiv.style.display = 'none';
});

// Login with Google
window.loginWithGoogle = function() {
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            showMessage(`خوش آمدید، ${user.displayName}!`, false);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        })
        .catch((error) => {
            showMessage(`خطا در ورود با گوگل: ${error.message}`);
        });
};

// Form submission for phone/password login/signup
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    try {
        if (isLoginMode) {
            // Login with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                phone,
                password
            });
            if (error) throw error;
            showMessage('ورود با موفقیت انجام شد!', false);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            // Signup with Supabase
            const { data, error } = await supabase.auth.signUp({
                phone,
                password
            });
            if (error) throw error;
            showMessage('ثبت‌نام با موفقیت انجام شد! لطفاً وارد شوید.', false);
            isLoginMode = true;
            authBtn.textContent = 'ورود';
            toggleAuth.textContent = 'حساب کاربری ندارید؟ ثبت‌نام کنید';
            googleSignup.style.display = 'none';
        }
    } catch (error) {
        showMessage(error.message || 'خطایی رخ داد. لطفاً دوباره امتحان کنید.');
    }
});

// Check if user is already logged in
supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
        window.location.href = 'index.html';
    }
});