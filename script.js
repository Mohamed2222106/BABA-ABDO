let tables = [];
let activeTableId = null;
let currentDish = null;
let selectedExtra = null;

// ����� ���������� ����� ��� ��� ���������� ������
function createTables() {
    const numTables = parseInt(document.getElementById('num-tables').value, 10);

    if (isNaN(numTables) || numTables < 1 || numTables > 10) {
        alert('���� ����� ��� ���� ��� 1 � 10.');
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
            <h3>������� ${table.id}</h3>
            <div id="orders-${table.id}"></div>
            <p id="total-${table.id}">��������: 0</p>
            <button onclick="endOrder(${table.id})">����� �������</button>`;
        
        tableDiv.addEventListener('click', () => openMenu(table.id));
        tablesContainer.appendChild(tableDiv);
    }
}

// ��� ����� ������� ��� ����� ��� �������
function openMenu(tableId) {
    activeTableId = tableId;
    document.getElementById('menu-popup').style.display = 'block';
}

// ����� ����� �������
function closeMenu() {
    document.getElementById('menu-popup').style.display = 'none';
}

// ������ ����� (��� ��������)
function chooseExtraOption(dishName, price) {
    if (activeTableId === null) {
        alert('���� ������ ������� �����.');
        return;
    }

    currentDish = { name: dishName, price: price };
    document.getElementById('menu-popup').style.display = 'none';
    document.getElementById('extra-option-popup').style.display = 'block';
}

// ����� ����� ������ ��������
function closeExtraOptionPopup() {
    document.getElementById('extra-option-popup').style.display = 'none';
}

// ������ ��� �������� ��� ����� �������
function selectPastaType(extra) {
    selectedExtra = extra;

    // ��� ���� ������� "����"� �� ��� ����� �����
    if (selectedExtra !== '����') {
        currentDish.price += 20;
    }

    document.getElementById('extra-option-popup').style.display = 'none';
    document.getElementById('pasta-type-popup').style.display = 'block';
}

// ����� ����� ������ ��� ��������
function closePastaTypePopup() {
    document.getElementById('pasta-type-popup').style.display = 'none';
}

// ����� ��� ������ �� �����
function addPastaOrder(pastaType) {
    if (activeTableId !== null && currentDish !== null) {
        const table = tables.find(t => t.id === activeTableId);
        if (table) {
            const orderName = selectedExtra === '����' 
                ? `${currentDish.name} (${pastaType})`
                : `${currentDish.name} + ${selectedExtra} (${pastaType})`;

            const finalPrice = currentDish.price;
            table.orders.push({ name: orderName, price: finalPrice });
            displayOrders(table);
        }
    } else {
        alert('���� ������ ������� ������ �����.');
    }
    currentDish = null;
    selectedExtra = null;
    closePastaTypePopup();
}

// ����� ��� ��� ���������
function addOrderToActiveTable(name, price) {
    if (activeTableId !== null) {
        const table = tables.find(t => t.id === activeTableId);
        if (table) {
            table.orders.push({ name, price });
            displayOrders(table);
        }
    } else {
        alert('���� ������ ������� �����.');
    }
    closeMenu();
}

// ��� ������� ��������� �� ���������
function displayOrders(table) {
    const ordersDiv = document.getElementById('orders-' + table.id);
    ordersDiv.innerHTML = '';
    let total = 0;

    table.orders.forEach((order, index) => {
        total += order.price;
        const orderDiv = document.createElement('div');
        orderDiv.innerHTML = `${order.name} - ${order.price} <button onclick="removeOrder(${table.id}, ${index})">���</button>`;
        ordersDiv.appendChild(orderDiv);
    });
    
    // ����� �������� �� ����� ��������
    document.getElementById('total-' + table.id).textContent = '��������: ' + total;
}

// ����� ��� �� ���������
function removeOrder(tableId, orderIndex) {
    const table = tables.find(t => t.id === tableId);
    if (table) {
        table.orders.splice(orderIndex, 1);
        displayOrders(table);
    }
}

// ����� �������
function endOrder(tableId) {
    const table = tables.find(t => t.id === tableId);
    if (table) {
        table.orders = [];
        displayOrders(table);
        document.getElementById('total-' + table.id).textContent = '��������: 0';
    }
}