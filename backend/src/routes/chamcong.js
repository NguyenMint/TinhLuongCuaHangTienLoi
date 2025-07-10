const express = require('express');
const route = express.Router();
const ChamCongController = require('../controllers/ChamCongController');
const {authMiddleware} = require('../middleware/authMiddleware');
const {authorizeRoles} = require('../middleware/authMiddleware');
route.post('/', authMiddleware, ChamCongController.chamcong);
route.put('/update',authMiddleware, authorizeRoles(1,3), ChamCongController.update_chamcong);
module.exports = route;