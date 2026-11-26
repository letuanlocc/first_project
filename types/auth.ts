// Dữ liệu được ký trong JWT (xem authController.login) và gắn vào req.data.
export interface AuthUser {
    userName: string;
    userId: number;
    email: string;
    role: string;
}
