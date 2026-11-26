import { byId, closestTarget, findById } from './dom.js';
import type { ApiMessage } from './types.js';

const addCart = findById<HTMLButtonElement>('addCart');
const deleteCartButtons = document.querySelectorAll<HTMLButtonElement>('.remove-cart-item');

type ToastType = 'success' | 'error';

function showToast(message: string, type: ToastType = 'success'): void {
    let container = document.querySelector<HTMLDivElement>('.toast-container');
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
    addCart.addEventListener("click", async () => {
        try {
            const response = await fetch(`/api/cart/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: addCart.dataset.productId,
                    quantity: Number(findById('qtyValue')?.textContent) || 1
                })
            });

            if (response.redirected) {
                window.location.href = response.url;
                return;
            }
            const data: ApiMessage = await response.json();

            if (!response.ok) {
                showToast(data.error || "Có lỗi xảy ra", 'error');
                return;
            }

            showToast(data.message || "Đã thêm sản phẩm vào giỏ hàng!");
        } catch (err) {
            console.error("Lỗi update:", err);
            showToast("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng", 'error');
        }
    });
}

/* ===== Nút +/- trong giỏ hàng: PATCH /api/cart/items/:productId { quantity } ===== */
async function changeCartQuantity(button: HTMLElement, step: number): Promise<void> {
    const stepper = button.closest<HTMLElement>('.qty-stepper');
    if (!stepper) return;
    const quantity = Number(stepper.dataset.quantity) + step;

    try {
        const response = await fetch(`/api/cart/items/${stepper.dataset.productId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ quantity: Math.max(0, quantity) })
        });

        if (response.redirected) {
            window.location.href = response.url;
            return;
        }
        const data: ApiMessage = await response.json();

        if (!response.ok) {
            showToast(data.error || "Có lỗi xảy ra", 'error');
            return;
        }

        window.location.reload();
    } catch (err) {
        console.error("Lỗi cập nhật giỏ hàng:", err);
        showToast("Có lỗi xảy ra khi cập nhật giỏ hàng", 'error');
    }
}

deleteCartButtons.forEach((button) => {
    button.addEventListener("click", () => changeCartQuantity(button, -1));
});

document.querySelectorAll<HTMLButtonElement>('.add-cart-item').forEach((button) => {
    button.addEventListener("click", () => changeCartQuantity(button, 1));
});

document.querySelectorAll<HTMLButtonElement>('.favorite').forEach((button) => {
    button.addEventListener("click", () => {
        const pressed = button.getAttribute('aria-pressed') === 'true';
        button.setAttribute('aria-pressed', String(!pressed));
    });
});

/* ===== Chọn số lượng ở trang chi tiết ===== */
const qtyValue = findById('qtyValue');
if (qtyValue) {
    const qtyWarn = byId('qtyWarn');
    const qtyMax = Number(qtyValue.dataset.max);

    byId('qtyMinus').addEventListener('click', () => {
        qtyValue.textContent = String(Math.max(1, Number(qtyValue.textContent) - 1));
        qtyWarn.hidden = true;
    });
    byId('qtyPlus').addEventListener('click', () => {
        const next = Number(qtyValue.textContent) + 1;
        if (Number.isFinite(qtyMax) && qtyMax > 0 && next > qtyMax) {
            qtyWarn.hidden = false;
            return;
        }
        qtyValue.textContent = String(next);
        qtyWarn.hidden = true;
    });
}

/* ===== Nút gọi API dùng chung =====
   <button data-action-url="/..." data-method="DELETE" data-body="{...}">
   Thành công: hiện thông báo rồi tải lại trang. Lỗi: hiện thông báo lỗi. */
async function sendJson(url: string, method: string, body?: unknown): Promise<{ ok: boolean; data: ApiMessage } | null> {
    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? null : JSON.stringify(body)
    });

    if (response.redirected) {
        window.location.href = response.url;
        return null;
    }

    let data: ApiMessage = {};
    try {
        data = await response.json();
    } catch (err) {
        data = {};
    }
    return { ok: response.ok, data };
}

document.addEventListener('click', async (event) => {
    const button = closestTarget(event, '[data-action-url]');
    if (!button) return;

    try {
        const body = button.dataset.body ? JSON.parse(button.dataset.body) : undefined;
        const result = await sendJson(button.dataset.actionUrl ?? '', button.dataset.method || 'POST', body);
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
   <form data-ajax action="/api/..." method="POST" data-method="PATCH" data-redirect="/profile#orders">
   data-method dùng cho PATCH/DELETE vì thẻ form HTML chỉ hỗ trợ GET/POST. */
document.addEventListener('submit', async (event) => {
    const form = closestTarget<HTMLFormElement>(event, 'form[data-ajax]');
    if (!form) return;
    event.preventDefault();

    try {
        const body = Object.fromEntries(new FormData(form));
        const method = (form.dataset.method || form.getAttribute('method') || 'POST').toUpperCase();
        const result = await sendJson(form.getAttribute('action') ?? '', method, body);
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
