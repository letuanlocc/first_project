const jwt = require('jsonwebtoken');
const User = require("../models/User");
//use at pages that require authentication
const requireAuth = (req, res, next) => {
    const token = req.cookies.token;   

    if(!token){
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.data = decoded;
        next();
    }catch(err){
        return res.redirect('/login');
    }
};
//use at pages that don't require authentication -> homepage, login, register
const checkUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token ) {
        req.data = null;
        next();
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.data = decoded;
            next();
        } catch(err) {
            req.data = null;
            next();
        }
    }
}; 

const requireAdmin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).send("Access denied");
        }

        req.data = decoded;
        next();

    } catch (err) {
        return res.redirect("/login");
    }
};
module.exports = { requireAuth, checkUser, requireAdmin };

