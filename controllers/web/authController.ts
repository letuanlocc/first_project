import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import User from '../../models/User.js';
import type { AuthUser } from '../../types/auth.js';

// Đăng nhập/đăng ký dùng form HTML thường (gửi form rồi chuyển trang),
// nên nằm ở phần trang chứ không ở /api.

// GET /register
const showRegister = (req: Request, res: Response) => {
    res.render("register", { error: null, username: "", email: "" });
};

// GET /login
const showLogin = (req: Request, res: Response) => {
    res.render("login", { error: null, email: "" });
};

// POST /register
const register = async (req: Request, res: Response) => {
    try {
        // Trong bảng Users của chúng ta dùng cột username thay vì name, hoặc bạn có thể giữ nguyên tùy schema
        const { username, email, password } = req.body;

        // Sequelize dùng cú pháp where: { email }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).render("register", { error: "Email này đã được đăng ký", username, email });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashPassword,
        });

        res.redirect("/login");
    } catch (err) {
        console.error("Lỗi đăng ký:", err);
        res.status(500).render("register", {
            error: "Lỗi hệ thống, vui lòng thử lại sau",
            username: req.body.username || "",
            email: req.body.email || ""
        });
    }
};

// POST /login
const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Sequelize tìm kiếm bằng cú pháp where
        const user = await User.findOne({ where: { email } });
        // Dùng chung một thông báo cho cả hai trường hợp để không lộ email nào đã đăng ký
        const loginError = "Email hoặc mật khẩu không đúng";
        if (!user) {
            return res.status(401).render("login", { error: loginError, email });
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(401).render("login", { error: loginError, email });
        }

        // PostgreSQL dùng khóa chính là id (số nguyên) thay vì _id của MongoDB
        const payload: AuthUser = { userName: user.username, userId: user.id, email: user.email, role: user.role };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as SignOptions['expiresIn'] }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        });

        if (user.role === "admin") {
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        res.status(500).render("login", {
            error: "Lỗi hệ thống, vui lòng thử lại sau",
            email: req.body.email || ""
        });
    }
};

// POST /logout
const logout = (req: Request, res: Response) => {
    res.clearCookie("token");
    res.redirect('/');
};

export { showRegister, showLogin, register, login, logout };
