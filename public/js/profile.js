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

orderFilters.forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        let visible = 0;

        orderFilters.forEach((other) => other.classList.toggle('active', other === button));
        orderCards.forEach((card) => {
            const show = filter === 'all' || card.dataset.status === filter;
            card.hidden = !show;
            if (show) visible += 1;
        });
        orderEmpty.hidden = visible > 0;
    });
});

/* ===== Hỏi lại trước khi hủy, xóa ===== */
document.querySelectorAll('.confirm-slot').forEach((slot) => {
    const askButton = slot.querySelector('.js-ask');
    const box = slot.querySelector('.confirm-box');

    askButton.addEventListener('click', () => {
        askButton.hidden = true;
        box.hidden = false;
    });
    slot.querySelector('.js-keep').addEventListener('click', () => {
        box.hidden = true;
        askButton.hidden = false;
    });
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
