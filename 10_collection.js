document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("itemForm");
    const itemList = document.getElementById("itemList");
    const totalMonth = document.getElementById("totalMonth");
    const totalYear = document.getElementById("totalYear");
    const totalAll = document.getElementById("totalAll");

    function getCurrentMonth() {
        return new Date().getMonth() + 1; // 1月が0になるため+1
    }

    function getCurrentYear() {
        return new Date().getFullYear();
    }

    // データを取得・表示
    function loadItems() {
        const items = JSON.parse(localStorage.getItem("collection")) || [];
        itemList.innerHTML = "";
        let sumMonth = 0, sumYear = 0, sumAll = 0;
        const currentMonth = getCurrentMonth();
        const currentYear = getCurrentYear();

        items.forEach((item, index) => {
            const itemDate = new Date(item.date);
            const itemMonth = itemDate.getMonth() + 1;
            const itemYear = itemDate.getFullYear();

            sumAll += item.price;
            if (itemYear === currentYear) sumYear += item.price;
            if (itemMonth === currentMonth && itemYear === currentYear) sumMonth += item.price;

            const li = document.createElement("li");
            li.innerHTML = `${item.name} - ${item.price}円 - ${item.date} 
                <button onclick="removeItem(${index})">削除</button>`;
            itemList.appendChild(li);
        });

        totalMonth.textContent = `今月の合計: ${sumMonth}円`;
        totalYear.textContent = `今年の合計: ${sumYear}円`;
        totalAll.textContent = `全期間の合計: ${sumAll}円`;
    }

    // データを追加
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const itemName = document.getElementById("itemName").value;
        const itemPrice = document.getElementById("itemPrice").value;
        const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD形式

        if (itemName && itemPrice) {
            const items = JSON.parse(localStorage.getItem("collection")) || [];
            items.push({ name: itemName, price: parseInt(itemPrice), date: currentDate });
            localStorage.setItem("collection", JSON.stringify(items));
            loadItems();
            form.reset();
        }
    });

    // データを削除
    window.removeItem = (index) => {
        let items = JSON.parse(localStorage.getItem("collection")) || [];
        items.splice(index, 1);
        localStorage.setItem("collection", JSON.stringify(items));
        loadItems();
    };

    loadItems();
});
