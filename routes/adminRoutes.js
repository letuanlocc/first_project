const express = require('express');
const router = express.Router();
const path = require('path');
const { requireAuth, checkUser, requireAdmin } = require('../middleware/authMiddleware');
const Category  = require('../models/Category');

router.get("/", checkUser, requireAdmin , async (req, res) => {
    try{
        const Categories = await Category.findAll();
        res.render("admin", {
        Categories,
        user: req.data,
        error: req.query.error,
        success: req.query.success
    });
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;