const express = require('express');
const route = express.Router();
const PhuCapController = require('../controllers/PhuCapController');
route.get('/:MaTK',PhuCapController.getAll);
route.post('/',PhuCapController.create);
route.delete('/:MaPhuCap',PhuCapController.delete);
route.put('/:MaPhuCap',PhuCapController.update);

module.exports = route;