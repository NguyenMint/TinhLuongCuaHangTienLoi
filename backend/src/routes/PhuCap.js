const express = require('express');
const route = express.Router();
const PhuCapController = require('../controllers/PhuCapController');
route.get('/',PhuCapController.getAll);
module.exports = route;