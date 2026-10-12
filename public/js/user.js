const searchInput = document.getElementById('product-search-input');
const productSearchForm = document.getElementById('product-search-form');

// if (searchInput && productSearchForm) {
//     productSearchForm.addEventListener('submit', () => {
//         //
//     });
// }
addCart.addEventListener("click", async ()=> {
    try{

        const response = await fetch(`/addcart`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productId: button.dataset.productId,
                quantity: 1
            })
        })

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        alert(data.message);
    }catch(err){
        console.error("Lỗi update:", error);
        alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
    }
})
