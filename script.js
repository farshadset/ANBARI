// Initialize Supabase Client
const supabaseUrl = 'https://cdvsfkhquvxdjiljrhkg.supabase.co'; // جایگزین با URL پروژه Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdnNma2hxdXZ4ZGppbGpyaGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTY4NTYsImV4cCI6MjA1OTc5Mjg1Nn0.iHHiFcV5OYoxRnmupxgU7WZ8FpqGv29n7xqL6Lztlgg'; // جایگزین با Public Key پروژه Supabase
const supabase = Supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const body = document.body;
    const appHeader = document.querySelector('.app-header');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const infoBtn = document.getElementById('info-btn');
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-btn');
    const content = document.querySelector('.content');
            
    // Stores Page
    const addStoreBtn = document.getElementById('add-store-btn');
    const newStoreNameInput = document.getElementById('new-store-name');
    const storesList = document.getElementById('stores-list');
    const editStoreModal = document.getElementById('edit-store-modal');
    const editStoreNameInput = document.getElementById('edit-store-name-input');
    const editStoreIdInput = document.getElementById('edit-store-id-input');
    const confirmEditStoreBtn = document.getElementById('confirm-edit-store-btn');
    const deleteStoreBtn = document.getElementById('delete-store-btn');

    // Items Page
    const addItemBtn = document.getElementById('add-item-btn');
    const newItemNameInput = document.getElementById('new-item-name');
    const itemsList = document.getElementById('items-list');
    const itemDetailsModal = document.getElementById('item-details-modal');
    const itemModalTitle = document.getElementById('item-modal-title');
    const editItemIdInput = document.getElementById('edit-item-id-input');
    const itemModalName = document.getElementById('item-modal-name');
    const itemModalImportanceRadios = document.querySelectorAll('input[name="item-importance"]');
    const confirmItemDetailsBtn = document.getElementById('confirm-item-details-btn');
    const deleteItemBtn = document.createElement('button');

    // Purchase Page
    const purchaseStoreSelect = document.getElementById('purchase-store-select');
    const purchaseItemSelect = document.getElementById('purchase-item-select');
    const purchaseQuantityInput = document.getElementById('purchase-quantity');
    const purchaseWeightInput = document.getElementById('purchase-weight');
    const purchasePriceInput = document.getElementById('purchase-price');
    const purchaseExtraInfoInput = document.getElementById('purchase-extra-info');
    const confirmPurchaseBtn = document.getElementById('confirm-purchase-btn');
    const purchaseListContainer = document.getElementById('purchase-list-container');
    const purchaseListContainerInner = document.getElementById('purchase-list-container-inner');
    const purchaseListEmpty = document.getElementById('purchase-list-empty');
    const purchaseListGrid = document.getElementById('purchase-list');
    const purchaseListStoreSelect = document.getElementById('purchase-list-store-select');

    // Sales Page
    const salesStoreSelect = document.getElementById('sales-store-select');
    const salesItemSelect = document.getElementById('sales-item-select');
    const salesItemStock = document.getElementById('sales-item-stock');
    const salesQuantityInput = document.getElementById('sales-quantity');
    const salesWeightInput = document.getElementById('sales-weight');
    const salesPriceInput = document.getElementById('sales-price');
    const salesExtraInfoInput = document.getElementById('sales-extra-info');
    const confirmSaleBtn = document.getElementById('confirm-sale-btn');
    const confirmEditSaleBtn = document.getElementById('confirm-edit-sale-btn') || null;
    const deleteSaleBtn = document.getElementById('delete-sale-btn') || null;
    const salesLogGrouped = document.getElementById('sales-log-grouped');
    const salesListContainer = document.getElementById('sales-list-container');
    const salesItemsList = document.getElementById('sales-items-list');
    const salesListStoreSelect = document.getElementById('sales-list-store-select');

    // Tools Page
    const inventoryStoreSelect = document.getElementById('inventory-store-select');
    const inventoryList = document.getElementById('inventory-list');
    const salesControlStoreSelect = document.getElementById('sales-control-store-select');
    const salesControlList = document.getElementById('sales-control-list');
    const advancedSearchInput = document.getElementById('advanced-search-input');
    const runAdvancedSearchBtn = document.getElementById('run-advanced-search-btn');
    const advancedSearchResults = document.getElementById('advanced-search-results');

    // Date Picker Modal
    const datePickerModal = document.getElementById('date-picker-modal');
    const calendarType = document.getElementById('calendar-type');
    const dateYear = document.getElementById('date-year');
    const dateMonth = document.getElementById('date-month');
    const dateDay = document.getElementById('date-day');
    const dateHour = document.getElementById('date-hour');
    const confirmDateBtn = document.getElementById('confirm-date-btn');

    // Info Modal
    const infoModal = document.getElementById('info-modal');

    // Creator Info Modal
    const creatorInfoBtn = document.getElementById('creator-info-btn');
    const creatorInfoModal = document.getElementById('creator-info-modal');
    const donateLink = document.getElementById('donate-link');
    const copySuccess = document.getElementById('copy-success');

    // Custom Date Picker
    const customDatePickerModal = document.getElementById('custom-date-picker-modal');
    const calendarTypeBtns = document.querySelectorAll('.calendar-type-btn');
    const customDateYear = document.getElementById('custom-date-year');
    const customDateMonth = document.getElementById('custom-date-month');
    const customDateDay = document.getElementById('custom-date-day');
    const customDateHour = document.getElementById('custom-date-hour');
    const confirmCustomDateBtn = document.getElementById('confirm-custom-date-btn');
    let currentCalendarType = 'shamsi';

    // متغیرهای مدال ویرایش خرید
    const editPurchaseModal = document.getElementById('edit-purchase-modal');
    const editPurchaseIdInput = document.getElementById('edit-purchase-id-input');
    const editPurchaseStoreSelect = document.getElementById('edit-purchase-store-select');
    const editPurchaseItemSelect = document.getElementById('edit-purchase-item-select');
    const editPurchaseQuantity = document.getElementById('edit-purchase-quantity');
    const editPurchaseWeight = document.getElementById('edit-purchase-weight');
    const editPurchasePrice = document.getElementById('edit-purchase-price');
    const editPurchaseExtraInfo = document.getElementById('edit-purchase-extra-info');
    const editPurchaseTimestampDisplay = document.getElementById('edit-purchase-timestamp-display');
    const editPurchaseDateBtn = document.getElementById('edit-purchase-date-btn');
    const confirmEditPurchaseBtn = document.getElementById('confirm-edit-purchase-btn');
    const deletePurchaseBtn = document.getElementById('delete-purchase-btn');

    // متغیرهای جدید برای رفع خطاها
    const editSaleDateBtn = document.getElementById('edit-sale-date-btn') || null;
    const displayPurchaseFormTitle = document.getElementById('purchase-form-title') || { textContent: '' };
    const purchaseFormTitle = document.getElementById('purchase-form-title') || { textContent: '' };

    // --- Data Storage ---
    let stores = JSON.parse(localStorage.getItem('anbari_stores_v2')) || [];
    let items = JSON.parse(localStorage.getItem('anbari_items_v2')) || [];
    let purchases = JSON.parse(localStorage.getItem('anbari_purchases_v2')) || [];
    let sales = JSON.parse(localStorage.getItem('anbari_sales_v2')) || [];

    // --- Utility Functions ---
    const saveData = () => {
        localStorage.setItem('anbari_stores_v2', JSON.stringify(stores));
        localStorage.setItem('anbari_items_v2', JSON.stringify(items));
        localStorage.setItem('anbari_purchases_v2', JSON.stringify(purchases));
        localStorage.setItem('anbari_sales_v2', JSON.stringify(sales));
    };

    const showPage = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId)?.classList.add('active');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === pageId) btn.classList.add('active');
        });
        switch (pageId) {
            case 'stores-page': renderStoresList(); break;
            case 'items-page': renderItemsList(); break;
            case 'purchase-page': loadPurchasePageData(); break;
            case 'sales-page': loadSalesPageData(); break;
            case 'tools-page': loadToolsPageData(); break;
            case 'profit-loss-page': loadProfitLossPageData(); break;
        }
        content.scrollTop = 0;
        clearAllForms();
    };

    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            modal.querySelector('.modal-content').classList.remove('hidden');
            modal.querySelector('.modal-content').classList.add('show');
        }
        body.style.overflow = 'hidden';
    };

    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.querySelector('.modal-content').classList.remove('show');
            modal.querySelector('.modal-content').classList.add('hidden');
            setTimeout(() => modal.style.display = 'none', 300);
        }
        body.style.overflow = 'auto';
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'نامشخص';
        try {
            const date = new Date(timestamp);
            return new Intl.DateTimeFormat('fa-IR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).format(date);
        } catch (e) {
            console.error("Error formatting date:", e);
            return 'تاریخ نامعتبر';
        }
    };

    const getItemName = (itemId) => items.find(i => i.id === itemId)?.name || 'کالای حذف شده';
    const getStoreName = (storeId) => stores.find(s => s.id === storeId)?.name || 'فروشگاه حذف شده';

    // تابع فرمت‌بندی قیمت
    const formatPrice = (price) => {
        if (!price) return '0';
        return price.toLocaleString('fa-IR');
    };

    // --- Theme Management ---
    const applyTheme = (theme) => {
        body.dataset.theme = theme;
        localStorage.setItem('anbari_theme', theme);
        
        // تغییر آیکون بر اساس تم
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    };

    themeToggleBtn.addEventListener('click', () => {
        const newTheme = body.dataset.theme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    });

    // --- Navigation ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => showPage(button.dataset.page));
    });

    // --- Drag to Scroll ---
    let isDragging = false;
    let startY, startScrollTop;

    content.addEventListener('mousedown', (e) => {
        if (e.target.closest('.item-list, .log-items-list, .modal, button, input, select, textarea')) return;
        isDragging = true;
        startY = e.clientY;
        startScrollTop = content.scrollTop;
        content.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const deltaY = startY - e.clientY;
        content.scrollTop = startScrollTop + deltaY;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            content.style.cursor = 'default';
        }
    });

    // --- Stores Logic ---
    const renderStoresList = () => {
        storesList.innerHTML = '';
        stores.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
        if (stores.length === 0) {
            storesList.innerHTML = '<li class="empty-log">هنوز فروشگاهی اضافه نشده است.</li>';
            return;
        }
        stores.forEach(store => {
            const li = document.createElement('li');
            li.dataset.id = store.id;
            li.innerHTML = `
                <span class="item-name">${store.name}</span>
                <span class="item-details"></span>`;
            li.addEventListener('click', () => openEditStoreModal(store.id));
            storesList.appendChild(li);
        });
    };

    const addStore = () => {
        const name = newStoreNameInput.value.trim();
        if (name) {
            if (stores.some(s => s.name.toLowerCase() === name.toLowerCase())) {
                alert('فروشگاهی با این نام از قبل وجود دارد.');
                return;
            }
            const newStore = { id: Date.now().toString(), name };
            stores.push(newStore);
            saveData();
            renderStoresList();
            newStoreNameInput.value = '';
            populateStoreSelects();
        } else {
            alert('لطفاً نام فروشگاه را وارد کنید.');
        }
    };

    const openEditStoreModal = (storeId) => {
        const store = stores.find(s => s.id === storeId);
        if (store) {
            editStoreIdInput.value = store.id;
            editStoreNameInput.value = store.name;
            openModal('edit-store-modal');
        }
    };

    const confirmEditStore = () => {
        const storeId = editStoreIdInput.value;
        const newName = editStoreNameInput.value.trim();
        if (!newName) {
            alert('نام فروشگاه نمی‌تواند خالی باشد.');
            return;
        }
        if (stores.some(s => s.id !== storeId && s.name.toLowerCase() === newName.toLowerCase())) {
            alert('فروشگاه دیگری با این نام از قبل وجود دارد.');
            return;
        }
        const storeIndex = stores.findIndex(s => s.id === storeId);
        if (storeIndex > -1) {
            stores[storeIndex].name = newName;
            saveData();
            renderStoresList();
            closeModal('edit-store-modal');
            populateStoreSelects();
            if (document.getElementById('purchase-page').classList.contains('active')) renderPurchaseLog();
            if (document.getElementById('sales-page').classList.contains('active')) renderSalesLog(salesStoreSelect.value);
            if (document.getElementById('tools-page').classList.contains('active')) {
                renderInventoryList(inventoryStoreSelect.value);
                renderSalesControlList(salesControlStoreSelect.value);
            }
        }
    };

    const deleteStore = () => {
        if (confirm('آیا مطمئنی می‌خوای این فروشگاه رو از بین ببری؟')) {
            const storeId = editStoreIdInput.value;
            stores = stores.filter(s => s.id !== storeId);
            purchases = purchases.filter(p => p.storeId !== storeId);
            sales = sales.filter(s => s.storeId !== storeId);
            saveData();
            renderStoresList();
            closeModal('edit-store-modal');
            populateStoreSelects();
            if (document.getElementById('purchase-page').classList.contains('active')) renderPurchaseLog();
            if (document.getElementById('sales-page').classList.contains('active')) renderSalesLog(salesStoreSelect.value);
            if (document.getElementById('tools-page').classList.contains('active')) {
                renderInventoryList(inventoryStoreSelect.value);
                renderSalesControlList(salesControlStoreSelect.value);
            }
        }
    };

    addStoreBtn.addEventListener('click', addStore);
    confirmEditStoreBtn.addEventListener('click', confirmEditStore);
    deleteStoreBtn.addEventListener('click', deleteStore);

    // --- Items Logic ---
    const renderItemsList = () => {
        itemsList.innerHTML = '';
        items.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
        if (items.length === 0) {
            itemsList.innerHTML = '<li class="empty-log">هنوز کالایی اضافه نشده است.</li>';
            return;
        }
        items.forEach(item => {
            const li = document.createElement('li');
            li.dataset.id = item.id;
            li.innerHTML = `
                <span class="item-name">${item.name}</span>
                <span class="item-details">ارزش: ${item.importance === 'weight' ? 'وزن' : 'تعداد'}</span>`;
            li.addEventListener('click', () => openEditItemModal(item.id));
            itemsList.appendChild(li);
        });
    };

    const addItem = () => {
        const name = newItemNameInput.value.trim();
        if (name) {
            if (items.some(i => i.name.toLowerCase() === name.toLowerCase())) {
                alert('کالایی با این نام از قبل وجود دارد.');
                return;
            }
            const newItem = {
                id: Date.now().toString(),
                name,
                weight: 0,
                quantity: 0,
                importance: 'quantity',
                extraInfo: '',
                dateAdded: Date.now()
            };
            items.push(newItem);
            saveData();
            renderItemsList();
            newItemNameInput.value = '';
            populateItemSelects();
        } else {
            alert('لطفاً نام کالا را وارد کنید.');
        }
    };

    const openEditItemModal = (itemId) => {
        const item = items.find(i => i.id === itemId);
        if (item) {
            itemModalTitle.textContent = 'ویرایش کالا';
            editItemIdInput.value = item.id;
            itemModalName.value = item.name;
            const importanceRadio = document.querySelector(`input[name="item-importance"][value="${item.importance || 'quantity'}"]`);
            if (importanceRadio) importanceRadio.checked = true;

            const existingDeleteBtn = document.querySelector('#item-details-modal .btn-delete');
            if (existingDeleteBtn) existingDeleteBtn.remove();

            deleteItemBtn.textContent = 'حذف کالا';
            deleteItemBtn.classList.add('btn-delete');
            deleteItemBtn.addEventListener('click', () => deleteItem(item.id));
            const modalActions = itemDetailsModal.querySelector('.modal-actions');
            modalActions.insertBefore(deleteItemBtn, modalActions.firstChild);

            openModal('item-details-modal');
        }
    };

    const confirmItemDetails = () => {
        const itemId = editItemIdInput.value;
        const name = itemModalName.value.trim();
        const importance = document.querySelector('input[name="item-importance"]:checked')?.value || 'quantity';

        if (!name) {
            alert('نام کالا نمی‌تواند خالی باشد.');
            return;
        }
        if (items.some(i => i.id !== itemId && i.name.toLowerCase() === name.toLowerCase())) {
            alert('کالای دیگری با این نام از قبل وجود دارد.');
            return;
        }

        const itemIndex = items.findIndex(i => i.id === itemId);
        if (itemIndex > -1) {
            items[itemIndex].name = name;
            items[itemIndex].importance = importance;
            saveData();
            renderItemsList();
            closeModal('item-details-modal');
            populateItemSelects();
            if (document.getElementById('purchase-page').classList.contains('active')) renderPurchaseLog();
            if (document.getElementById('sales-page').classList.contains('active')) renderSalesLog(salesStoreSelect.value);
            if (document.getElementById('tools-page').classList.contains('active')) {
                renderInventoryList(inventoryStoreSelect.value);
                renderSalesControlList(salesControlStoreSelect.value);
            }
        }
    };

    const deleteItem = (itemId) => {
        if (confirm('آیا مطمئنی می‌خوای این کالا رو حذف کنی؟')) {
            items = items.filter(i => i.id !== itemId);
            purchases = purchases.filter(p => p.itemId !== itemId);
            sales = sales.filter(s => s.itemId !== itemId);
            saveData();
            renderItemsList();
            closeModal('item-details-modal');
            populateItemSelects();
            if (document.getElementById('purchase-page').classList.contains('active')) renderPurchaseLog();
            if (document.getElementById('sales-page').classList.contains('active')) renderSalesLog(salesStoreSelect.value);
            if (document.getElementById('tools-page').classList.contains('active')) {
                renderInventoryList(inventoryStoreSelect.value);
                renderSalesControlList(salesControlStoreSelect.value);
            }
        }
    };

    addItemBtn.addEventListener('click', addItem);
    confirmItemDetailsBtn.addEventListener('click', confirmItemDetails);

    // --- Populate Select Dropdowns ---
    const populateStoreSelects = () => {
        const selects = [
            purchaseStoreSelect, salesStoreSelect, inventoryStoreSelect, salesControlStoreSelect,
            purchaseListStoreSelect, salesListStoreSelect
        ];
        const currentValues = selects.map(s => s.value);

        selects.forEach((select, index) => {
            const firstOption = select.options[0] || new Option('-- انتخاب کنید --', '');
            select.innerHTML = '';
            select.appendChild(firstOption);

            stores.forEach(store => {
                const option = document.createElement('option');
                option.value = store.id;
                option.textContent = store.name;
                select.appendChild(option);
            });
            if (stores.some(s => s.id === currentValues[index])) {
                select.value = currentValues[index];
            } else {
                select.value = '';
                if (select === salesStoreSelect) {
                    salesItemSelect.innerHTML = '<option value="">-- ابتدا فروشگاه را انتخاب کنید --</option>';
                    salesItemSelect.disabled = true;
                    clearSalesForm();
                }
                if (select === inventoryStoreSelect) {
                    inventoryList.innerHTML = '';
                }
                if (select === salesControlStoreSelect) {
                    salesControlList.innerHTML = '';
                }
            }
        });
    };

    const populateItemSelects = () => {
        const selects = [purchaseItemSelect, salesItemSelect];
        const currentSalesItemValue = salesItemSelect.disabled ? '' : salesItemSelect.value;

        selects.forEach(select => {
            const firstOption = select.options[0] || new Option('-- انتخاب کنید --', '');
            select.innerHTML = '';
            select.appendChild(firstOption);

            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.name;
                option.dataset.importance = item.importance;
                select.appendChild(option);
            });

            if (select === salesItemSelect && items.some(i => i.id === currentSalesItemValue)) {
                select.value = currentSalesItemValue;
                salesItemSelect.dispatchEvent(new Event('change'));
            } else if (select === purchaseItemSelect) {
                select.value = '';
            } else {
                select.value = '';
            }
        });
    };

    const populateItemSelectsForSale = (storeId) => {
        const currentItemValue = salesItemSelect.value;
        salesItemSelect.innerHTML = '<option value="">-- انتخاب کنید --</option>';
        if (!storeId) return;

        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            const stock = calculateInventory(storeId, item.id);
            option.textContent = `${item.name} (${item.importance === 'quantity' 
                ? `${stock.quantity} عدد` 
                : `${stock.weight.toFixed(2)} کیلوگرم`})`;
            option.dataset.importance = item.importance;
            salesItemSelect.appendChild(option);
        });

        if (items.some(i => i.id === currentItemValue)) {
            salesItemSelect.value = currentItemValue;
            salesItemSelect.dispatchEvent(new Event('change'));
        } else {
            salesItemSelect.value = '';
            salesItemStock.textContent = '';
        }
    };

    // --- Purchase Logic ---
    const loadPurchasePageData = () => {
        populateStoreSelects();
        populateItemSelects();
        if (purchaseListStoreSelect.value) {
            renderPurchaseList(purchaseListStoreSelect.value);
        } else {
            purchaseListEmpty.textContent = 'لطفاً یک فروشگاه انتخاب کنید';
            purchaseListEmpty.style.display = 'block';
            purchaseListGrid.style.display = 'none';
        }
        clearPurchaseForm();
        displayPurchaseFormTitle();
    };

    purchaseStoreSelect.addEventListener('change', () => {
        const storeId = purchaseStoreSelect.value;
        renderPurchaseLog();
    });

    purchaseListStoreSelect.addEventListener('change', () => {
        const storeId = purchaseListStoreSelect.value;
        renderPurchaseList(storeId);
    });

    const clearPurchaseForm = () => {
        purchaseStoreSelect.value = '';
        purchaseItemSelect.value = '';
        purchaseQuantityInput.value = '';
        purchaseWeightInput.value = '';
        purchasePriceInput.value = '';
        purchaseExtraInfoInput.value = '';
    };

    const addPurchase = () => {
        const storeId = purchaseStoreSelect.value;
        const itemId = purchaseItemSelect.value;
        const quantity = parseInt(purchaseQuantityInput.value) || 0;
        const weight = parseFloat(purchaseWeightInput.value) || 0;
        const price = parseFloat(purchasePriceInput.value) || 0;
        const totalPrice = price * (quantity || weight);
        const extraInfo = purchaseExtraInfoInput.value.trim();
        const timestamp = Date.now();

        if (!storeId) { alert('لطفاً فروشگاه را انتخاب کنید.'); return; }
        if (!itemId) { alert('لطفاً کالا را انتخاب کنید.'); return; }
        const item = items.find(i => i.id === itemId);
        if (!item) { alert('کالای انتخاب شده یافت نشد.'); return; }

        if (item.importance === 'quantity' && weight > 0) {
            alert('ارزش کالا بر اساس تعداد است.');
            return;
        }
        if (item.importance === 'weight' && quantity > 0) {
            alert('ارزش کالا بر اساس وزن است.');
            return;
        }
        if (quantity <= 0 && weight <= 0) { alert('لطفاً تعداد یا وزن معتبر وارد کنید.'); return; }

        const newPurchase = {
            id: `p-${timestamp}`,
            storeId,
            itemId,
            quantity,
            weight,
            price,
            totalPrice,
            extraInfo,
            timestamp
        };

        purchases.push(newPurchase);

        saveData();

        renderPurchaseLog();
        renderPurchaseList(purchaseListStoreSelect.value);

        clearPurchaseForm();

        showSuccessMessage('خرید با موفقیت ثبت شد');
    };

    const renderPurchaseList = (storeId) => {
        purchaseListGrid.innerHTML = '';
        
        let filteredPurchases = storeId && storeId !== '0' 
            ? purchases.filter(p => p.storeId === storeId)
            : [];
        
        // Sort purchases by timestamp descending (newest first)
        filteredPurchases = filteredPurchases.sort((a, b) => b.timestamp - a.timestamp);
        
        if (filteredPurchases.length === 0) {
            purchaseListEmpty.textContent = 'هیچ خریدی ثبت نشده است';
            purchaseListEmpty.style.display = 'block';
            purchaseListGrid.style.display = 'none';
            return;
        }
        
        purchaseListEmpty.style.display = 'none';
        purchaseListGrid.style.display = 'grid';

        filteredPurchases.forEach(purchase => {
            const item = items.find(i => i.id === purchase.itemId);
            if (!item) return;

            const card = document.createElement('div');
            card.className = 'purchase-card';
            card.dataset.purchaseId = purchase.id;
            
            const quantity = purchase.quantity || 0;
            const weight = purchase.weight || 0;
            const totalPrice = purchase.totalPrice || purchase.price * (purchase.quantity || purchase.weight);
            
            card.innerHTML = `
                <div class="purchase-card-header" style="display: flex; justify-content: space-between;">
                    <span class="purchase-item-name" style="margin-left: 10px;">${item.name}</span>
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
            
            purchaseListGrid.appendChild(card);
        });
    };

    confirmPurchaseBtn.addEventListener('click', addPurchase);

    // --- Sales Logic ---
    const loadSalesPageData = () => {
        populateStoreSelects();
        
        // Set default values for store selects
        salesStoreSelect.value = '';
        salesListStoreSelect.value = '';
        
        // Disable and reset item select
        salesItemSelect.disabled = true;
        salesItemSelect.innerHTML = '<option value="">-- ابتدا فروشگاه را انتخاب کنید --</option>';
        
        // Show default messages
        salesItemsList.innerHTML = '<li class="empty-log">لطفاً یک فروشگاه انتخاب کنید</li>';
        salesLogGrouped.innerHTML = '<div class="empty-log">لطفاً یک فروشگاه انتخاب کنی</div>';
        
        // Clear form
        clearSalesForm();
    };
    
    salesStoreSelect.addEventListener('change', () => {
        const storeId = salesStoreSelect.value;
        if (storeId) {
            salesItemSelect.disabled = false;
            populateItemSelectsForSale(storeId);
            renderSalesLog();
            renderSalesList(storeId);
        } else {
            salesItemSelect.disabled = true;
            salesItemSelect.innerHTML = '<option value="">-- ابتدا فروشگاه را انتخاب کنید --</option>';
            salesItemsList.innerHTML = '<li class="empty-log">لطفاً یک فروشگاه انتخاب کنید</li>';
        }
        clearSalesForm();
    });

    salesListStoreSelect.addEventListener('change', () => {
        const storeId = salesListStoreSelect.value;
        if (storeId) {
            renderSalesList(storeId);
            renderSalesLog(storeId);
        } else {
            salesItemsList.innerHTML = '<li class="empty-log">لطفاً یک فروشگاه انتخاب کنید</li>';
            salesLogGrouped.innerHTML = '<div class="empty-log">لطفاً یک فروشگاه انتخاب کنید</div>';
        }
    });

    const clearSalesForm = () => {
        salesItemSelect.value = '';
        salesQuantityInput.value = '';
        salesWeightInput.value = '';
        salesPriceInput.value = '';
        salesExtraInfoInput.value = '';
    };

    window.addSale = window.addSale || function() {
        const storeId = salesStoreSelect.value;
        const itemId = salesItemSelect.value;
        const quantity = parseInt(salesQuantityInput.value) || 0;
        const weight = parseFloat(salesWeightInput.value) || 0;
        const price = parseFloat(salesPriceInput.value) || 0;
        const extraInfo = salesExtraInfoInput.value.trim();
        const timestamp = Date.now();

        // Validate basic inputs
        if (!storeId) { alert('لطفاً فروشگاه را انتخاب کنید.'); return; }
        if (!itemId) { alert('لطفاً کالا را انتخاب کنید.'); return; }
        const item = items.find(i => i.id === itemId);
        if (!item) { alert('کالای انتخاب شده یافت نشد.'); return; }

        // Validate quantity/weight based on item importance
        if (item.importance === 'quantity' && weight > 0) {
            alert('ارزش کالا بر اساس تعداد است.');
            return;
        }
        if (item.importance === 'weight' && quantity > 0) {
            alert('ارزش کالا بر اساس وزن است.');
            return;
        }
        if (quantity <= 0 && weight <= 0) { alert('لطفاً تعداد یا وزن معتبر وارد کنید.'); return; }
        if (price <= 0) { alert('لطفاً قیمت واحد معتبر وارد کنید.'); return; }

        // Check stock availability
        const currentStock = calculateInventory(storeId, itemId);
        
        if (item.importance === 'quantity') {
            if (quantity > currentStock.quantity) {
                alert(`مقدار درخواستی (${quantity} عدد) از موجودی کل (${currentStock.quantity} عدد) بیشتر است.`);
                return;
            }
        } else { // weight
            if (weight > currentStock.weight) {
                alert(`وزن درخواستی (${weight.toFixed(2)} کیلوگرم) از موجودی کل (${currentStock.weight.toFixed(2)} کیلوگرم) بیشتر است.`);
                return;
            }
        }

        // If we get here, all validations passed
        const newSale = { 
            id: `s-${timestamp}`, 
            storeId, 
            itemId, 
            quantity, 
            weight, 
            price,
            extraInfo, 
            timestamp
        };
        
        // Add the sale and update displays
        sales.push(newSale);
        saveData();

        // Reset form and refresh page data
        clearSalesForm();
        loadSalesPageData();
        
        // Restore the selected store and refresh its data
        salesStoreSelect.value = storeId;
        salesStoreSelect.dispatchEvent(new Event('change'));
        
        // Show success message
        showSuccessMessage('کالا با موفقیت ثبت شد');
        
        // Update all necessary displays
        renderSalesLog(storeId);
        renderSalesList(storeId);
        renderInventoryList(storeId);
        populateItemSelectsForSale(storeId); // Update the item select with restored stock values
    };

    const renderSalesList = (storeId) => {
        const salesList = document.getElementById('sales-items-list');
        salesList.innerHTML = '';
        if (!storeId) {
            salesList.innerHTML = '<li class="empty-log">لطفاً یک فروشگاه انتخاب کنید</li>';
            return;
        }

        const storeSales = sales
            .filter(s => s.storeId === storeId)
            .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp descending (newest first)

        if (storeSales.length === 0) {
            salesList.innerHTML = '<li class="empty-log">هنوز کالایی در این فروشگاه فروخته نشده است</li>';
            return;
        }

        storeSales.forEach(sale => {
            const item = items.find(i => i.id === sale.itemId);
            if (!item) return;
            
            const card = document.createElement('div');
            card.className = 'purchase-card';
            card.dataset.saleId = sale.id;
            
            const quantity = sale.quantity || 0;
            const weight = sale.weight || 0;
            const price = sale.price || 0;
            const totalPrice = price * (quantity || weight);
            
            card.innerHTML = `
                <div class="purchase-card-header" style="display: flex; justify-content: space-between;">
                    <span class="purchase-item-name" style="margin-left: 10px;">${item.name}</span>
                    <span class="purchase-date" style="margin-right: 10px;">${formatDate(sale.timestamp)}</span>
                </div>
                <div class="purchase-details">
                    <div class="quantity-price" style="display: flex; gap: 60px;">
                        <span class="quantity" style="font-size: 1em; font-family: inherit; font-weight: bold;">${item.importance === 'quantity' ? `تعداد: ${quantity} عدد` : `وزن: ${weight.toFixed(2)} کیلوگرم`}</span>
                    </div>
                    <div class="total-price-extra">
                        <span class="total-price" style="font-size: 1em; font-family: inherit; font-weight: bold;">قیمت کل: ${formatPrice(totalPrice)} تومان</span>
                        <span class="unit-price" style="margin-right: 10px;">قیمت واحد: ${formatPrice(price)} تومان</span>
                    </div>
                    ${sale.extraInfo ? `
                    <div style="border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px; text-align: center;">
                        <span class="extra-info" style="color: #666; font-style: italic;">${sale.extraInfo}</span>
                    </div>
                    ` : ''}
                </div>
                <button class="delete-btn" title="حذف" style="position: absolute; left: 10px; bottom: 10px;"><i class="fas fa-trash-alt"></i></button>
            `;
            
            const deleteBtn = card.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm('آیا مطمئنی می‌خوای این فروش رو حذف کنی؟')) {
                    const saleIndex = sales.findIndex(s => s.id === sale.id);
                    if (saleIndex > -1) {
                        sales.splice(saleIndex, 1);
                        saveData();
                        renderSalesList(storeId);
                        showSuccessMessage('فروش با موفقیت حذف شد');
                    }
                }
            });
            
            card.addEventListener('click', () => openEditSaleModal(sale.id));
            salesList.appendChild(card);
        });
    };

    salesItemSelect.addEventListener('change', () => {
        const storeId = salesStoreSelect.value;
        const itemId = salesItemSelect.value;
        if (storeId && itemId) {
            const item = items.find(i => i.id === itemId);
            if (!item) {
                salesItemStock.textContent = '';
                return;
            }
            const stock = calculateInventory(storeId, itemId);
            salesItemStock.textContent = `موجودی: ${item.importance === 'quantity' 
                ? `${stock.quantity} عدد` 
                : `${stock.weight.toFixed(2)} کیلوگرم`}`;
        } else {
            salesItemStock.textContent = '';
        }
    });

    const renderSalesLog = () => {
        salesLogGrouped.innerHTML = '';
        const filtered = sales.filter(s => {
            if (salesStoreSelect.value && s.storeId !== salesStoreSelect.value) return false;
            return true;
        });

        if (filtered.length === 0) {
            salesLogGrouped.innerHTML = '<div class="empty-log">هنوز فروشی ثبت نشده است.</div>';
            return;
        }

        filtered.forEach(sale => {
            const item = items.find(i => i.id === sale.itemId) || { name: 'کالای نامشخص' };
            const store = stores.find(st => st.id === sale.storeId) || { name: 'فروشگاه نامشخص' };
            
            const li = document.createElement('li');
            li.className = 'sale-item sale-box';
            li.innerHTML = `
                <div class="sale-box-content">
                    <div class="sale-box-header">
                        <span class="sale-item-name">${item.name}</span>
                        <div class="sale-item-details">
                            <span>🔹 ${item.importance === 'quantity' ? `تعداد: ${sale.quantity} عدد` : `وزن: ${sale.weight.toFixed(2)} کیلوگرم`}</span>
                        </div>
                    </div>
                    <div class="sale-item-date">📅 تاریخ فروش: ${formatDate(sale.timestamp)}</div>
                    ${sale.extraInfo ? `<div class="sale-item-extra-info">📝 ${sale.extraInfo}</div>` : ''}
                </div>
            `;
            
            li.querySelector('.sale-item-name').addEventListener('click', () => openEditSaleModal(sale.id));
            salesLogGrouped.appendChild(li);
        });
    };

    const openEditSaleModal = (saleId) => {
        const sale = sales.find(s => s.id === saleId);
        if (sale) {
            editSaleIdInput.value = sale.id;
            editSaleStoreSelect.value = sale.storeId;
            editSaleItemSelect.value = sale.itemId;
            editSaleQuantity.value = sale.quantity || '';
            editSaleWeight.value = sale.weight || '';
            editSaleExtraInfo.value = sale.extraInfo || '';
            editSaleTimestampDisplay.textContent = formatDate(sale.timestamp);
            openModal('edit-sale-modal');
        }
    };

    const confirmEditSale = () => {
        const saleId = editSaleIdInput.value;
        const storeId = editSaleStoreSelect.value;
        const itemId = editSaleItemSelect.value;
        const quantity = parseInt(editSaleQuantity.value) || 0;
        const weight = parseFloat(editSaleWeight.value) || 0;
        const extraInfo = editSaleExtraInfo.value.trim();
        const sale = sales.find(s => s.id === saleId);
        if (!sale) return;

        if (!storeId) { alert('لطفاً فروشگاه را انتخاب کنید.'); return; }
        if (!itemId) { alert('لطفاً کالا را انتخاب کنید.'); return; }
        const item = items.find(i => i.id === itemId);
        if (!item) { alert('کالای انتخاب شده یافت نشد.'); return; }

        if (item.importance === 'quantity' && weight > 0) {
            alert('ارزش کالا بر اساس تعداد است.');
            return;
        }
        if (item.importance === 'weight' && quantity > 0) {
            alert('ارزش کالا بر اساس وزن است.');
            return;
        }
        if (quantity <= 0 && weight <= 0) { alert('لطفاً تعداد یا وزن معتبر وارد کنید.'); return; }

        const currentStock = calculateInventory(storeId, itemId);
        const originalQuantity = sale.quantity || 0;
        const originalWeight = sale.weight || 0;
        const quantityDiff = quantity - originalQuantity;
        const weightDiff = weight - originalWeight;
        if (item.importance === 'quantity' && quantityDiff > currentStock.quantity + originalQuantity) {
            alert(`موجودی کافی نیست (موجود: ${(currentStock.quantity + originalQuantity)}).`);
            return;
        }
        if (item.importance === 'weight' && weightDiff > currentStock.weight + originalWeight) {
            alert(`موجودی کافی نیست (موجود: ${(currentStock.weight + originalWeight).toFixed(2)} ک.گ).`);
            return;
        }

        const saleIndex = sales.findIndex(s => s.id === saleId);
        if (saleIndex > -1) {
            sales[saleIndex] = {
                ...sales[saleIndex],
                storeId,
                itemId,
                quantity,
                weight,
                extraInfo
            };
            saveData();
            renderSalesLog(salesStoreSelect.value);
            closeModal('edit-sale-modal');
            if (document.getElementById('tools-page').classList.contains('active')) {
                renderInventoryList(inventoryStoreSelect.value);
            }
        }
    };

    const deleteSale = () => {
        if (confirm('آیا مطمئنی می‌خوای این فروش رو حذف کنی؟')) {
            const saleId = editSaleIdInput.value;
            const sale = sales.find(s => s.id === saleId);
            if (sale) {
                const storeId = sale.storeId;
                sales = sales.filter(s => s.id !== saleId);
                saveData();
                renderSalesLog(salesStoreSelect.value);
                renderSalesList(salesListStoreSelect.value);
                renderInventoryList(salesListStoreSelect.value);
                populateItemSelectsForSale(storeId); // Update the item select with restored stock values
                closeModal('edit-sale-modal');
                showSuccessMessage('فروش با موفقیت حذف شد');
            }
        }
    };

    confirmSaleBtn.addEventListener('click', addSale);
    if (confirmEditSaleBtn) confirmEditSaleBtn.addEventListener('click', confirmEditSale);
    if (deleteSaleBtn) deleteSaleBtn.addEventListener('click', deleteSale);

    // --- Tools Page Logic ---
    const loadToolsPageData = () => {
        populateStoreSelects();
        const selectedStoreId = inventoryStoreSelect.value;
        renderInventoryList(selectedStoreId);
        renderSalesControlList(selectedStoreId);
        advancedSearchResults.innerHTML = '';
        advancedSearchInput.value = '';
    };

    inventoryStoreSelect.addEventListener('change', () => renderInventoryList(inventoryStoreSelect.value));

    const calculateInventory = (storeId, itemId) => {
        const item = items.find(i => i.id === itemId) || { importance: 'quantity' };
        
        // Calculate total purchased quantity/weight from purchases list
        const purchasesForItem = purchases.filter(p => p.itemId === itemId);
        const totalPurchasedQuantity = purchasesForItem.reduce((sum, p) => sum + (p.quantity || 0), 0);
        const totalPurchasedWeight = purchasesForItem.reduce((sum, p) => sum + (p.weight || 0), 0);
        
        // Calculate total sold quantity/weight from sales list
        const salesForItem = sales.filter(s => s.itemId === itemId);
        const totalSoldQuantity = salesForItem.reduce((sum, s) => sum + (s.quantity || 0), 0);
        const totalSoldWeight = salesForItem.reduce((sum, s) => sum + (s.weight || 0), 0);
        
        // Calculate current stock (total purchased - total sold)
        const currentQuantity = totalPurchasedQuantity - totalSoldQuantity;
        const currentWeight = totalPurchasedWeight - totalSoldWeight;
        
        // Calculate total inventory value by summing up purchase prices of similar items
        const calculateInventoryValue = () => {
            let totalValue = 0;
            
            purchasesForItem.forEach(purchase => {
                const quantity = purchase.quantity || 0;
                const weight = purchase.weight || 0;
                totalValue += purchase.price * (quantity || weight);
            });
            
            return totalValue;
        };
        
        return {
            quantity: currentQuantity,
            weight: currentWeight,
            totalPurchasedQuantity,
            totalPurchasedWeight,
            totalSoldQuantity,
            totalSoldWeight,
            importance: item.importance,
            totalPrice: calculateInventoryValue()
        };
    };

    const renderInventoryList = (storeId) => {
        inventoryList.innerHTML = '';
        if (!storeId) {
            return;
        }

        // Filter items to only show those with inventory in the selected store
        const itemsWithStock = items
            .map(item => ({ 
                item, 
                stock: calculateInventory(storeId, item.id),
                purchases: purchases.filter(p => p.itemId === item.id && p.storeId === storeId)
            }))
            .filter(({ stock, purchases }) => (stock.quantity > 0 || stock.weight > 0) && purchases.length > 0);

        if (itemsWithStock.length === 0) {
            inventoryList.innerHTML = '<li class="empty-log">کالایی با موجودی در این فروشگاه یافت نشد.</li>';
            return;
        }
        
        itemsWithStock.forEach(({ item, stock }) => {
            const li = document.createElement('li');
            li.className = 'inventory-item sale-box';
            li.innerHTML = `
                <div class="sale-box-content">
                    <div class="sale-box-header">
                        <span class="sale-item-name">${item.name}</span>
                        <div class="sale-item-details">
                            <span>🔹 موجودی کل: ${item.importance === 'quantity' ? `${stock.quantity} عدد` : `${stock.weight.toFixed(2)} کیلوگرم`}</span>
                            <span style="display: block; margin-top: 5px;">🔹 ارزش کل: ${formatPrice(stock.totalPrice)} تومان</span>
                        </div>
                    </div>
                </div>
            `;
            inventoryList.appendChild(li);
        });
    };

    salesControlStoreSelect.addEventListener('change', () => renderSalesControlList(salesControlStoreSelect.value));

    const renderSalesControlList = (storeId) => {
        salesControlList.innerHTML = '';
        if (!storeId) {
            return;
        }

        const itemsWithSales = items
            .map(item => {
                const salesForItem = sales.filter(s => s.storeId === storeId && s.itemId === item.id);
                const purchasesForItem = purchases.filter(p => p.storeId === storeId && p.itemId === item.id);
                
                const totalQuantity = salesForItem.reduce((sum, s) => sum + (s.quantity || 0), 0);
                const totalWeight = salesForItem.reduce((sum, s) => sum + (s.weight || 0), 0);
                const totalPrice = salesForItem.reduce((sum, s) => sum + ((s.price || 0) * (s.quantity || s.weight || 0)), 0);
                
                // Calculate total inventory value
                const inventory = calculateInventory(storeId, item.id);
                const inventoryValue = inventory.totalPrice;
                
                // Calculate profit/loss
                const profitLoss = totalPrice - inventoryValue;
                const profitLossText = profitLoss >= 0 
                    ? `سود: ${formatPrice(profitLoss)}+ تومان` 
                    : `زیان: ${formatPrice(Math.abs(profitLoss))}- تومان`;
                
                return { 
                    item, 
                    totalQuantity, 
                    totalWeight, 
                    totalPrice,
                    inventory,
                    profitLossText
                };
            })
            .filter(s => s.totalQuantity > 0 || s.totalWeight > 0);

        if (itemsWithSales.length === 0) {
            salesControlList.innerHTML = '<li class="empty-log">فروشی در این فروشگاه یافت نشد.</li>';
            return;
        }

        itemsWithSales.forEach(s => {
            const li = document.createElement('li');
            li.className = 'sales-control-item sale-box';
            li.innerHTML = `
                <div class="sale-box-content">
                    <div class="sale-box-header">
                        <span class="sale-item-name">${s.item.name}</span>
                        <div class="sale-item-details">
                            <span>🔹 فروش کل: ${s.item.importance === 'quantity' ? `${s.totalQuantity} عدد` : `${s.totalWeight.toFixed(2)} کیلوگرم`} <span style="margin-right: 20px;"></span> 🔹 موجودی کل: ${s.item.importance === 'quantity' ? `${s.inventory.quantity} عدد` : `${s.inventory.weight.toFixed(2)} کیلوگرم`}</span>
                            <span style="display: block; margin-top: 5px;">🔹 درآمد: ${formatPrice(s.totalPrice)} تومان</span>
                            <span style="display: block; margin-top: 5px;">🔹 ${s.profitLossText}</span>
                        </div>
                    </div>
                </div>
            `;
            salesControlList.appendChild(li);
        });
    };

    const performAdvancedSearch = () => {
        const searchTerm = advancedSearchInput.value.toLowerCase().trim();
        const allTransactions = [
            ...purchases.map(p => ({ ...p, type: 'purchase' })),
            ...sales.map(s => ({ ...s, type: 'sale' }))
        ];

        const filteredTransactions = allTransactions.filter(t => {
            const itemName = getItemName(t.itemId).toLowerCase();
            const storeName = getStoreName(t.storeId).toLowerCase();
            const extraInfo = (t.extraInfo || '').toLowerCase();
            return itemName.includes(searchTerm) || storeName.includes(searchTerm) || extraInfo.includes(searchTerm);
        });

        renderAdvancedSearchResults(filteredTransactions);
    };

    const renderAdvancedSearchResults = (results) => {
        advancedSearchResults.innerHTML = '';
        if (results.length === 0) {
            advancedSearchResults.innerHTML = '<p class="empty-log">نتیجه‌ای برای جستجوی شما یافت نشد.</p>';
            return;
        }

        const resultsList = document.createElement('ul');
        resultsList.classList.add('log-items-list');

        results.forEach(t => {
            const li = document.createElement('li');
            const itemName = getItemName(t.itemId);
            const storeName = getStoreName(t.storeId);
            const typeText = t.type === 'purchase' ? 'خرید' : 'فروش';
            const typeClass = t.type;

            li.innerHTML = `
                <span class="log-item-main">
                    <span class="log-item-type ${typeClass}">${typeText}</span>
                    ${itemName} - <small>(${storeName})</small>
                </span>
                <span class="log-item-details">
                    ${t.quantity > 0 ? `تعداد: ${t.quantity}` : ''}
                    ${t.weight > 0 ? ` | وزن: ${t.weight.toFixed(2)} ک.گ` : ''}
                    <br> ${formatDate(t.timestamp)}
                    ${t.extraInfo ? ` | ${t.extraInfo}` : ''}
                </span>`;
            resultsList.appendChild(li);
        });
        advancedSearchResults.appendChild(resultsList);
    };

    runAdvancedSearchBtn.addEventListener('click', performAdvancedSearch);
    advancedSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performAdvancedSearch();
    });

    // --- Date Picker Logic ---
    let currentDateTarget = null;

    const populateDatePicker = (timestamp) => {
        const date = new Date(timestamp);
        
        dateYear.innerHTML = '';
        const currentYear = date.getFullYear();
        for (let y = currentYear - 10; y <= currentYear + 10; y++) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            if (y === currentYear) option.selected = true;
            dateYear.appendChild(option);
        }
        
        dateMonth.innerHTML = '';
        for (let m = 1; m <= 12; m++) {
            const option = document.createElement('option');
            option.value = m;
            option.textContent = m < 10 ? `0${m}` : m;
            if (m === (date.getMonth() + 1)) option.selected = true;
            dateMonth.appendChild(option);
        }
        
        updateDays();
        
        dateHour.innerHTML = '';
        for (let h = 0; h < 24; h++) {
            const option = document.createElement('option');
            option.value = h;
            option.textContent = h.toString().padStart(2, '0') + ':00';
            if (h === date.getHours()) option.selected = true;
            dateHour.appendChild(option);
        }
    };
    
    const updateDays = () => {
        const year = parseInt(dateYear.value);
        const month = parseInt(dateMonth.value);
        const daysInMonth = new Date(year, month, 0).getDate();
        dateDay.innerHTML = '';
        for (let d = 1; d <= daysInMonth; d++) {
            const option = document.createElement('option');
            option.value = d;
            option.textContent = d < 10 ? `0${d}` : d;
            dateDay.appendChild(option);
        }
        dateDay.value = Math.min(parseInt(dateDay.value) || 1, daysInMonth);
    };
    
    calendarType.addEventListener('change', () => populateDatePicker(Date.now()));
    dateYear.addEventListener('change', updateDays);
    dateMonth.addEventListener('change', updateDays);

    const openDatePicker = (target, timestamp) => {
        currentDateTarget = target;
        populateDatePicker(timestamp);
        openModal('date-picker-modal');
    };

    const confirmDate = () => {
        const year = parseInt(dateYear.value);
        const month = parseInt(dateMonth.value) - 1;
        const day = parseInt(dateDay.value);
        const hour = parseInt(dateHour.value);
        
        const date = new Date(year, month, day, hour, 0, 0);
        const timestamp = date.getTime();
        
        if (currentDateTarget === 'purchase') {
            editPurchaseTimestampDisplay.textContent = formatDate(timestamp);
            editPurchaseTimestampDisplay.dataset.timestamp = timestamp;
        } else if (currentDateTarget === 'sale') {
            editSaleTimestampDisplay.textContent = formatDate(timestamp);
            editSaleTimestampDisplay.dataset.timestamp = timestamp;
        }
        
        closeModal('date-picker-modal');
    };
    
    confirmDateBtn.addEventListener('click', confirmDate);

    // --- Info Modal Logic ---
    // infoBtn.addEventListener('click', () => openModal('info-modal'));

    // --- Copy Card Number ---
    const copyCardNumber = () => {
        const cardNumber = '6219861809148280';
        
        const tempInput = document.createElement('input');
        tempInput.value = cardNumber;
        document.body.appendChild(tempInput);
        
        tempInput.select();
        document.execCommand('copy');
        
        document.body.removeChild(tempInput);
        
        copySuccess.style.display = 'block';
        setTimeout(() => {
            copySuccess.style.display = 'none';
        }, 3000);
    };

    document.getElementById('donate-link').addEventListener('click', () => {
        const cardNumber = '1234-5678-9012-3456'; 
        navigator.clipboard.writeText(cardNumber).then(() => {
            const copySuccessMessage = document.getElementById('copy-success');
            copySuccessMessage.style.display = 'block';
            setTimeout(() => {
                copySuccessMessage.style.display = 'none';
            }, 3000); // پیام به مدت 3 ثانیه نمایش داده می‌شود
        });
    });

    // --- Custom Date Picker ---
    const populateCustomDatePicker = (timestamp = Date.now()) => {
        const date = new Date(timestamp);
        
        customDateYear.innerHTML = '';
        const currentYear = date.getFullYear();
        const startYear = currentCalendarType === 'shamsi' ? 1390 : 2011;
        const endYear = currentCalendarType === 'shamsi' ? 1410 : 2031;
        
        for (let y = startYear; y <= endYear; y++) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            if ((currentCalendarType === 'shamsi' && y === toJalali(date).jy) || 
                (currentCalendarType === 'gregorian' && y === currentYear)) {
                option.selected = true;
            }
            customDateYear.appendChild(option);
        }
        
        customDateMonth.innerHTML = '';
        const monthNames = currentCalendarType === 'shamsi' 
            ? ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
            : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        monthNames.forEach((month, i) => {
            const option = document.createElement('option');
            option.value = i + 1;
            option.textContent = month;
            if ((currentCalendarType === 'shamsi' && i+1 === toJalali(date).jm) || 
                (currentCalendarType === 'gregorian' && i === date.getMonth())) {
                option.selected = true;
            }
            customDateMonth.appendChild(option);
        });
        
        updateCustomDays();
        
        customDateHour.innerHTML = '';
        for (let h = 0; h < 24; h++) {
            const option = document.createElement('option');
            option.value = h;
            option.textContent = h.toString().padStart(2, '0') + ':00';
            if (h === date.getHours()) {
                option.selected = true;
            }
            customDateHour.appendChild(option);
        }
    };
    
    const updateCustomDays = () => {
        customDateDay.innerHTML = '';
        
        const year = parseInt(customDateYear.value);
        const month = parseInt(customDateMonth.value);
        const currentDate = new Date();
        let daysInMonth;
        
        if (currentCalendarType === 'shamsi') {
            if (month <= 6) daysInMonth = 31;
            else if (month <= 11) daysInMonth = 30;
            else daysInMonth = isJalaliLeapYear(year) ? 30 : 29;
        } else {
            const lastDayOfMonth = new Date(year, month, 0);
            daysInMonth = lastDayOfMonth.getDate();
        }
        
        for (let d = 1; d <= daysInMonth; d++) {
            const option = document.createElement('option');
            option.value = d;
            option.textContent = d;
            
            if (currentCalendarType === 'shamsi') {
                if (d === toJalali(currentDate).jd && 
                    month === toJalali(currentDate).jm && 
                    year === toJalali(currentDate).jy) {
                    option.selected = true;
                }
            } else {
                if (d === currentDate.getDate() && 
                    month-1 === currentDate.getMonth() && 
                    year === currentDate.getFullYear()) {
                    option.selected = true;
                }
            }
            
            customDateDay.appendChild(option);
        }
    };
    
    const isJalaliLeapYear = (year) => {
        return ((year % 33 % 4) - 1) === (Math.floor((year % 33) / 4));
    };
    
    const toJalali = (date) => {
        const georgianYear = date.getFullYear();
        const georgianMonth = date.getMonth() + 1;
        const georgianDay = date.getDate();
        
        let jd, jy, jm, jalaliDay;
        
        let gy = georgianYear - 1600;
        let gm = georgianMonth - 1;
        let gd = georgianDay - 1;
        
        let gDayNo = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400);
        
        for (let i = 0; i < gm; ++i) {
            gDayNo += [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i];
        }
        
        if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) {
            gDayNo++;
        }
        
        gDayNo += gd;
        
        let jalaliDayNo = gDayNo - 79;
        let jNp = Math.floor(jalaliDayNo / 12053);
        jalaliDayNo %= 12053;
        
        let jy1 = 979 + 33 * jNp + 4 * Math.floor(jalaliDayNo / 1461);
        jalaliDayNo %= 1461;
        
        if (jalaliDayNo >= 366) {
            jy1 += Math.floor((jalaliDayNo - 1) / 365);
            jalaliDayNo = (jalaliDayNo - 1) % 365;
        }
        
        jy = jy1;
        
        for (let i = 0; i < 11 && jalaliDayNo >= 0; ++i) {
            let jmDays = (i < 6) ? 31 : 30;
            jalaliDayNo -= jmDays;
            if (jalaliDayNo < 0) {
                jm = i + 1;
                jalaliDay = jmDays + jalaliDayNo + 1;
                break;
            }
        }
        
        if (jalaliDayNo >= 0) {
            jm = 12;
            jalaliDay = jalaliDayNo + 1;
        }
        
        return { jy, jm, jd: jalaliDay };
    };

    const toGregorian = (jy, jm, jd) => {
        jy += 1595;
        let days = -355668 + (365 * jy) + (Math.floor(jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
        
        let gy = 400 * Math.floor(days / 146097);
        days %= 146097;
        
        if (days > 36524) {
            gy += 100 * Math.floor(--days / 36524);
            days %= 36524;
            
            if (days >= 365) days++;
        }
        
        gy += 4 * Math.floor(days / 1461);
        days %= 1461;
        
        if (days > 365) {
            gy += Math.floor((days - 1) / 365);
            days = (days - 1) % 365;
        }
        
        let gd = days + 1;
        
        let salA = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let gm;
        
        for (gm = 0; gm < 13 && gd > salA[gm]; gm++) {
            gd -= salA[gm];
        }
        
        return new Date(gy, gm - 1, gd);
    };

    const openCustomDatePicker = (target, timestamp) => {
        currentDateTarget = target;
        currentCalendarType = 'shamsi'; 
        calendarTypeBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.type === currentCalendarType) {
                btn.classList.add('active');
            }
        });
        populateCustomDatePicker(timestamp);
        openModal('custom-date-picker-modal');
    };

    const confirmCustomDate = () => {
        let timestamp;
        
        if (currentCalendarType === 'shamsi') {
            const jy = parseInt(customDateYear.value);
            const jm = parseInt(customDateMonth.value);
            const jd = parseInt(customDateDay.value);
            const hour = parseInt(customDateHour.value);
            
            const gregorianDate = toGregorian(jy, jm, jd);
            gregorianDate.setHours(hour, 0, 0);
            timestamp = gregorianDate.getTime();
        } else {
            const year = parseInt(customDateYear.value);
            const month = parseInt(customDateMonth.value) - 1;
            const day = parseInt(customDateDay.value);
            const hour = parseInt(customDateHour.value);
            
            const date = new Date(year, month, day, hour, 0, 0);
            timestamp = date.getTime();
        }
        
        if (currentDateTarget === 'purchase') {
            editPurchaseTimestampDisplay.textContent = formatDate(timestamp);
            editPurchaseTimestampDisplay.dataset.timestamp = timestamp;
        } else if (currentDateTarget === 'sale') {
            editSaleTimestampDisplay.textContent = formatDate(timestamp);
            editSaleTimestampDisplay.dataset.timestamp = timestamp;
        }
        
        closeModal('custom-date-picker-modal');
    };

    calendarTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            calendarTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCalendarType = btn.dataset.type;
            populateCustomDatePicker();
        });
    });

    customDateYear.addEventListener('change', updateCustomDays);
    customDateMonth.addEventListener('change', updateCustomDays);
    confirmCustomDateBtn.addEventListener('click', confirmCustomDate);
    
    editPurchaseDateBtn.addEventListener('click', () => {
        const purchaseId = editPurchaseIdInput.value;
        const purchase = purchases.find(p => p.id === purchaseId);
        openCustomDatePicker('purchase', purchase.timestamp);
    });
    
    editSaleDateBtn.addEventListener('click', () => {
        const saleId = editSaleIdInput.value;
        const sale = sales.find(s => s.id === saleId);
        openCustomDatePicker('sale', sale.timestamp);
    });

    const clearAllForms = () => {
        salesItemSelect.value = '';
        salesQuantityInput.value = '';
        salesWeightInput.value = '';
        salesPriceInput.value = '';
        salesExtraInfoInput.value = '';

        purchaseStoreSelect.value = '';
        purchaseItemSelect.value = '';
        purchaseQuantityInput.value = '';
        purchaseWeightInput.value = '';
        purchasePriceInput.value = '';
        purchaseExtraInfoInput.value = '';

        inventoryStoreSelect.value = '';
        inventoryItemSelect.value = '';
        inventoryQuantityInput.value = '';
        inventoryWeightInput.value = '';
        inventoryExtraInfoInput.value = '';
    };

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', clearAllForms);
    });

    document.getElementById('donate-link').addEventListener('click', () => {
        const cardNumber = '1234-5678-9012-3456'; 
        navigator.clipboard.writeText(cardNumber).then(() => {
            const copySuccessMessage = document.getElementById('copy-success');
            copySuccessMessage.style.display = 'block';
            setTimeout(() => {
                copySuccessMessage.style.display = 'none';
            }, 3000); // پیام به مدت 3 ثانیه نمایش داده می‌شود
        });
    });

    // --- Initial Load ---
    const initializeApp = () => {
        const savedTheme = localStorage.getItem('anbari_theme') || 'light';
        applyTheme(savedTheme);
        renderStoresList();
        populateStoreSelects();
        populateItemSelects();
        showPage('stores-page');
    };

    initializeApp();

    // باز کردن مدال ویرایش خرید
    const openEditPurchaseModal = (purchaseId) => {
        const purchase = purchases.find(p => p.id === purchaseId);
        if (!purchase) return;
        
        editPurchaseIdInput.value = purchase.id;
        editPurchaseStoreSelect.value = purchase.storeId;
        populateItemSelects();
        editPurchaseItemSelect.value = purchase.itemId;
        
        // Enable inputs and set values
        editPurchaseQuantity.disabled = false;
        editPurchaseWeight.disabled = false;
        editPurchasePrice.disabled = false;
        
        editPurchaseQuantity.value = purchase.quantity || '';
        editPurchaseWeight.value = purchase.weight || '';
        editPurchasePrice.value = purchase.price || '';
        editPurchaseExtraInfo.value = purchase.extraInfo || '';
        
        // Disable quantity/weight based on item type
        const item = items.find(i => i.id === purchase.itemId);
        if (item) {
            if (item.importance === 'quantity') {
                editPurchaseWeight.disabled = true;
                editPurchaseWeight.value = '';
            } else if (item.importance === 'weight') {
                editPurchaseQuantity.disabled = true;
                editPurchaseQuantity.value = '';
            }
        }
        
        const formattedDate = formatDate(purchase.timestamp);
        editPurchaseTimestampDisplay.textContent = formattedDate;
        editPurchaseTimestampDisplay.dataset.timestamp = purchase.timestamp;
        
        editPurchaseModal.style.display = 'block';
    };
    
    // تایید ویرایش خرید
    const confirmEditPurchase = () => {
        const purchaseId = editPurchaseIdInput.value;
        const storeId = editPurchaseStoreSelect.value;
        const itemId = editPurchaseItemSelect.value;
        const quantity = parseInt(editPurchaseQuantity.value) || 0;
        const weight = parseFloat(editPurchaseWeight.value) || 0;
        const price = parseFloat(editPurchasePrice.value) || 0;
        const totalPrice = price * (quantity || weight);
        const extraInfo = editPurchaseExtraInfo.value.trim();
        const timestamp = parseInt(editPurchaseTimestampDisplay.dataset.timestamp) || Date.now();
        
        if (!storeId) { 
            alert('لطفاً فروشگاه را انتخاب کنید.'); 
            return; 
        }
        if (!itemId) { 
            alert('لطفاً کالا را انتخاب کنید.'); 
            return; 
        }
        
        const item = items.find(i => i.id === itemId);
        if (!item) { 
            alert('کالای انتخاب شده یافت نشد.'); 
            return; 
        }
        
        if (item.importance === 'quantity' && weight > 0) {
            alert('ارزش کالا بر اساس تعداد است.');
            return;
        }
        if (item.importance === 'weight' && quantity > 0) {
            alert('ارزش کالا بر اساس وزن است.');
            return;
        }
        if (quantity <= 0 && weight <= 0) { 
            alert('لطفاً تعداد یا وزن معتبر وارد کنید.'); 
            return; 
        }
        
        const purchaseIndex = purchases.findIndex(p => p.id === purchaseId);
        if (purchaseIndex > -1) {
            const updatedPurchase = {
                id: purchaseId,
                storeId,
                itemId,
                quantity,
                weight,
                price,
                totalPrice,
                extraInfo,
                timestamp
            };
            
            purchases[purchaseIndex] = updatedPurchase;
            saveData();
            renderPurchaseLog();
            renderPurchaseList(purchaseListStoreSelect.value);
            editPurchaseModal.style.display = 'none';
            
            if (document.getElementById('tools-page').classList.contains('active')) {
                renderInventoryList(purchaseListStoreSelect.value);
            }
            
            showSuccessMessage('تغییرات با موفقیت ذخیره شد');
        }
    };
    
    // حذف خرید
    const deletePurchase = () => {
        if (confirm('آیا مطمئنی می‌خوای این خرید رو حذف کنی؟')) {
            const purchaseId = editPurchaseIdInput.value;
            const purchaseIndex = purchases.findIndex(p => p.id === purchaseId);
            
            if (purchaseIndex > -1) {
                purchases.splice(purchaseIndex, 1);
                saveData();
                renderPurchaseLog();
                renderPurchaseList(purchaseListStoreSelect.value);
                editPurchaseModal.style.display = 'none';
                
                if (document.getElementById('tools-page').classList.contains('active')) {
                    renderInventoryList(purchaseListStoreSelect.value);
                }
                
                showSuccessMessage('خرید با موفقیت حذف شد');
            }
        }
    };

    document.addEventListener('click', (e) => {
        if (e.target.closest('.purchase-card-header')) {
            const purchaseId = e.target.closest('.purchase-card').dataset.purchaseId;
            openEditPurchaseModal(purchaseId);
        }
    });
    
    confirmEditPurchaseBtn.addEventListener('click', confirmEditPurchase);
    deletePurchaseBtn.addEventListener('click', deletePurchase);

    document.addEventListener('click', function(event) {
        if (event.target.closest('.delete-btn')) {
            const purchaseItem = event.target.closest('.purchase-item');
            if (purchaseItem) {
                purchaseItem.remove();
                savePurchases();
                showSuccessMessage('کالا با موفقیت حذف شد');
            }
        }
    });

    // --- Purchase Log Functions ---
    const renderPurchaseLog = () => {
        const storeId = purchaseStoreSelect.value;
        if (storeId) {
            renderPurchaseList(storeId);
        } else {
            purchaseListGrid.innerHTML = '';
            purchaseListEmpty.style.display = 'block';
        }
    };

    purchaseStoreSelect.addEventListener('change', renderPurchaseLog);

    // --- Event Listeners ---
    if (editSaleDateBtn) {
        editSaleDateBtn.addEventListener('click', () => openDatePicker('edit-sale-date-btn'));
    }

    // --- Purchase Page Logic ---
    purchaseStoreSelect.addEventListener('change', () => {
        const storeId = purchaseStoreSelect.value;
        renderPurchaseLog();
    });

    // --- Initial Load ---
    // Removed duplicate initializeApp function declaration

    salesItemSelect.addEventListener('change', () => {
        const storeId = salesStoreSelect.value;
        const itemId = salesItemSelect.value;
        if (storeId && itemId) {
            const item = items.find(i => i.id === itemId);
            if (!item) {
                salesItemStock.textContent = '';
                return;
            }
            const stock = calculateInventory(storeId, itemId);
            salesItemStock.textContent = `موجودی: ${item.importance === 'quantity' 
                ? `${stock.quantity} عدد (مجموع خرید: ${stock.totalPurchasedQuantity} عدد)` 
                : `${stock.weight.toFixed(2)} کیلوگرم (مجموع خرید: ${stock.totalPurchasedWeight.toFixed(2)} کیلوگرم)`}`;
        } else {
            salesItemStock.textContent = '';
        }
    });

    salesItemSelect.addEventListener('change', () => {
        const storeId = salesStoreSelect.value;
        const itemId = salesItemSelect.value;
        if (storeId && itemId) {
            const item = items.find(i => i.id === itemId);
            if (!item) {
                salesItemStock.textContent = '';
                return;
            }
            const stock = calculateInventory(storeId, itemId);
            salesItemStock.textContent = `موجودی: ${item.importance === 'quantity' 
                ? `${stock.quantity} عدد (مجموع خرید: ${stock.totalPurchasedQuantity} عدد)` 
                : `${stock.weight.toFixed(2)} کیلوگرم (مجموع خرید: ${stock.totalPurchasedWeight.toFixed(2)} کیلوگرم)`}`;
        } else {
            salesItemStock.textContent = '';
        }
    });

    window.addSale = window.addSale || function() {
        const storeId = salesStoreSelect.value;
        const itemId = salesItemSelect.value;
        const quantity = parseInt(salesQuantityInput.value) || 0;
        const weight = parseFloat(salesWeightInput.value) || 0;
        const price = parseFloat(salesPriceInput.value) || 0;
        const extraInfo = salesExtraInfoInput.value.trim();
        const timestamp = Date.now();

        // Validate basic inputs
        if (!storeId) { alert('لطفاً فروشگاه را انتخاب کنید.'); return; }
        if (!itemId) { alert('لطفاً کالا را انتخاب کنید.'); return; }
        const item = items.find(i => i.id === itemId);
        if (!item) { alert('کالای انتخاب شده یافت نشد.'); return; }

        // Validate quantity/weight based on item importance
        if (item.importance === 'quantity' && weight > 0) {
            alert('ارزش کالا بر اساس تعداد است.');
            return;
        }
        if (item.importance === 'weight' && quantity > 0) {
            alert('ارزش کالا بر اساس وزن است.');
            return;
        }
        if (quantity <= 0 && weight <= 0) { alert('لطفاً تعداد یا وزن معتبر وارد کنید.'); return; }
        if (price <= 0) { alert('لطفاً قیمت واحد معتبر وارد کنید.'); return; }

        // Check stock availability
        const currentStock = calculateInventory(storeId, itemId);
        
        if (item.importance === 'quantity') {
            if (quantity > currentStock.quantity) {
                alert(`مقدار درخواستی (${quantity} عدد) از موجودی کل (${currentStock.quantity} عدد) بیشتر است.`);
                return;
            }
        } else { // weight
            if (weight > currentStock.weight) {
                alert(`وزن درخواستی (${weight.toFixed(2)} کیلوگرم) از موجودی کل (${currentStock.weight.toFixed(2)} کیلوگرم) بیشتر است.`);
                return;
            }
        }

        // If we get here, all validations passed
        const newSale = { 
            id: `s-${timestamp}`, 
            storeId, 
            itemId, 
            quantity, 
            weight, 
            price,
            extraInfo, 
            timestamp
        };
        
        // Add the sale and update displays
        sales.push(newSale);
        saveData();

        // Reset form and refresh page data
        clearSalesForm();
        loadSalesPageData();
        
        // Restore the selected store and refresh its data
        salesStoreSelect.value = storeId;
        salesStoreSelect.dispatchEvent(new Event('change'));
        
        // Show success message
        showSuccessMessage('کالا با موفقیت ثبت شد');
        
        // Update all necessary displays
        renderSalesLog(storeId);
        renderSalesList(storeId);
        renderInventoryList(storeId);
        populateItemSelectsForSale(storeId); // Update the item select with restored stock values
    };

    confirmSaleBtn.addEventListener('click', addSale);

    // --- Profit Loss Page Logic ---
    const loadProfitLossPageData = () => {
        const profitLossList = document.getElementById('profit-loss-list');
        profitLossList.innerHTML = '';

        const totalProfit = sales.reduce((sum, sale) => sum + (sale.price * (sale.quantity || sale.weight)), 0);
        const totalLoss = purchases.reduce((sum, purchase) => sum + (purchase.price * (purchase.quantity || purchase.weight)), 0);

        const profitLoss = totalProfit - totalLoss;

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="sale-box-content">
                <div class="sale-box-header">
                    <span class="sale-item-name">سود و زیان</span>
                </div>
                <div class="sale-item-date">سود کل: ${formatPrice(totalProfit)} تومان</div>
                <div class="sale-item-date">زیان کل: ${formatPrice(totalLoss)} تومان</div>
                <div class="sale-item-date">سود و زیان خالص: ${formatPrice(profitLoss)} تومان</div>
            </div>
        `;
        profitLossList.appendChild(li);
    };

    document.getElementById('profit-loss-btn')?.addEventListener('click', () => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show profit-loss page
        document.getElementById('profit-loss-page').classList.add('active');
        
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    });

    // When tools button is clicked in nav bar
    document.querySelector('.nav-btn[data-page="tools-page"]')?.addEventListener('click', () => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show tools page
        document.getElementById('tools-page').classList.add('active');
        
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Activate tools button
        document.querySelector('.nav-btn[data-page="tools-page"]').classList.add('active');
    });
});