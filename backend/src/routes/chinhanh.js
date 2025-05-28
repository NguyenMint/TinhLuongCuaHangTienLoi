const express = require('express');
const route = express.Router();
const ChiNhanhController = require('../controllers/ChiNhanhController');
route.get('/',ChiNhanhController.getAll);
route.post('/',ChiNhanhController.create);
route.put('/:MaCN',ChiNhanhController.update);
route.delete('/:MaCN',ChiNhanhController.delete);
module.exports = route;