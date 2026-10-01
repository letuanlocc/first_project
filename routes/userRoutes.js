const express = require('express');
const router = express.Router();
const path = require('path');
const { checkUser }= require('../middleware/authMiddleware');
const Product = require('../models/Product')
const Category  = require('../models/Category');

router.get("/", checkUser, async( req, res) => {
    const Categories = await Category.findAll();
    if (req.data?.role === "admin") {
        return res.redirect("/admin");
    }
    try{
        const products = await Product.findAll();
        res.render("user",{
            Categories,
            products,
            user: req.data
        });
    }catch(err){
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;