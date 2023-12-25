const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

// POST API for creating a new brand
router.post('/createBrand', brandController.createBrand);

// GET API for fetching all brands
router.get('/getAllBrands', brandController.getAllBrands);

module.exports = router;
