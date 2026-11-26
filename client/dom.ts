// Helper dùng chung cho các script trên trình duyệt.

// Lấy phần tử theo id, bắt buộc phải có (thiếu thì báo lỗi rõ ràng).
export function byId<T extends HTMLElement = HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Không tìm thấy phần tử #${id}`);
    return element as T;
}

// Lấy phần tử theo id, có thể không tồn tại trên trang hiện tại.
export function findById<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

// Tìm phần tử gần nhất khớp selector, tính từ chỗ người dùng click/submit.
export function closestTarget<T extends Element = HTMLElement>(event: Event, selector: string): T | null {
    return event.target instanceof Element ? event.target.closest<T>(selector) : null;
}

// Trả về HTML các nút trang, rút gọn: 1 … 4 [5] 6 … 24
export function buildPageButtons(page: number, totalPages: number): string {
    let html = '';
    let previous = 0;

    for (let n = 1; n <= totalPages; n++) {
        const show = n === 1 || n === totalPages || Math.abs(n - page) <= 1;
        if (!show) continue;

        if (n - previous > 1) html += '<span class="page-gap" aria-hidden="true">…</span>';
        previous = n;

        html += n === page
            ? `<span class="page-link is-current" aria-current="page">${n}</span>`
            : `<button type="button" class="page-link" data-page="${n}">${n}</button>`;
    }
    return html;
}
