require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const retry = require('async-retry');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// فعال کردن trust proxy برای express-rate-limit
app.set('trust proxy', 1);

// تنظیم Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('متغیرهای محیطی SUPABASE_URL و SUPABASE_KEY باید تنظیم شوند.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));
app.use(cors());

app.use('/login', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// تابع برای مقداردهی اولیه دیتابیس
async function initializeDatabase() {
    try {
        await retry(
            async () => {
                const { data, error } = await supabase.from('users').select('*').limit(1);
                if (error) throw error;
                console.log('اتصال به دیتابیس با موفقیت انجام شد');
            },
            {
                retries: 3,
                factor: 2,
                minTimeout: 1000,
                maxTimeout: 5000,
                onRetry: (err) => console.log('تلاش مجدد برای اتصال به دیتابیس:', err.message),
            }
        );

        // ایجاد جدول‌ها در صورت عدم وجود
        const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS users (
        "userId" VARCHAR(255) PRIMARY KEY,
        password VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS stores (
        id VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        FOREIGN KEY("userId") REFERENCES users("userId") ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS items (
        id VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        importance VARCHAR(50) NOT NULL DEFAULT 'quantity',
        "weight" FLOAT DEFAULT 0,
        "quantity" INT DEFAULT 0,
        "extraInfo" TEXT,
        "dateAdded" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY("userId") REFERENCES users("userId") ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS purchases (
        id VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "storeId" VARCHAR(255) NOT NULL,
        "itemId" VARCHAR(255) NOT NULL,
        quantity INT DEFAULT 0,
        weight FLOAT DEFAULT 0,
        price FLOAT NOT NULL,
        "totalPrice" FLOAT NOT NULL,
        "extraInfo" TEXT,
        timestamp TIMESTAMP NOT NULL,
        FOREIGN KEY("userId") REFERENCES users("userId") ON DELETE CASCADE,
        FOREIGN KEY("storeId") REFERENCES stores(id) ON DELETE CASCADE,
        FOREIGN KEY("itemId") REFERENCES items(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS sales (
        id VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "storeId" VARCHAR(255) NOT NULL,
        "itemId" VARCHAR(255) NOT NULL,
        quantity INT DEFAULT 0,
        weight FLOAT DEFAULT 0,
        price FLOAT NOT NULL,
        "extraInfo" TEXT,
        timestamp TIMESTAMP NOT NULL,
        FOREIGN KEY("userId") REFERENCES users("userId") ON DELETE CASCADE,
        FOREIGN KEY("storeId") REFERENCES stores(id) ON DELETE CASCADE,
        FOREIGN KEY("itemId") REFERENCES items(id) ON DELETE CASCADE
      );
    `;
        const { error: createError } = await supabase.rpc('execute_sql', { query: createTablesQuery });
        if (createError) throw createError;
        console.log('جدول‌های دیتابیس مقداردهی شدند');
    } catch (error) {
        console.error('خطا در مقداردهی اولیه دیتابیس:', error.message);
        throw error;
    }
}

// احراز هویت توکن
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// مسیر ثبت‌نام
app.post('/signup', async (req, res) => {
    const { userId, password } = req.body;
    if (!userId || userId.length < 3) {
        return res.status(400).json({ error: 'User ID must be at least 3 characters long' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('userId', userId);
        if (fetchError) throw fetchError;
        if (existingUser && existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const { error: insertError } = await supabase
            .from('users')
            .insert([{ userId, password: hashedPassword, createdAt: new Date().toISOString() }]);
        if (insertError) throw insertError;

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('خطا در ثبت‌نام:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// مسیر ورود
app.post('/login', async (req, res) => {
    const { userId, password } = req.body;
    try {
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('userId', userId)
            .single(); // Expecting a single user object
        if (fetchError) throw fetchError;
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '1h' }); // Include userId in the token
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('خطا در ورود:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// مسیر ذخیره و بازیابی داده‌ها
app.get('/api/data', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const { data: storesData, error: fetchStoresError } = await supabase
            .from('stores')
            .select('*')
            .eq('userId', userId);
        if (fetchStoresError) throw fetchStoresError;

        const { data: itemsData, error: fetchItemsError } = await supabase
            .from('items')
            .select('*')
            .eq('userId', userId);
        if (fetchItemsError) throw fetchItemsError;

        const { data: purchasesData, error: fetchPurchasesError } = await supabase
            .from('purchases')
            .select('*')
            .eq('userId', userId);
        if (fetchPurchasesError) throw fetchPurchasesError;

        const { data: salesData, error: fetchSalesError } = await supabase
            .from('sales')
            .select('*')
            .eq('userId', userId);
        if (fetchSalesError) throw fetchSalesError;

        res.json({
            stores: storesData,
            items: itemsData,
            purchases: purchasesData,
            sales: salesData
        });
    } catch (error) {
        console.error('خطا در دریافت داده‌ها:', error);
        res.status(500).json({ error: 'Server error while fetching data' });
    }
});

app.post('/api/data', authenticateToken, async (req, res) => {
    const { stores, items, purchases, sales } = req.body;
    const userId = req.user.userId;

    try {
        // Delete existing data for the user
        await supabase.from('stores').delete().eq('userId', userId);
        await supabase.from('items').delete().eq('userId', userId);
        await supabase.from('purchases').delete().eq('userId', userId);
        await supabase.from('sales').delete().eq('userId', userId);

        // Insert new data with userId
        if (stores && stores.length > 0) {
            const { error: storesError } = await supabase.from('stores').insert(stores.map(store => ({ ...store, userId })));
            if (storesError) throw storesError;
        }

        if (items && items.length > 0) {
            const { error: itemsError } = await supabase.from('items').insert(items.map(item => ({ ...item, userId })));
            if (itemsError) throw itemsError;
        }

        if (purchases && purchases.length > 0) {
            const { error: purchasesError } = await supabase.from('purchases').insert(purchases.map(purchase => ({ ...purchase, userId })));
            if (purchasesError) throw purchasesError;
        }

        if (sales && sales.length > 0) {
            const { error: salesError } = await supabase.from('sales').insert(sales.map(sale => ({ ...sale, userId })));
            if (salesError) throw salesError;
        }

        res.json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Server error while saving data' });
    }
});

// مدیریت خطاها
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// راه‌اندازی سرور
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`سرور در پورت ${PORT} در حال اجرا است`);
    try {
        await initializeDatabase();
    } catch (error) {
        console.error('سرور به دلیل خطا در دیتابیس متوقف شد:', error.message);
        process.exit(1);
    }
});