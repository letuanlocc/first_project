import { buildPageButtons, byId, closestTarget } from './dom.js';
import type { AdminProduct, ApiMessage, OrderListResponse, ProductListResponse } from './types.js';

let productId: number | null = null;
const productName = byId<HTMLInputElement>("productName");
const price = byId<HTMLInputElement>("price");
const specifications = byId<HTMLTextAreaElement>("specifications");
const image = byId<HTMLInputElement>("image");
const category = byId<HTMLSelectElement>("category");
const stock = byId<HTMLInputElement>("stock");
const searchProductBtn = byId<HTMLButtonElement>("searchProductBtn");
const updateProductBtn = byId<HTMLButtonElement>("updateProductBtn");
const addProductBtn = byId<HTMLButtonElement>("addProductBtn");
const deleteProductBtn = byId<HTMLButtonElement>("deleteProductBtn");
const viewProductBtn = byId<HTMLButtonElement>("viewProductBtn");
const categoryName = byId<HTMLInputElement>("categoryName");
const categoryToDelete = byId<HTMLSelectElement>("categoryToDelete");
const addCategoryBtn = byId<HTMLButtonElement>("addCategoryBtn");
const deleteCategoryBtn = byId<HTMLButtonElement>("deleteCategoryBtn");
const productTableContainer = byId("productTableContainer");
const productTableBody = byId<HTMLTableSectionElement>('productTableBody');
const productPagination = byId('productPagination');

// Đổ dữ liệu một sản phẩm lên form sửa
function fillProductForm(product: AdminProduct): void {
    productId = product.id;
    productName.value = product.name;
    price.value = product.price;
    specifications.value = JSON.stringify(product.specifications || {}, null, 2);
    stock.value = String(product.stock);
    category.value = product.category_id?.toString() || "";
}

searchProductBtn.addEventListener("click", async () => {
    const name = productName.value.trim();

    if (!name) {
        alert("Nhập tên sản phẩm cần tìm");
        return;
    }

    try {
        const response = await fetch(
            `/api/admin/products?name=${encodeURIComponent(name)}`
        );

        const result: ProductListResponse = await response.json();

        if (!response.ok) {
            alert(result.error);
            return;
        }

        const product = result.products?.[0];
        if (!product) {
            productId = null;
            alert("Không tìm thấy sản phẩm");
            return;
        }

        fillProductForm(product);
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
        specifications: specifications.value,
        category_id: category.value,
        stock: stock.value
    };

    try {
        const response = await fetch(`/api/admin/products/${productId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });

        const data: ApiMessage = await response.json();

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

addProductBtn.addEventListener("click", async () => {
    const formData = new FormData();

    formData.append("name", productName.value.trim());
    formData.append("price", price.value);
    formData.append("specifications", specifications.value);
    formData.append("category_id", category.value);
    formData.append("stock", stock.value);

    const file = image.files?.[0];
    if (file) {
        formData.append("image", file);
    }

    try {
        const response = await fetch(`/api/admin/products`, {
            method: "POST",
            body: formData
        });

        const data: ApiMessage = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        alert(data.message);
        location.reload();
    } catch (error) {
        console.error("Lỗi kết nối", error);
        alert("Có lỗi xảy ra khi thêm sản phẩm");
    }

});

deleteProductBtn.addEventListener("click", async () => {
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");

    if (!productId) {
        alert("Hãy tìm sản phẩm trước");
        return;
    }

    if (!isConfirmed) {
        return;
    }
    try {
        const response = await fetch(`/api/admin/products/${productId}`, {
            method: "DELETE"
        });

        const data: ApiMessage = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }
        alert(data.message);
        location.reload();
    } catch (error) {
        alert("Có lỗi xảy ra khi xóa sản phẩm");
    }
});

/// category

addCategoryBtn.addEventListener("click", async () => {
    try {
        const response = await fetch(`/api/admin/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: categoryName.value.trim() })
        });

        const data: ApiMessage = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }
        alert(data.message);
    } catch (error) {
        alert("Có lỗi xảy ra khi thêm category");
    }
});

deleteCategoryBtn.addEventListener("click", async () => {
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
    if (!isConfirmed) {
        return;
    }
    const categoryId = categoryToDelete.value;
    if (!categoryId) {
        alert("Chọn danh mục cần xóa");
        return;
    }
    try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
            method: "DELETE"
        });

        const data: ApiMessage = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        alert(data.message);
        window.location.href = "/admin";
    } catch (error) {
        console.error("Lỗi xóa danh mục:", error);
    }
});

/// bảng sản phẩm (có phân trang)

viewProductBtn.addEventListener("click", async () => {
    if (productTableContainer.style.display === 'none') {
        productTableContainer.style.display = 'block';
        viewProductBtn.innerText = 'Ẩn bảng sản phẩm';

        await loadProducts(1);
    } else {
        productTableContainer.style.display = 'none';
        viewProductBtn.innerText = 'Xem tất cả sản phẩm';
    }
});

