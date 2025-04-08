const express = require('express');
const fs = require('fs');
const app = express();

// Middleware برای پردازش داده‌های JSON
app.use(express.json());
// سرو کردن فایل‌های استاتیک (HTML، CSS، JS)
app.use(express.static('.'));

// لود کردن داده‌های کاربران
let users = {};
if (fs.existsSync('users.json')) {
    const rawUsers = fs.readFileSync('users.json');
    users = JSON.parse(rawUsers);
}

// لود کردن داده‌های تراکنش‌ها
let allData = {};
if (fs.existsSync('data.json')) {
    const rawData = fs.readFileSync('data.json');
    allData = JSON.parse(rawData);
}

// ثبت‌نام کاربر
app.post('/signup', (req, res) => {
    const { userId, password } = req.body;
    if (users[userId]) {
        res.status(400).send('User already exists');
        return;
    }
    users[userId] = { password, createdAt: new Date().toISOString() };
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    res.send('User registered successfully');
});

// ورود کاربر
app.post('/login', (req, res) => {
    const { userId, password } = req.body;
    const user = users[userId];
    if (!user) {
        res.status(404).send('User not found');
        return;
    }
    if (user.password !== password) {
        res.status(401).send('Invalid password');
        return;
    }
    res.send('Login successful');
});

// ذخیره داده‌های تراکنش
app.post('/submit', (req, res) => {
    const { userId, type, store, item, quantity, weight, price, extraInfo, date } = req.body;
    if (!users[userId]) {
        res.status(404).send('User not found');
        return;
    }
    if (!allData[userId]) {
        allData[userId] = { purchases: [], sales: [] };
    }
    const entry = { store, item, quantity, weight, price, extraInfo, date };
    if (type === 'purchase') {
        allData[userId].purchases.push(entry);
    } else if (type === 'sale') {
        allData[userId].sales.push(entry);
    }
    fs.writeFileSync('data.json', JSON.stringify(allData, null, 2));
    res.send('Data saved!');
});

// دریافت داده‌های کاربر
app.get('/user-data', (req, res) => {
    const userId = req.query.userId;
    if (!userId || !users[userId]) {
        res.status(404).send('User not found');
        return;
    }
    res.json(allData[userId] || { purchases: [], sales: [] });
});

// دریافت داده‌های همه‌ی کاربران برای مدیر (با احراز هویت ساده)
app.get('/admin-data', (req, res) => {
    const authHeader = req.headers['authorization'];
    const validCredentials = Buffer.from('admin:password').toString('base64'); // رمز عبور: admin:password
    if (authHeader !== `Basic ${validCredentials}`) {
        res.status(401).send('Unauthorized');
        return;
    }
    res.json(allData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));