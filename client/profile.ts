import { byId, closestTarget } from './dom.js';
import type { OrderListResponse } from './types.js';

/* ===== Tab trên trang tài khoản ===== */
const tabButtons = document.querySelectorAll<HTMLElement>('[data-tab]');
const tabPanels = document.querySelectorAll<HTMLElement>('[data-panel]');
const validTabs = Array.from(tabPanels).map((panel) => panel.dataset.panel);

function openTab(name: string | undefined): void {
    const tab = name && validTabs.includes(name) ? name : 'orders';

    tabPanels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== tab;
    });
    tabButtons.forEach((button) => {
        const active = button.dataset.tab === tab;
        button.classList.toggle('active', active);
        if (active) {
            button.setAttribute('aria-current', 'page');
        } else {
            button.removeAttribute('aria-current');
        }
    });
    history.replaceState(null, '', '#' + tab);
}

tabButtons.forEach((button) => {
    button.addEventListener('click', () => openTab(button.dataset.tab));
});
document.querySelectorAll<HTMLElement>('[data-tab-link]').forEach((button) => {
    button.addEventListener('click', () => openTab(button.dataset.tabLink));
});
openTab(window.location.hash.replace('#', ''));

/* ===== Lọc đơn hàng theo trạng thái ===== */
const orderFilters = document.querySelectorAll<HTMLElement>('#orderFilters [data-filter]');
const orderEmpty = byId('orderEmpty');
const orderList = byId('orderList');
loadOrders('all', 1);

async function loadOrders(status: string, page: number): Promise<void> {
    try {
        const response = await fetch(`/api/orders?status=${status}&page=${page}`);

        if (!response.ok) {
            throw new Error('Lỗi tải đơn hàng');
        }

        const data: OrderListResponse = await response.json();

        orderList.innerHTML = data.html;
        orderEmpty.hidden = !data.empty;
    } catch (err) {
        console.error(err);
    }
}

let currentStatus = 'all';      // trạng thái đang chọn, khớp nút "Tất cả" đang active

orderFilters.forEach((button) => {
    button.addEventListener('click', () => {
        orderFilters.forEach((other) => other.classList.toggle('active', other === button));
        currentStatus = button.dataset.filter ?? 'all';
        loadOrders(currentStatus, 1);
    });
});

orderList.addEventListener('click', (e) => {
    const pageButton = closestTarget(e, '[data-page]');
    if (!pageButton) return;
    loadOrders(currentStatus, Number(pageButton.dataset.page));
});

/* ===== Hỏi lại trước khi hủy, xóa ===== */
orderList.addEventListener('click', (e) => {
    const slot = closestTarget(e, '.confirm-slot');
    if (!slot) return;                          // click không liên quan thì bỏ qua
    const askButton = slot.querySelector<HTMLElement>('.js-ask');
    const box = slot.querySelector<HTMLElement>('.confirm-box');
    if (!askButton || !box) return;

    if (closestTarget(e, '.js-ask')) { askButton.hidden = true; box.hidden = false; }
    if (closestTarget(e, '.js-keep')) { box.hidden = true; askButton.hidden = false; }
});

/* ===== Form thêm địa chỉ ===== */
const addressForm = byId<HTMLFormElement>('addressForm');
byId('openAddressForm').addEventListener('click', () => {
    addressForm.hidden = false;
    addressForm.querySelector('input')?.focus();
});

byId('closeAddressForm').addEventListener('click', () => {
    addressForm.reset();
    addressForm.hidden = true;
});

/* ===== Viết đánh giá ===== */
document.querySelectorAll<HTMLElement>('.review-pending').forEach((block) => {
    const form = block.querySelector<HTMLFormElement>('.review-form');
    const ratingInput = form?.querySelector<HTMLInputElement>('input[name="rating"]');
    if (!form || !ratingInput) return;
    const stars = form.querySelectorAll<HTMLElement>('.star-btn');

    block.querySelector('.js-write-review')?.addEventListener('click', () => {
        form.hidden = false;
    });
    block.querySelector('.js-cancel-review')?.addEventListener('click', () => {
        form.reset();
        form.hidden = true;
    });
    stars.forEach((star) => {
        star.addEventListener('click', () => {
            const value = Number(star.dataset.star);
            ratingInput.value = String(value);
            stars.forEach((other) => other.classList.toggle('is-on', Number(other.dataset.star) <= value));
        });
    });
});
