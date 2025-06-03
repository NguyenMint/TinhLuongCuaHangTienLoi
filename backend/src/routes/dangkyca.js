const express = require('express');
const route = express.Router();
const DangKyCaController = require('../controllers/DangKyCaController');

route.get('/', DangKyCaController.getAll);
route.get('/:id', DangKyCaController.getById);
route.post('/', DangKyCaController.create);
route.put('/:id', DangKyCaController.update);
route.delete('/:id', DangKyCaController.delete);
route.get('/getCaLamByNhanVien/:MaTK', DangKyCaController.getCaLamByNhanVien);

module.exports = route; 