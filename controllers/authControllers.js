const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        // Trong bảng Users của chúng ta dùng cột username thay vì name, hoặc bạn có thể giữ nguyên tùy schema
        const { username, email, password } = req.body;
        
        // Sequelize dùng cú pháp where: { email }
        const existingUser = await User.findOne({where: {email}})
        if (existingUser){
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ 
            username, 
            email, 
            password: hashPassword,
        });
        
        res.redirect("/login");
    } catch (err){
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Sequelize tìm kiếm bằng cú pháp where
        const user = await User.findOne({ where: { email } });
        if (!user){
            return res.status(400).json({ message: "Invalid user" });
        }
        
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword){
            return res.status(400).json({ message: "Invalid email or password" });
        }
        
        // PostgreSQL dùng khóa chính là id (số nguyên) thay vì _id của MongoDB
        const token = jwt.sign(
            { userName: user.username, userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );
        
        res.cookie("token", token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 
        });
        
        if (user.role === "admin"){
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err){
        res.status(500).json({ message: "Server error", error: err.message });
    } 
};

const logout = (req, res) => {
    res.clearCookie("token");
    res.redirect('/');
};

module.exports = { register, login, logout };