let tables = [];
let activeTableId = null;
let currentDish = null;
let selectedExtra = null;

// ÅäÔÇÁ ÇáÊÑÇÈíÒÇÊ ÈäÇÁğ Úáì ÚÏÏ ÇáÊÑÇÈíÒÇÊ ÇáãÏÎá
function createTables() {
    const numTables = parseInt(document.getElementById('num-tables').value, 10);

    if (isNaN(numTables) || numTables < 1 || numTables > 10) {
        alert('íÑÌì ÅÏÎÇá ÚÏÏ ÕÍíÍ Èíä 1 æ 10.');
        return;
    }

    const tablesContainer = document.getElementById('tables');
    tablesContainer.innerHTML = '';
    tables = [];

    for (let i = 1; i <= numTables; i++) {
        const table = { id: i, orders: [] };
        tables.push(table);

        const tableDiv = document.createElement('div');
        tableDiv.classList.add('table');
        tableDiv.id = `table-${table.id}`;
        tableDiv.innerHTML = `
            <h3>ÊÑÇÈíÒÉ ${table.id}</h3>
            <div id="orders-${table.id}"></div>
            <p id="total-${table.id}">ÇáÅÌãÇáí: 0</p>
            <button onclick="endOrder(${table.id})">ÅäåÇÁ ÇáÃæÑÏÑ</button>`;
        
        tableDiv.addEventListener('click', () => openMenu(table.id));
        tablesContainer.appendChild(tableDiv);
    }
}

// İÊÍ äÇİĞÉ ÇáŞÇÆãÉ ÚäÏ ÇáÖÛØ Úáì ÊÑÇÈíÒÉ
function openMenu(tableId) {
    activeTableId = tableId;
    document.getElementById('menu-popup').style.display = 'block';
}

// ÅÛáÇŞ äÇİĞÉ ÇáŞÇÆãÉ
function closeMenu() {
    document.getElementById('menu-popup').style.display = 'none';
}

// ÇÎÊíÇÑ ÅÖÇİÉ (ãËá ÇáãßÑæäÉ)
function chooseExtraOption(dishName, price) {
    if (activeTableId === null) {
        alert('íÑÌì ÇÎÊíÇÑ ÊÑÇÈíÒÉ ÃæáÇğ.');
        return;
    }

    currentDish = { name: dishName, price: price };
    document.getElementById('menu-popup').style.display = 'none';
    document.getElementById('extra-option-popup').style.display = 'block';
}

// ÅÛáÇŞ äÇİĞÉ ÇÎÊíÇÑ ÇáÅÖÇİÇÊ
function closeExtraOptionPopup() {
    document.getElementById('extra-option-popup').style.display = 'none';
}

// ÇÎÊíÇÑ äæÚ ÇáãßÑæäÉ ÈÚÏ ÊÍÏíÏ ÇáÅÖÇİÉ
function selectPastaType(extra) {
    selectedExtra = extra;

    // ÅĞÇ ßÇäÊ ÇáÅÖÇİÉ "ÈÏæä"¡ áÇ íÊã ÊÚÏíá ÇáÓÚÑ
    if (selectedExtra !== 'ÈÏæä') {
        currentDish.price += 20;
    }

    document.getElementById('extra-option-popup').style.display = 'none';
    document.getElementById('pasta-type-popup').style.display = 'block';
}

// ÅÛáÇŞ äÇİĞÉ ÇÎÊíÇÑ äæÚ ÇáãßÑæäÉ
function closePastaTypePopup() {
    document.getElementById('pasta-type-popup').style.display = 'none';
}

// ÅÖÇİÉ ØáÈ ãßÑæäÉ ãÚ äæÚåÇ
function addPastaOrder(pastaType) {
    if (activeTableId !== null && currentDish !== null) {
        const table = tables.find(t => t.id === activeTableId);
        if (table) {
            const orderName = selectedExtra === 'ÈÏæä' 
                ? `${currentDish.name} (${pastaType})`
                : `${currentDish.name} + ${selectedExtra} (${pastaType})`;

            const finalPrice = currentDish.price;
            table.orders.push({ name: orderName, price: finalPrice });
            displayOrders(table);
        }
    } else {
        alert('íÑÌì ÇÎÊíÇÑ ÊÑÇÈíÒÉ æÅÖÇİÉ ÇáØáÈ.');
    }
    currentDish = null;
    selectedExtra = null;
    closePastaTypePopup();
}

// ÅÖÇİÉ ØáÈ Åáì ÇáÊÑÇÈíÒÉ
function addOrderToActiveTable(name, price) {
    if (activeTableId !== null) {
        const table = tables.find(t => t.id === activeTableId);
        if (table) {
            table.orders.push({ name, price });
            displayOrders(table);
        }
    } else {
        alert('íÑÌì ÇÎÊíÇÑ ÊÑÇÈíÒÉ ÃæáÇğ.');
    }
    closeMenu();
}

// ÚÑÖ ÇáØáÈÇÊ æÇáÅÌãÇáí İí ÇáÊÑÇÈíÒÉ
function displayOrders(table) {
    const ordersDiv = document.getElementById('orders-' + table.id);
    ordersDiv.innerHTML = '';
    let total = 0;

    table.orders.forEach((order, index) => {
        total += order.price;
        const orderDiv = document.createElement('div');
        orderDiv.innerHTML = `${order.name} - ${order.price} <button onclick="removeOrder(${table.id}, ${index})">ÍĞİ</button>`;
        ordersDiv.appendChild(orderDiv);
    });
    
    // ÊÍÏíË ÇáÅÌãÇáí İí æÇÌåÉ ÇáãÓÊÎÏã
    document.getElementById('total-' + table.id).textContent = 'ÇáÅÌãÇáí: ' + total;
}

// ÅÒÇáÉ ØáÈ ãä ÇáÊÑÇÈíÒÉ
function removeOrder(tableId, orderIndex) {
    const table = tables.find(t => t.id === tableId);
    if (table) {
        table.orders.splice(orderIndex, 1);
        displayOrders(table);
    }
}

// ÅäåÇÁ ÇáÃæÑÏÑ
function endOrder(tableId) {
    const table = tables.find(t => t.id === tableId);
    if (table) {
        table.orders = [];
        displayOrders(table);
        document.getElementById('total-' + table.id).textContent = 'ÇáÅÌãÇáí: 0';
    }
}