async function loadProducts(page: number): Promise<void> {
    try {
        const response = await fetch(`/api/admin/products?page=${page}`);
        const result: ProductListResponse = await response.json();

        if (response.ok && result.products) {
            productTableBody.innerHTML = ''; // Xóa sạch dữ liệu cũ

            result.products.forEach((product) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.stock}</td>
                    <td>
                        <button class="btn-edit" data-id="${product.id}">Sửa</button>
                        <button class="btn-delete" data-id="${product.id}">Xóa</button>
                    </td>
                `;
                productTableBody.appendChild(row);
            });

            renderPagination(result.pagination.page, result.pagination.totalPages);
        } else {
            alert(result.error || "Không thể tải danh sách sản phẩm");
        }
    } catch (error) {
        console.error('Lỗi kết nối:', error);
    }
}

productPagination.addEventListener('click', async (event) => {
    const button = closestTarget(event, 'button[data-page]');

    if (!button) return;

    const page = Number(button.dataset.page);

    await loadProducts(page);
});

function renderPagination(page: number, totalPages: number): void {
    productPagination.innerHTML = totalPages > 1 ? buildPageButtons(page, totalPages) : '';
}

productTableBody.addEventListener("click", async (e) => {
    const button = closestTarget(e, '.btn-edit, .btn-delete');
    if (!button) return;

    const id = button.getAttribute('data-id');
    try {
        const response = await fetch(`/api/admin/products/${id}`);

        const data: AdminProduct & ApiMessage = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        fillProductForm(data);
        alert("Tìm kiếm thành công trả về kết quả trên form");

    } catch (err) {
        alert("Có lỗi xảy ra khi tìm kiếm");
    }
});

/// tabs & đơn hàng

const adminTabs = document.querySelectorAll<HTMLElement>('[data-admin-tab]');
const adminPanels = document.querySelectorAll<HTMLElement>('[data-admin-panel]');

function openAdminTab(name: string | undefined): void {
    const tab = [...adminTabs].some((item) => item.dataset.adminTab === name) ? name : 'products';
    adminTabs.forEach((item) => item.classList.toggle('active', item.dataset.adminTab === tab));
    adminPanels.forEach((panel) => {
        panel.hidden = panel.dataset.adminPanel !== tab;
    });
}

adminTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        history.replaceState(null, '', '#' + tab.dataset.adminTab);
        openAdminTab(tab.dataset.adminTab);
    });
});

// Giữ đúng tab sau khi tải lại trang (ví dụ sau khi hủy đơn)
openAdminTab(window.location.hash.replace('#', ''));

const adminOrderFilters = document.querySelectorAll<HTMLElement>('#adminOrderFilters [data-filter]');
const adminOrderEmpty = byId('adminOrderEmpty');
const adminOrderBody = byId('adminOrderBody');
const adminOrderPagination = byId('adminOrderPagination');
let currentStatus = 'all';

async function loadOrders(status: string, page: number): Promise<void> {
    try {
        const response = await fetch(`/api/admin/orders?status=${status}&page=${page}`);

        if (!response.ok) {
            throw new Error('Lỗi tải đơn hàng');
        }

        const data: OrderListResponse = await response.json();

        adminOrderBody.innerHTML = data.html;
        adminOrderEmpty.hidden = !data.empty;
        renderAdminPager(data.page, data.totalPages);
    } catch (err) {
        console.error(err);
    }
}

function renderAdminPager(page: number, totalPages: number): void {
    if (totalPages <= 1) { adminOrderPagination.innerHTML = ''; return; }
    adminOrderPagination.innerHTML =
        `<nav class="pagination" aria-label="Phân trang đơn hàng">${buildPageButtons(page, totalPages)}</nav>`;
}

loadOrders('all', 1);

adminOrderFilters.forEach((button) => {
    button.addEventListener("click", () => {
        adminOrderFilters.forEach((other) => other.classList.toggle('active', other === button));
        currentStatus = button.dataset.filter ?? 'all';
        loadOrders(currentStatus, 1);
    });
});

adminOrderPagination.addEventListener('click', (e) => {
    const pageButton = closestTarget(e, '[data-page]');
    if (!pageButton) return;
    loadOrders(currentStatus, Number(pageButton.dataset.page));
});

document.addEventListener('click', async (event) => {
    const button = closestTarget(event, '[data-action-url]');

    if (!button) return;

    try {
        const response = await fetch(button.dataset.actionUrl ?? '', {
            method: button.dataset.method || 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: button.dataset.body ?? null   // đã là chuỗi JSON; null nếu không có
        });

        const data: ApiMessage = await response.json().catch(() => ({}));

        if (!response.ok) {
            alert(data.error || "Có lỗi xảy ra");
            return;
        }

        alert(data.message || "Thành công");
        window.location.reload();
    } catch (err) {
        console.error("Lỗi thao tác:", err);
        alert("Có lỗi xảy ra");
    }
});
