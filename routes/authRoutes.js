const {register, login, logout} = require('../controllers/authControllers')
const express = require('express');
const { requireAuth, checkUser} = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.get('/register', (req, res) => {
    res.render("register");
});
router.get('/login', (req, res) => {
    res.render("login");
});
module.exports = router;