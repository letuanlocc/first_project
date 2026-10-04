const express = require('express');
const router = express.Router();
const path = require('path');
const { checkUser }= require('../middleware/authMiddleware');
const Product = require('../models/Product')
const Category  = require('../models/Category');
const { categoryDetailAndRender, getHome, detailProduct } = require('../controllers/userController');

router.get("/", checkUser, getHome)
router.get("/:slug",detailProduct)

module.exports = router;