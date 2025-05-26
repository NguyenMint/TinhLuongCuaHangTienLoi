const express = require('express');
const route = express.Router();
const ChiNhanhController = require('../controllers/ChiNhanhController');
route.get('/',ChiNhanhController.getAll);
module.exports = route;