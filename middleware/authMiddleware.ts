import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { AuthUser } from '../types/auth.js';

const verifyToken = (token: string): AuthUser =>
    jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser;

//use at pages that require authentication
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        req.data = verifyToken(token);
        next();
    } catch (err) {
        return res.redirect('/login');
    }
};

//use at pages that don't require authentication -> homepage, login, register
const checkUser = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.cookies.token;
    if (!token) {
        req.data = null;
        next();
    } else {
        try {
            req.data = verifyToken(token);
            next();
        } catch (err) {
            req.data = null;
            next();
        }
    }
};

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = verifyToken(token);

        if (decoded.role !== "admin") {
            return res.status(403).send("Access denied");
        }

        req.data = decoded;
        next();

    } catch (err) {
        return res.redirect("/login");
    }
};

export { requireAuth, checkUser, requireAdmin };
