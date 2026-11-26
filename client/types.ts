// Kiểu dữ liệu các API trả về (xem controllers/api/**).

// Phản hồi chung: lỗi có `error`, thành công thường có `message`.
export interface ApiMessage {
    error?: string;
    message?: string;
}

export interface AdminProduct {
    id: number;
    name: string;
    price: string;          // DECIMAL trả về dạng chuỗi
    stock: number;
    category_id: number | null;
    specifications?: Record<string, string | null>;
}

export interface Pagination {
    page: number;
    totalPages: number;
}

export interface ProductListResponse extends ApiMessage {
    products?: AdminProduct[];
    pagination: Pagination;
}

// GET /api/orders, GET /api/admin/orders: HTML render sẵn từ partial EJS.
export interface OrderListResponse extends Pagination {
    html: string;
    empty: boolean;
}
