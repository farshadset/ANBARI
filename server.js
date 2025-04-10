const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const { Pool } = require('pg');
const app = express();

// تنظیمات اتصال به Supabase (PostgreSQL)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:farzad82@db.eqvntgatghetawqgzfrj.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
});

// Middleware برای پردازش داده‌های JSON
app.use(express.json());
// سرو کردن فایل‌های استاتیک از پوشه public
app.use(express.static(path.join(__dirname, 'public')));

// روت برای مسیر ریشه (/)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// روت صریح برای login.html
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// روت صریح برای admin.html
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ایجاد جداول اگه وجود نداشته باشن
async function initializeDatabase() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                userId VARCHAR(255) PRIMARY KEY,
                password VARCHAR(255) NOT NULL,
                createdAt VARCHAR(255) NOT NULL
            )
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS data (
                id SERIAL PRIMARY KEY,
                userId VARCHAR(255),
                type VARCHAR(50),
                store VARCHAR(255),
                item VARCHAR(255),
                quantity INT,
                weight FLOAT,
                price FLOAT,
                extraInfo TEXT,
                date VARCHAR(255),
                FOREIGN KEY(userId) REFERENCES users(userId)
            )
        `);
        console.log('Database tables initialized');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        client.release();
    }
}
initializeDatabase();

// ثبت‌نام کاربر
app.post('/signup', async (req, res) => {
    const { userId, password } = req.body;
    let client;
    try {
        client = await pool.connect();

        // چک کردن اینکه آیا کاربر وجود داره
        const result = await client.query('SELECT * FROM users WHERE userId = $1', [userId]);
        if (result.rows.length > 0) {
            res.status(400).send('User already exists');
            return;
        }

        // رمزنگاری رمز عبور
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.query(
            'INSERT INTO users (userId, password, createdAt) VALUES ($1, $2, $3)',
            [userId, hashedPassword, new Date().toISOString()]
        );
        res.send('User registered successfully');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Server error during signup');
    } finally {
        if (client) client.release();
    }
});

// ورود کاربر
app.post('/login', async (req, res) => {
    const { userId, password } = req.body;
    let client;
    try {
        client = await pool.connect();

        const result = await client.query('SELECT * FROM users WHERE userId = $1', [userId]);
        if (result.rows.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        // مقایسه رمز عبور
        const isMatch = await bcrypt.compare(password, result.rows[0].password);
        if (!isMatch) {
            res.status(401).send('Invalid password');
            return;
        }
        res.send('Login successful');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error during login');
    } finally {
        if (client) client.release();
    }
});

// ذخیره داده‌های تراکنش
app.post('/submit', async (req, res) => {
    const { userId, type, store, item, quantity, weight, price, extraInfo, date } = req.body;
    let client;
    try {
        client = await pool.connect();

        // چک کردن وجود کاربر
        const userResult = await client.query('SELECT * FROM users WHERE userId = $1', [userId]);
        if (userResult.rows.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        await client.query(
            'INSERT INTO data (userId, type, store, item, quantity, weight, price, extraInfo, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [userId, type, store, item, quantity, weight, price, extraInfo, date]
        );
        res.send('Data saved!');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Server error while saving data');
    } finally {
        if (client) client.release();
    }
});

// دریافت داده‌های کاربر
app.get('/user-data', async (req, res) => {
    const userId = req.query.userId;
    let client;
    try {
        client = await pool.connect();

        const userResult = await client.query('SELECT * FROM users WHERE userId = $1', [userId]);
        if (userResult.rows.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const dataResult = await client.query('SELECT * FROM data WHERE userId = $1', [userId]);
        const result = { purchases: [], sales: [] };
        dataResult.rows.forEach((row) => {
            const entry = { store: row.store, item: row.item, quantity: row.quantity, weight: row.weight, price: row.price, extraInfo: row.extraInfo, date: row.date };
            if (row.type === 'purchase') {
                result.purchases.push(entry);
            } else if (row.type === 'sale') {
                result.sales.push(entry);
            }
        });

        res.json(result);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Server error while fetching user data');
    } finally {
        if (client) client.release();
    }
});

// دریافت داده‌های همه‌ی کاربران برای مدیر (با احراز هویت ساده)
app.get('/admin-data', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const validCredentials = Buffer.from('admin:password').toString('base64'); // رمز عبور: admin:password
    if (authHeader !== `Basic ${validCredentials}`) {
        res.status(401).send('Unauthorized');
        return;
    }
    let client;
    try {
        client = await pool.connect();

        const dataResult = await client.query('SELECT * FROM data');
        const result = {};
        dataResult.rows.forEach((row) => {
            if (!result[row.userId]) {
                result[row.userId] = { purchases: [], sales: [] };
            }
            const entry = { store: row.store, item: row.item, quantity: row.quantity, weight: row.weight, price: row.price, extraInfo: row.extraInfo, date: row.date };
            if (row.type === 'purchase') {
                result[row.userId].purchases.push(entry);
            } else if (row.type === 'sale') {
                result[row.userId].sales.push(entry);
            }
        });

        res.json(result);
    } catch (error) {
        console.error('Error fetching admin data:', error);
        res.status(500).send('Server error while fetching admin data');
    } finally {
        if (client) client.release();
    }
});

// گوش دادن به پورت (پورت محیطی برای Vercel)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// بستن pool موقع خاموش شدن سرور
process.on('SIGINT', async () => {
    await pool.end();
    console.log('PostgreSQL connection pool closed');
    process.exit(0);
});