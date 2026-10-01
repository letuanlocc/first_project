const routes = require('express').Router();
const { requireAuth, checkUser, requireAdmin } = require('../middleware/authMiddleware');
const Category  = require('../models/Category');
const { categoryDetailAndRender } = require('../controllers/userController');

routes.get("/:id", checkUser, categoryDetailAndRender);

module.exports = routes;