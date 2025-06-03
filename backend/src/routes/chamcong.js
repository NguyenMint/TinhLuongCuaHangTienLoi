const express = require('express');
const route = express.Router();
const ChamCongController = require('../controllers/ChamCongController');
route.post('/', ChamCongController.chamcong);
module.exports = route;