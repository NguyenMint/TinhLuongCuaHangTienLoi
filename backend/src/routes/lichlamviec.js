const express = require('express');
const route = express.Router();
const LichLamViecController = require('../controllers/LichLamViecController');
route.get('/getCaLamByNhanVien/:MaTK', LichLamViecController.getCaLamByNhanVien);
route.get('/getAllDaDangKy', LichLamViecController.getAllDaDangKy);
route.get('/getAllCaLamMonthlyByNhanVien',LichLamViecController.getAllCaLamMonthlyByNhanVien);
route.post('/dangKyCa',LichLamViecController.dangKyCa);
route.delete('/huyDangKy/:MaLLV',LichLamViecController.huyDangKy);
route.get('/', LichLamViecController.getAll);
route.get('/:id', LichLamViecController.getById);
route.post('/', LichLamViecController.create);
route.put('/', LichLamViecController.update);
route.delete('/:id', LichLamViecController.delete);

module.exports = route; 