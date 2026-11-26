import type { AuthUser } from './auth.js';

declare global {
    namespace Express {
        interface Request {
            data?: AuthUser | null;    // gắn bởi middleware/authMiddleware
            imageUrl?: string;         // gắn bởi middleware/cloudinaryMiddleware
            publicId?: string;
        }
    }
}

export {};
