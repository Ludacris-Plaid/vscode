const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const ProfileController = require('../controllers/profileController');
const CoverController = require('../controllers/coverController');

// User routes
router.post('/users', UserController.createUser);
router.get('/users/:id', UserController.getUser);

// Profile routes
router.get('/profiles/:id', ProfileController.getProfile);
router.put('/profiles/:id', ProfileController.updateProfile);

// Cover routes
router.post('/covers', CoverController.createCover);
router.get('/covers/:id', CoverController.getCover);

module.exports = router;