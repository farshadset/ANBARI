import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    // استخراج توکن از هدر
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // اعتبارسنجی توکن و دریافت اطلاعات کاربر
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid token', details: authError?.message });
        }

        // استخراج userId از user.id (همون چیزی که توی localStorage ذخیره کردیم)
        const userId = user.id;

        // دریافت داده‌ها از جداول مختلف با فیلتر userId
        const { data: purchases, error: purchasesError } = await supabase
            .from('purchases')
            .select('*')
            .eq('userid', userId);

        const { data: stores, error: storesError } = await supabase
            .from('stores')
            .select('*')
            .eq('userid', userId);

        const { data: items, error: itemsError } = await supabase
            .from('items')
            .select('*')
            .eq('userid', userId);

        const { data: sales, error: salesError } = await supabase
            .from('sales')
            .select('*')
            .eq('userid', userId);

        // بررسی خطاها
        if (purchasesError) {
            throw new Error(`Error fetching purchases: ${purchasesError.message}`);
        }
        if (storesError) {
            throw new Error(`Error fetching stores: ${storesError.message}`);
        }
        if (itemsError) {
            throw new Error(`Error fetching items: ${itemsError.message}`);
        }
        if (salesError) {
            throw new Error(`Error fetching sales: ${salesError.message}`);
        }

        // ارسال داده‌ها به کلاینت
        return res.status(200).json({
            stores: stores || [],
            items: items || [],
            purchases: purchases || [],
            sales: sales || []
        });

    } catch (error) {
        console.error('Error in /api/data:', error);
        return res.status(500).json({ error: 'Error fetching data', details: error.message });
    }
}