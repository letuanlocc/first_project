import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import apiRoutes from './routes/api/index.js';
import webRoutes from './routes/web.js';

// ESM không có sẵn __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const startServer = async () => {
    await connectDB();
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(cookieParser());

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    app.use('/api', apiRoutes);   // REST API (JSON)
    app.use('/', webRoutes);      // các trang HTML

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
        console.log(`Server is running on port ${port}`);
    });
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
