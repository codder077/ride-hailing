const express = require('express');
const router = express.Router();
const cabController = require('../controllers/cabController');
const auth = require('../middleware/auth');

router.get('/', auth, cabController.listCabs);

module.exports = router; 