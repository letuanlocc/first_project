const searchInput = document.getElementById('product-search-input');
const productSearchForm = document.getElementById('product-search-form');
const addCart = document.getElementById('addCart');
// if (searchInput && productSearchForm) {
//     productSearchForm.addEventListener('submit', () => {
//         //
//     });
// }
const deleteCartButtons = document.querySelectorAll('.remove-cart-item');

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
                    quantity: Number(document.getElementById('qtyValue')?.textContent) || 1
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

deleteCartButtons.forEach((button) => {
    button.addEventListener("click", async () => {
        try{
            const response = await fetch(`/deletecart/${button.dataset.productId}`,{
                method: "DELETE",
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

            window.location.reload();
        }catch(err){
            console.error("Lỗi xóa:", err);
            showToast("Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng", 'error');
        }
    })
})

document.querySelectorAll('.add-cart-item').forEach((button) => {
    button.addEventListener("click", async () => {
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

            if (response.redirected) {
                window.location.href = response.url;
                return;
            }
            const data = await response.json();

            if (!response.ok) {
                showToast(data.error || "Có lỗi xảy ra", 'error');
                return;
            }

            window.location.reload();
        }catch(err){
            console.error("Lỗi thêm:", err);
            showToast("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng", 'error');
        }
    })
})

document.querySelectorAll('.favorite').forEach((button) => {
    button.addEventListener("click", () => {
        const pressed = button.getAttribute('aria-pressed') === 'true';
        button.setAttribute('aria-pressed', String(!pressed));
    })
})

/* ===== Chọn số lượng ở trang chi tiết ===== */
const qtyValue = document.getElementById('qtyValue');
if (qtyValue) {
    const qtyWarn = document.getElementById('qtyWarn');
    const qtyMax = Number(qtyValue.dataset.max);

    document.getElementById('qtyMinus').addEventListener('click', () => {
        qtyValue.textContent = Math.max(1, Number(qtyValue.textContent) - 1);
        qtyWarn.hidden = true;
    });
    document.getElementById('qtyPlus').addEventListener('click', () => {
        const next = Number(qtyValue.textContent) + 1;
        if (Number.isFinite(qtyMax) && qtyMax > 0 && next > qtyMax) {
            qtyWarn.hidden = false;
            return;
        }
        qtyValue.textContent = next;
        qtyWarn.hidden = true;
    });
}

/* ===== Nút gọi API dùng chung =====
   <button data-action-url="/..." data-method="DELETE" data-body="{...}">
   Thành công: hiện thông báo rồi tải lại trang. Lỗi: hiện thông báo lỗi. */
async function sendJson(url, method, body) {
    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body)
    });

    if (response.redirected) {
        window.location.href = response.url;
        return null;
    }

    let data = {};
    try {
        data = await response.json();
    } catch (err) {
        data = {};
    }
    return { ok: response.ok, data };
}

document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action-url]');
    if (!button) return;

    try {
        const body = button.dataset.body ? JSON.parse(button.dataset.body) : undefined;
        const result = await sendJson(button.dataset.actionUrl, button.dataset.method || 'POST', body);
        if (!result) return;

        if (!result.ok) {
            showToast(result.data.error || "Có lỗi xảy ra", 'error');
            return;
        }

        showToast(result.data.message || "Thành công");
        setTimeout(() => window.location.reload(), 600);
    } catch (err) {
        console.error("Lỗi thao tác:", err);
        showToast("Có lỗi xảy ra", 'error');
    }
});

/* ===== Form gửi JSON dùng chung =====
   <form data-ajax action="/..." method="POST" data-redirect="/profile#orders"> */
document.addEventListener('submit', async (event) => {
    const form = event.target.closest('form[data-ajax]');
    if (!form) return;
    event.preventDefault();

    try {
        const body = Object.fromEntries(new FormData(form));
        const result = await sendJson(form.getAttribute('action'), (form.getAttribute('method') || 'POST').toUpperCase(), body);
        if (!result) return;

        if (!result.ok) {
            showToast(result.data.error || "Có lỗi xảy ra", 'error');
            return;
        }

        showToast(result.data.message || "Thành công");
        setTimeout(() => {
            if (form.dataset.redirect) {
                window.location.href = form.dataset.redirect;
            } else {
                window.location.reload();
            }
        }, 600);
    } catch (err) {
        console.error("Lỗi gửi form:", err);
        showToast("Có lỗi xảy ra", 'error');
    }
});
