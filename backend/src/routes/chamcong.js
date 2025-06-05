const express = require('express');
const route = express.Router();
const ChamCongController = require('../controllers/ChamCongController');
route.post('/', ChamCongController.chamcong);
route.put('/update', ChamCongController.update_chamcong);
module.exports = route;