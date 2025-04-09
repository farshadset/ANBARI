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

// Load purchase page data
const loadPurchasePageData = () => {
    populateStoreSelects();
    renderPurchaseList();
};

// Clear purchase form
const clearPurchaseForm = () => {
    purchaseQuantityInput.value = '';
    purchaseWeightInput.value = '';
    purchasePriceInput.value = '';
    purchaseExtraInfoInput.value = '';
};

// Add purchase
const addPurchase = () => {
    const storeId = purchaseStoreSelect.value;
    const itemId = purchaseItemSelect.value;
    const quantity = parseFloat(purchaseQuantityInput.value) || 0;
    const weight = parseFloat(purchaseWeightInput.value) || 0;
    const price = parseFloat(purchasePriceInput.value) || 0;
    const extraInfo = purchaseExtraInfoInput.value;
    
    if (!storeId || !itemId || (quantity <= 0 && weight <= 0) || price <= 0) {
        alert('لطفا تمام اطلاعات خرید را به درستی وارد کنید');
        return;
    }
    
    const newPurchase = {
        id: `p-${Date.now()}`,
        storeId,
        itemId,
        quantity,
        weight,
        price,
        extraInfo,
        timestamp: Date.now()
    };
    
    purchases.push(newPurchase);
    saveData();
    clearPurchaseForm();
    renderPurchaseList();
    showSuccessMessage('خرید با موفقیت ثبت شد');
};

// Render purchase list
const renderPurchaseList = (storeId = '') => {
    purchaseList.innerHTML = '';
    
    let filteredPurchases = storeId 
        ? purchases.filter(purchase => purchase.storeId === storeId)
        : purchases;
    
    // Sort by date descending (newest first)
    filteredPurchases = filteredPurchases.sort((a, b) => b.timestamp - a.timestamp);
    
    if (filteredPurchases.length === 0) {
        purchaseListEmpty.style.display = 'block';
        return;
    }
    
    purchaseListEmpty.style.display = 'none';
    
    filteredPurchases.forEach(purchase => {
        const item = items.find(i => i.id === purchase.itemId) || {};
        
        const card = document.createElement('div');
        card.className = 'purchase-card';
        card.dataset.purchaseId = purchase.id;
        
        const quantity = purchase.quantity || 0;
        const weight = purchase.weight || 0;
        const totalPrice = purchase.price * (quantity || weight);
        
        card.innerHTML = `
            <div class="purchase-card-header" style="display: flex; justify-content: space-between;">
                <span class="purchase-item-name" style="margin-left: 10px;">${item.name || 'کالای حذف شده'}</span>
                <span class="purchase-date" style="margin-right: 10px;">${formatDate(purchase.timestamp)}</span>
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
        
        deleteBtn.addEventListener('click', () => {
            if (confirm('آیا مطمئنی می‌خوای این خرید رو حذف کنی؟')) {
                const purchaseIndex = purchases.findIndex(p => p.id === purchase.id);
                if (purchaseIndex > -1) {
                    purchases.splice(purchaseIndex, 1);
                    saveData();
                    renderPurchaseList(storeId);
                    showSuccessMessage('خرید با موفقیت حذف شد');
                }
            }
        });
        
        purchaseList.appendChild(card);
    });
};

// Event listeners
purchaseStoreSelect.addEventListener('change', () => {
    const storeId = purchaseStoreSelect.value;
    if (storeId) {
        populateItemSelectsForPurchase(storeId);
    }
});

purchaseListStoreSelect.addEventListener('change', () => {
    renderPurchaseList(purchaseListStoreSelect.value);
});

confirmPurchaseBtn.addEventListener('click', addPurchase);

// Initialize purchase page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('purchase-page')) {
        loadPurchasePageData();
    }
});
