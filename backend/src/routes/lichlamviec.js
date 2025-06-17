const express = require('express');
const route = express.Router();
const LichLamViecController = require('../controllers/LichLamViecController');
route.get('/', LichLamViecController.getAll);
route.get('/:id', LichLamViecController.getById);
route.post('/', LichLamViecController.create);
route.put('/', LichLamViecController.update);
route.delete('/:id', LichLamViecController.delete);
route.get('/getCaLamByNhanVien/:MaTK', LichLamViecController.getCaLamByNhanVien);

module.exports = route; 