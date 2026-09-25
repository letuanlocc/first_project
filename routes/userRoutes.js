const express = require('express');
const router = express.Router();
const path = require('path');
const { checkUser }= require('../middleware/authMiddleware');
const Product = require('../models/Product')

router.get("/", checkUser, async( req, res) => {
    if (req.data?.role === "admin") {
        return res.redirect("/admin");
    }
    try{
        const products = await Product.findAll();
        res.render("user",{
            products,
            user: req.data
        });
    }catch(err){
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;