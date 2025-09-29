document.addEventListener("DOMContentLoaded", () => {
    // تحميل المنتجات من localStorage أو استخدام بيانات افتراضية إذا لم تكن موجودة
    let productsData = JSON.parse(localStorage.getItem("products"));
    if (!productsData || productsData.length === 0) {
        productsData = [
            { name: "تيشيرت", price: 100, category: "ملابس", img: "https://via.placeholder.com/250x200" },
            { name: "هاتف ذكي", price: 400, category: "إلكترونيات", img: "https://via.placeholder.com/250x200" },
            { name: "سماعات", price: 50, category: "إكسسوارات", img: "https://via.placeholder.com/250x200" },
            { name: "لابتوب", price: 800, category: "إلكترونيات", img: "https://via.placeholder.com/250x200" },
            { name: "جاكيت", price: 150, category: "ملابس", img: "https://via.placeholder.com/250x200" }
        ];
        localStorage.setItem("products", JSON.stringify(productsData));
    }

    const form = document.getElementById("product-form");
    const productList = document.getElementById("product-list");

    function renderProductsTable() {
        productList.innerHTML = '';
        productsData.forEach((p, index) => {
            const row = document.createElement("tr");
            row.className = 'border-b hover:bg-gray-50 text-right';
            row.innerHTML = `
                <td class="p-2"><img src="${p.img}" alt="${p.name}" class="w-16 h-16 object-cover rounded"></td>
                <td class="p-2">${p.name}</td>
                <td class="p-2">${p.price}$</td>
                <td class="p-2">${p.category}</td>
                <td class="p-2 flex items-center gap-2">
                    <button onclick="editProduct(${index})" class="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">تعديل</button>
                    <button onclick="deleteProduct(${index})" class="bg-red-500 text-white p-2 rounded-md hover:bg-red-600">حذف</button>
                </td>
            `;
            productList.appendChild(row);
        });
    }

    function saveProducts() {
        localStorage.setItem("products", JSON.stringify(productsData));
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("product-name").value;
        const price = parseFloat(document.getElementById("product-price").value);
        const category = document.getElementById("product-category").value;
        const img = document.getElementById("product-img").value;
        
        productsData.push({ name, price, category, img });
        saveProducts();
        form.reset();
        renderProductsTable();
        alert("✅ تم إضافة المنتج بنجاح!");
    });

    window.editProduct = function(index) {
        const productToEdit = productsData[index];
        document.getElementById("product-name").value = productToEdit.name;
        document.getElementById("product-price").value = productToEdit.price;
        document.getElementById("product-category").value = productToEdit.category;
        document.getElementById("product-img").value = productToEdit.img;
        
        // إزالة المنتج القديم بعد التعديل
        deleteProduct(index);
    };

    window.deleteProduct = function(index) {
        if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
            productsData.splice(index, 1);
            saveProducts();
            renderProductsTable();
            alert("❌ تم حذف المنتج بنجاح!");
        }
    };

    renderProductsTable();
});