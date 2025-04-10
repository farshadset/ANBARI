const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// تنظیمات اتصال به Supabase (PostgreSQL)
const pool = new Pool({
    connectionString: 'postgresql://postgres:farzad82@db.eqvntgatghetawqgzfrj.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
});

// داده‌های فعلی از users.json
const usersData = {
    "09331676817": {
        "createdAt": "2025-04-08T16:44:58.401Z"
    },
    "09331676818": {
        "password": "farzad82",
        "createdAt": "2025-04-08T20:49:23.280Z"
    }
};

async function migrateData() {
    let client;
    try {
        // اتصال به دیتابیس
        client = await pool.connect();
        console.log('Connected to Supabase (PostgreSQL) database');

        // ایجاد جدول users اگه وجود نداشته باشه
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                userId VARCHAR(255) PRIMARY KEY,
                password VARCHAR(255) NOT NULL,
                createdAt VARCHAR(255) NOT NULL
            )
        `);

        // پاک کردن داده‌های قبلی (اختیاری)
        await client.query('DELETE FROM users');

        // انتقال داده‌ها
        for (const userId in usersData) {
            const user = usersData[userId];
            let hashedPassword = null;

            // اگه کاربر رمز عبور داره، رمزنگاری کن
            if (user.password) {
                hashedPassword = await bcrypt.hash(user.password, 10);
            } else {
                // اگه رمز عبور نداره، یه رمز پیش‌فرض بذار
                hashedPassword = await bcrypt.hash('defaultpassword123', 10);
            }

            await client.query(
                'INSERT INTO users (userId, password, createdAt) VALUES ($1, $2, $3)',
                [userId, hashedPassword, user.createdAt]
            );
            console.log(`Migrated user: ${userId}`);
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        if (client) {
            client.release();
            console.log('PostgreSQL connection closed');
        }
        await pool.end();
    }
}

migrateData();