const searchInput = document.getElementById('product-search-input');
const productSearchForm = document.getElementById('product-search-form');
const addCart = document.getElementById('addCart');
// if (searchInput && productSearchForm) {
//     productSearchForm.addEventListener('submit', () => {
//         //
//     });
// }
const deleteCart = document.getElementById('deleteCart');

function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    const icon = type === 'error' ? '✕' : '✓';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

if (addCart) {
    addCart.addEventListener("click", async ()=> {
        try{
            const response = await fetch(`/addcart`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: addCart.dataset.productId,
                    quantity: 1
                })
            })

            if (response.redirected) {
                window.location.href = response.url;
                return;
            }
            const data = await response.json();

            if (!response.ok) {
                showToast(data.error || "Có lỗi xảy ra", 'error');
                return;
            }

            showToast(data.message || "Đã thêm sản phẩm vào giỏ hàng!");
        }catch(err){
            console.error("Lỗi update:", err);
            showToast("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng", 'error');
        }
    })
}

deleteCart.addEventListener("click", async () =>{
    try{
        const response = await fetch(`/deleteCart/${remove-cart-item.dataset.productId}`,{
            method: "DELETE",
        })

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        alert(data.message)
    }catch(err){
        console.error("Lỗi update:", err);
        alert("Có lỗi xảy ra khi xóa sản phẩm ra giỏ hàng");
    }
})