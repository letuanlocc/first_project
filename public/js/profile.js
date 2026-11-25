const tabButtons = document.querySelectorAll('[data-tab]');
const tabPanels = document.querySelectorAll('[data-panel]');
const validTabs = Array.from(tabPanels).map((panel) => panel.dataset.panel);

function openTab(name) {
    if (!validTabs.includes(name)) name = 'orders';

    tabPanels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== name;
    });
    tabButtons.forEach((button) => {
        const active = button.dataset.tab === name;
        button.classList.toggle('active', active);
        if (active) {
            button.setAttribute('aria-current', 'page');
        } else {
            button.removeAttribute('aria-current');
        }
    });
    history.replaceState(null, '', '#' + name);
}

tabButtons.forEach((button) => {
    button.addEventListener('click', () => openTab(button.dataset.tab));
});
document.querySelectorAll('[data-tab-link]').forEach((button) => {
    button.addEventListener('click', () => openTab(button.dataset.tabLink));
});
openTab(window.location.hash.replace('#', ''));

/* ===== Lọc đơn hàng theo trạng thái ===== */
const orderFilters = document.querySelectorAll('#orderFilters [data-filter]');
const orderCards = document.querySelectorAll('#orderList .order-card');
const orderEmpty = document.getElementById('orderEmpty');
const orderList = document.getElementById('orderList');
loadOrders('all', 1);

async function loadOrders(status, page){
        try{
            const response = await fetch(`/api/orders?status=${status}&page=${page}`)

            if(!response.ok){
                throw new Error('Lỗi tải đơn hàng')
            }

            const data = await response.json()
            
            orderList.innerHTML = data.html
            orderEmpty.hidden = !data.empty
        }catch(err){
            console.error(err)
        }
    }
let currentStatus = 'all';      // trạng thái đang chọn, khớp nút "Tất cả" đang active

orderFilters.forEach((button) => {
    button.addEventListener('click', () => {
        orderFilters.forEach((other) => other.classList.toggle('active', other === button));
        currentStatus = button.dataset.filter;
        loadOrders(currentStatus, 1);
    });
});

orderList.addEventListener('click', (e) => {
    const pageButton = e.target.closest('[data-page]');
    if (!pageButton) return;
    loadOrders(currentStatus, Number(pageButton.dataset.page));
});
// exmample: 

/* ===== Hỏi lại trước khi hủy, xóa ===== */
orderList.addEventListener('click', (e) => {
    const slot = e.target.closest('.confirm-slot');
    if (!slot) return;                          // click không liên quan thì bỏ qua
    const askButton = slot.querySelector('.js-ask');
    const box = slot.querySelector('.confirm-box');

    if (e.target.closest('.js-ask'))  { askButton.hidden = true;  box.hidden = false; }
    if (e.target.closest('.js-keep')) { box.hidden = true;  askButton.hidden = false; }
});

/* ===== Form thêm địa chỉ ===== */
const addressForm = document.getElementById('addressForm');
document.getElementById('openAddressForm').addEventListener('click', () => {
    addressForm.hidden = false;
    addressForm.querySelector('input').focus();
});

document.getElementById('closeAddressForm').addEventListener('click', () => {
    addressForm.reset();
    addressForm.hidden = true;
});

/* ===== Viết đánh giá ===== */
document.querySelectorAll('.review-pending').forEach((block) => {
    const form = block.querySelector('.review-form');
    const ratingInput = form.querySelector('input[name="rating"]');
    const stars = form.querySelectorAll('.star-btn');

    block.querySelector('.js-write-review').addEventListener('click', () => {
        form.hidden = false;
    });
    block.querySelector('.js-cancel-review').addEventListener('click', () => {
        form.reset();
        form.hidden = true;
    });
    stars.forEach((star) => {
        star.addEventListener('click', () => {
            const value = Number(star.dataset.star);
            ratingInput.value = value;
            stars.forEach((other) => other.classList.toggle('is-on', Number(other.dataset.star) <= value));
        });
    });
});
