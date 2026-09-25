
let productId = null;
let categoryId = null;
const productName = document.getElementById("productName");
const price = document.getElementById("price");
const description = document.getElementById("description");
const image = document.getElementById("image");
const category = document.getElementById("category");
const stock = document.getElementById("stock");
const searchProductBtn = document.getElementById("searchProductBtn");
const updateProductBtn = document.getElementById("updateProductBtn");
const categoryName = document.getElementById("categoryName")
const productTableContainer = document.getElementById("productTableContainer")
const productTableBody = document.getElementById('productTableBody');

console.log("ADMIN JS RUN");
console.log(updateProductBtn);
searchProductBtn.addEventListener("click", async () => {

    const name = productName.value.trim();

    if (!name) {
        alert("Nhập tên sản phẩm cần tìm");
        return;
    }

    try {
        const response = await fetch(
            `/product/search?name=${encodeURIComponent(name)}`
        );

        const product = await response.json();

        if (!response.ok) {
            alert(product.error);
            return;
        }

        if (!product) {
            productId = null;
            alert("Không tìm thấy sản phẩm");
            return;
        }

        // Lưu ID sản phẩm
        productId = product._id;

        // Điền thông tin
        productName.value = product.name;
        price.value = product.price;
        description.value = product.description || "";
        image.value = product.image || "";
        stock.value = product.stock;

        category.value = product.category.toString();

        alert("Đã tìm thấy sản phẩm");

    } catch (error) {
        console.error("Lỗi tìm sản phẩm:", error);
        alert("Có lỗi xảy ra khi tìm sản phẩm");
    }
});
updateProductBtn.addEventListener("click", async () => {
    
    if (!productId) {
        alert("Hãy tìm sản phẩm trước");
        return;
    }

    const productData = {
        name: productName.value.trim(),
        price: price.value,
        description: description.value,
        image: image.value,
        category: category.value,
        stock: stock.value
    };


    try {
        const response = await fetch(`/product/update/${productId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });
        
        const data = await response.json();
        

        if (!response.ok) {
            alert(data.error);
            return;
        }

        alert(data.message);
        window.location.href = "/admin";
    } catch (error) {
        console.error("Lỗi update:", error);
        alert("Có lỗi xảy ra khi update sản phẩm");
    }
});
addProductBtn.addEventListener("click",async () => {
    const formData = new FormData()

    formData.append("name", productName.value.trim());
    formData.append("price", price.value);
    formData.append("description", description.value);
    formData.append("category", category.value);
    formData.append("stock", stock.value);

    if (image.files[0]) {
        formData.append("image", image.files[0]);
    }

    try{
        const response = await fetch(`/product/addProduct`,{
            method: "POST",
            body: formData
        })

        const data = await response.json() 

        if(!response.ok){
            alert(data.error)
            return
        }

        alert(data.message)
        location.reload();
    }catch(error){
        console.error("Lỗi kết nối", error);
        alert("Có lỗi xảy ra khi thêm sản phẩm"); 
    }

});

deleteProductBtn.addEventListener("click", async ()=> {
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");

    if(!productId){
        alert("Hãy tìm sản phẩm trước");
        return;
    }

    if (!isConfirmed) {
        return; 
    }
    try{
        const response = await fetch(`/product/delete/${productId}`,{
            method: "DELETE"
        })
        
        const data = await response.json()

        if(!response.ok){
            alert(data.error)
            return
        }
        alert(data.message)
        location.reload();
    }catch(error){
        alert("Có lỗi xảy ra khi xóa sản phẩm")
    }
})

/// category

addCategoryBtn.addEventListener("click", async() => {
    try{
        const response = await fetch(`/product/addCategory/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: categoryName.value.trim()})
        })
        
        const data = await response.json()

        if(!response.ok){
            alert(data.error)
            return
        }
        alert(data.message)
    }catch(error){
        alert("Có lỗi xảy ra khi thêm category")
    }
});

deleteCategoryBtn.addEventListener("click", async() =>{
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
    if (!isConfirmed) {
        return; 
    }
    const name = categoryName.value.trim()
    try{
        const response = await fetch(`/product/deleteCategory?name=${encodeURIComponent(name)}`, {
            method: "DELETE"
        })

        const data = await response.json()

        if(!response.ok){
            alert(data.error)
            return
        }

        alert(data.message)
        window.location.href = "/admin";
    }catch(error){
        
    }
});

viewProductBtn.addEventListener("click", async() => {
    if(productTableContainer.style.display === 'none'){
        productTableContainer.style.display = 'block'
        viewProductBtn.innerText = 'Ẩn bảng sản phẩm'
        try {
            const response = await fetch('/product/view'); 
            const result = await response.json(); 

            if (response.ok && result.products) {
                const productTableBody = document.getElementById('productTableBody');
                productTableBody.innerHTML = ''; // Xóa sạch dữ liệu cũ

                result.products.forEach((product, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${product.name}</td>
                        <td>${product.price}</td>
                        <td>${product.stock}</td>
                        <td>
                            <button class="btn-edit" data-id="${product._id}">Sửa</button>
                            <button class="btn-delete" data-id="${product._id}">Xóa</button>
                        </td>
                    `;
                    productTableBody.appendChild(row);
                });
                } else {
                    alert(result.error || "Không thể tải danh sách sản phẩm");
                }
        }catch (error) {
            console.error('Lỗi kết nối:', error);
        }
    }else{
        productTableContainer.style.display = 'none'
        viewProductBtn.innerText = 'Xem tất cả sản phẩm'
    }
})

productTableBody.addEventListener("click" , async(e) =>{
    if(e.target.classList.contains("btn-edit")){
        const id = e.target.getAttribute('data-id')
        try{
            const response = await fetch(`/product/detail/${id}`)

            const data = await response.json()

            if(!response.ok){
                alert(data.error)
                return
            }

            productId = data._id;

            productName.value = data.name;
            price.value = data.price;
            description.value = data.description || "";
            image.value = data.image || "";
            stock.value = data.stock;

            category.value = data.category.toString();
            alert("Tìm kiếm thành công trả về kết quả trên form")

        }catch(err){
            alert("Có lỗi xảy ra khi tìm kiếm")
        }
    }
})