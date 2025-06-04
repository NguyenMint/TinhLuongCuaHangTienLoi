const express = require('express');
const route = express.Router();
const ChamCongController = require('../controllers/ChamCongController');
route.post('/', ChamCongController.chamcong);
route.patch('/update', ChamCongController.update_chamcong);
module.exports = route;