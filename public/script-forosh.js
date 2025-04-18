import { supabaseClient as supabase, populateStoreSelects, formatDate, formatPrice, showSuccessMessage, stores, items, purchases, sales, fetchDataFromServer, calculateInventory, populateItemSelectsForSale } from './script.js';

// Sales Page Functionality - Mirror of Purchase Page
const salesStoreSelect = document.getElementById('sales-store-select');
const salesItemSelect = document.getElementById('sales-item-select');
const salesQuantityInput = document.getElementById('sales-quantity');
const salesWeightInput = document.getElementById('sales-weight');
const salesPriceInput = document.getElementById('sales-price');
const salesExtraInfoInput = document.getElementById('sales-extra-info');
const confirmSaleBtn = document.getElementById('confirm-sale-btn');
const salesListEmpty = document.getElementById('sales-list-empty');
const salesList = document.getElementById('sales-list');

// Load sales page data
const loadSalesPageData = () => {
    populateStoreSelects();
    renderSalesList(salesStoreSelect.value);
};

// Clear sales form
const clearSalesForm = () => {
    salesQuantityInput.value = '';
    salesWeightInput.value = '';
    salesPriceInput.value = '';
    salesExtraInfoInput.value = '';
};

// Add sale
const addSale = async () => {
    const store = salesStoreSelect.value;
    const item = salesItemSelect.value;
    const quantity = parseFloat(salesQuantityInput.value) || 0;
    const weight = parseFloat(salesWeightInput.value) || 0;
    const price = parseFloat(salesPriceInput.value) || 0;
    const extraInfo = salesExtraInfoInput.value;
    
    if (!store || !item || (quantity <= 0 && weight <= 0) || price <= 0) {
        alert('لطفا تمام اطلاعات فروش را به درستی وارد کنید');
        return;
    }
    
    const selectedItem = items.find(i => i.id === item);
    if (!selectedItem) {
        alert('کالای انتخاب شده یافت نشد');
        return;
    }
    
    const inventory = calculateInventory(store, item);
    if (selectedItem.importance === 'quantity' && quantity > inventory.quantity) {
        alert(`موجودی کافی نیست. موجودی فعلی: ${inventory.quantity} عدد`);
        return;
    }
    if (selectedItem.importance === 'weight' && weight > inventory.weight) {
        alert(`موجودی کافی نیست. موجودی فعلی: ${inventory.weight.toFixed(2)} کیلوگرم`);
        return;
    }
    
    const saleData = {
        id: `s-${Date.now()}`,
        type: 'sale',
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
        const { error } = await supabase.from('data').insert([saleData]);
        if (error) throw error;
        
        clearSalesForm();
        renderSalesList(salesStoreSelect.value);
        showSuccessMessage('فروش با موفقیت ثبت شد');
    } catch (error) {
        console.error('Error adding sale:', error);
        alert('خطا در ثبت فروش');
    }
};

// Render sales list
const renderSalesList = async (store = '') => {
    salesList.innerHTML = '';
    
    const userId = localStorage.getItem('userId');
    let query = supabase
        .from('data')
        .select('*')
        .eq('userId', userId)
        .eq('type', 'sale');
    
    if (store) {
        query = query.eq('store', store);
    }
    
    const { data: salesData, error } = await query;
    
    if (error) {
        console.error('Error rendering sales list:', error);
        return;
    }
    
    if (salesData.length === 0) {
        salesListEmpty.style.display = 'block';
        return;
    }
    
    salesListEmpty.style.display = 'none';
    
    salesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).forEach(sale => {
        const item = items.find(i => i.id === sale.item) || {};
        
        const card = document.createElement('div');
        card.className = 'purchase-card';
        card.dataset.saleId = sale.id;
        
        const quantity = sale.quantity || 0;
        const weight = sale.weight || 0;
        const totalPrice = sale.price * (quantity || weight);
        
        card.innerHTML = `
            <div class="purchase-card-header">
                <span class="item-name">${item.name || 'کالای حذف شده'}</span>
                <span class="item-date">${formatDate(new Date(sale.date).getTime())}</span>
                <div class="icon-container">
                    <button class="edit-btn"><i class="fas fa-pencil-alt"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="item-details">
                <div class="details-row">
                    <span class="quantity-weight">${quantity > 0 ? `تعداد: ${quantity} عدد` : `وزن: ${weight.toFixed(2)} کیلوگرم`}</span>
                    <span class="unit-price">قیمت واحد: ${formatPrice(sale.price)} تومان</span>
                </div>
                <div class="details-row">
                    <span class="total-price">قیمت کل: ${formatPrice(totalPrice)} تومان</span>
                </div>
                ${sale.extraInfo ? `<div class="extra-info">${sale.extraInfo}</div>` : ''}
            </div>
        `;
        
        const deleteBtn = card.querySelector('.delete-btn');
        
        deleteBtn.addEventListener('click', async () => {
            if (confirm('آیا مطمئنی می‌خوای این فروش رو حذف کنی؟')) {
                const { error } = await supabase
                    .from('data')
                    .delete()
                    .eq('id', sale.id)
                    .eq('userId', userId);
                
                if (error) {
                    console.error('Error deleting sale:', error);
                    alert('خطا در حذف فروش');
                    return;
                }
                
                renderSalesList(store);
                showSuccessMessage('فروش با موفقیت حذف شد');
            }
        });
        
        const editBtn = card.querySelector('.edit-btn');
        
        editBtn.addEventListener('click', () => {
            alert('ویرایش فروش در نسخه بعدی اضافه خواهد شد');
        });
        
        salesList.appendChild(card);
    });
};

// Event listeners
salesStoreSelect.addEventListener('change', () => {
    const store = salesStoreSelect.value;
    if (store) {
        populateItemSelectsForSale(store);
        renderSalesList(store);
    }
});

confirmSaleBtn.addEventListener('click', addSale);

// Initialize sales page
document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('sales-page')) {
        await fetchDataFromServer();
        loadSalesPageData();
    }
});