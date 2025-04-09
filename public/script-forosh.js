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
const addSale = () => {
    const storeId = salesStoreSelect.value;
    const itemId = salesItemSelect.value;
    const quantity = parseFloat(salesQuantityInput.value) || 0;
    const weight = parseFloat(salesWeightInput.value) || 0;
    const price = parseFloat(salesPriceInput.value) || 0;
    const extraInfo = salesExtraInfoInput.value;
    
    if (!storeId || !itemId || (quantity <= 0 && weight <= 0) || price <= 0) {
        alert('لطفا تمام اطلاعات فروش را به درستی وارد کنید');
        return;
    }
    
    const newSale = {
        id: `s-${Date.now()}`,
        storeId,
        itemId,
        quantity,
        weight,
        price,
        extraInfo,
        timestamp: Date.now()
    };
    
    sales.push(newSale);
    saveData();
    clearSalesForm();
    renderSalesList(salesStoreSelect.value);
    showSuccessMessage('فروش با موفقیت ثبت شد');
};

// Render sales list
const renderSalesList = (storeId = '') => {
    salesList.innerHTML = '';
    
    let filteredSales = storeId 
        ? sales.filter(sale => sale.storeId === storeId)
        : sales;
    
    // Sort by date descending (newest first)
    filteredSales = filteredSales.sort((a, b) => b.timestamp - a.timestamp);
    
    if (filteredSales.length === 0) {
        salesListEmpty.style.display = 'block';
        return;
    }
    
    salesListEmpty.style.display = 'none';
    
    filteredSales.forEach(sale => {
        const item = items.find(i => i.id === sale.itemId) || {};
        
        const card = document.createElement('div');
        card.className = 'purchase-card';
        card.dataset.saleId = sale.id;
        
        const quantity = sale.quantity || 0;
        const weight = sale.weight || 0;
        const totalPrice = sale.price * (quantity || weight);
        
        card.innerHTML = `
            <div class="purchase-card-header">
                <span class="item-name">${item.name || 'کالای حذف شده'}</span>
                <span class="item-date">${formatDate(sale.timestamp)}</span>
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
        
        salesList.appendChild(card);
    });
};

// Event listeners
salesStoreSelect.addEventListener('change', () => {
    const storeId = salesStoreSelect.value;
    if (storeId) {
        populateItemSelectsForSale(storeId);
        renderSalesList(storeId);
    }
});

confirmSaleBtn.addEventListener('click', () => {
    addSale();
    renderSalesList(salesStoreSelect.value);
});

// Initialize sales page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('sales-page')) {
        loadSalesPageData();
    }
});