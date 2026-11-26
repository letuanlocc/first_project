import type { Request, Response } from 'express';

// Dùng tạm cho các API chưa viết logic.
export const notImplemented = (req: Request, res: Response) => {
    return res.status(501).json({ error: "Chức năng này chưa được xử lý" });
};

// Lấy một tham số query dạng chuỗi (bỏ qua mảng/object như ?a[]=1).
export const queryString = (value: unknown): string | undefined =>
    typeof value === 'string' ? value : undefined;

// ?page=3 -> 3. Thiếu, sai (abc) hoặc < 1 thì về trang 1.
export const queryPage = (value: unknown): number =>
    Math.max(parseInt(queryString(value) ?? '', 10) || 1, 1);

// Kết quả trả về từ các callback transaction: có error thì trả lỗi, không thì trả nguyên object.
export type ApiResult = {
    status: number;
    error?: string;
    [key: string]: unknown;
};

// Lấy message của một lỗi bất kỳ (catch trong TS có kiểu unknown).
export const errorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : String(error);
