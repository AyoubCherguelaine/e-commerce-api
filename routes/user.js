const express = require('express');
const router = express.Router();
const User = require('../controllers/user');

// User authentication routes
router.post('/register', User.register);
router.post('/login', User.login);

// User profile routes
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);

// User wishlist routes
router.get('/wishlist', UserController.getWishlist);
router.put('/wishlist/:productId', UserController.addToWishlist);
router.delete('/wishlist/:productId', UserController.removeFromWishlist);

// User order routes
router.get('/orders', UserController.getOrders);
router.post('/orders', UserController.createOrder);

module.exports = router;