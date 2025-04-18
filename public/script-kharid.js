import { supabase, populateStoreSelects, formatDate, formatPrice, showSuccessMessage } from './script.js';

// Purchase Page Functionality - Mirror of Sales Page
const purchaseStoreSelect = document.getElementById('purchase-store-select');
const purchaseItemSelect = document.getElementById('purchase-item-select');
const purchaseQuantityInput = document.getElementById('purchase-quantity');
const purchaseWeightInput = document.getElementById('purchase-weight');
const purchasePriceInput = document.getElementById('purchase-price');
const purchaseExtraInfoInput = document.getElementById('purchase-extra-info');
const confirmPurchaseBtn = document.getElementById('confirm-purchase-btn');
const purchaseListStoreSelect = document.getElementById('purchase-list-store-select');
const purchaseListEmpty = document.getElementById('purchase-list-empty');
const purchaseList = document.getElementById('purchase-list');

// load purchase page data 
const loadPurchasePageData = () => {
    populateStoreSelects();
    renderPurchaseList(purchaseListStoreSelect.value); // اضافه کردن store برای رندر لیست
};

// Clear purchase form
const clearPurchaseForm = () => {
    purchaseQuantityInput.value = '';
    purchaseWeightInput.value = '';
    purchasePriceInput.value = '';
    purchaseExtraInfoInput.value = '';
};

// Add purchase
const addPurchase = async () => {
    const store = purchaseStoreSelect.value;
    const item = purchaseItemSelect.value;
    const quantity = parseFloat(purchaseQuantityInput.value) || 0;
    const weight = parseFloat(purchaseWeightInput.value) || 0;
    const price = parseFloat(purchasePriceInput.value) || 0;
    const extraInfo = purchaseExtraInfoInput.value;

    if (!store || !item || (quantity <= 0 && weight <= 0) || price <= 0) {
        alert('لطفا تمام اطلاعات خرید را به درستی وارد کنید');
        return;
    }

    const purchaseData = {
        id: `p-${Date.now()}`, // اضافه کردن id برای هماهنگی با ساختار جدول
        type: 'purchase',
        store,
        item,
        quantity,
        weight,
        price,
        date: new Date().toISOString(),
        userId: localStorage.getItem('userId'),
        extraInfo
    };

    try {
        const { error } = await supabase.from('data').insert([purchaseData]);
        if (error) throw error;

        clearPurchaseForm();
        renderPurchaseList(purchaseListStoreSelect.value); // اضافه کردن store برای رندر لیست
        showSuccessMessage('خرید با موفقیت ثبت شد');
    } catch (error) {
        console.error('Error adding purchase:', error);
        alert('خطا در ثبت خرید');
    }
};

// Render purchase list
const renderPurchaseList = async (store = '') => {
    const userId = localStorage.getItem('userId');
    let query = supabase
        .from('data')
        .select('*')
        .eq('userId', userId)
        .eq('type', 'purchase');

    if (store) {
        query = query.eq('store', store);
    }

    const { data: purchases, error } = await query;

    if (error) {
        console.error('Error rendering purchase list:', error);
        return;
    }

    purchaseList.innerHTML = '';

    if (purchases.length === 0) {
        purchaseListEmpty.style.display = 'block';
        return;
    }

    purchaseListEmpty.style.display = 'none';

    purchases.forEach(purchase => {
        const card = document.createElement('div');
        card.className = 'purchase-card';
        card.dataset.purchaseId = purchase.id;

        const quantity = purchase.quantity || 0;
        const weight = purchase.weight || 0;
        const totalPrice = purchase.price * (quantity || weight);

        card.innerHTML = `
            <div class="purchase-card-header" style="display: flex; justify-content: space-between;">
                <span class="purchase-item-name" style="margin-left: 10px;">${purchase.item || 'کالای حذف شده'}</span>
                <span class="purchase-date" style="margin-right: 10px;">${formatDate(new Date(purchase.date).getTime())}</span>
            </div>
            <div class="purchase-details">
                <div class="quantity-price" style="display: flex; gap: 60px;">
                    <span class="quantity" style="font-size: 1em; font-family: inherit; font-weight: bold;">${quantity > 0 ? `تعداد: ${quantity} عدد` : `وزن: ${weight.toFixed(2)} کیلوگرم`}</span>
                </div>
                <div class="total-price-extra">
                    <span class="total-price" style="font-size: 1em; font-family: inherit; font-weight: bold;">قیمت کل: ${formatPrice(totalPrice)} تومان</span>
                    <span class="unit-price" style="margin-right: 10px;">قیمت واحد: ${formatPrice(purchase.price)} تومان</span>
                </div>
                ${purchase.extraInfo ? `
                <div style="border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px; text-align: center;">
                    <span class="extra-info" style="color: #666; font-style: italic;">${purchase.extraInfo}</span>
                </div>
                ` : ''}
            </div>
            <button class="delete-btn" title="حذف" style="position: absolute; left: 10px; bottom: 10px;"><i class="fas fa-trash-alt"></i></button>
        `;

        const deleteBtn = card.querySelector('.delete-btn');

        deleteBtn.addEventListener('click', async () => {
            if (confirm('آیا مطمئنی می‌خوای این خرید رو حذف کنی؟')) {
                const { error } = await supabase
                    .from('data')
                    .delete()
                    .eq('id', purchase.id)
                    .eq('userId', userId);

                if (error) {
                    console.error('Error deleting purchase:', error);
                    alert('خطا در حذف خرید');
                    return;
                }

                renderPurchaseList(store);
                showSuccessMessage('خرید با موفقیت حذف شد');
            }
        });

        purchaseList.appendChild(card);
    });
};

// Event listeners
purchaseStoreSelect.addEventListener('change', () => {
    const store = purchaseStoreSelect.value; // تغییر از storeId به store
    if (store) {
        populateItemSelectsForPurchase(store);
    }
});

purchaseListStoreSelect.addEventListener('change', () => {
    renderPurchaseList(purchaseListStoreSelect.value);
});

confirmPurchaseBtn.addEventListener('click', addPurchase);

// Initialize purchase page
document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('purchase-page')) {
        await fetchDataFromServer(); // این تابع توی script.js تعریف شده
        loadPurchasePageData();
    }
});