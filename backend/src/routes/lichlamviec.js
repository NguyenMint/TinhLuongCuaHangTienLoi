const express = require('express');
const route = express.Router();
const LichLamViecController = require('../controllers/LichLamViecController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authMiddleware');
route.get('/getCaLamByNhanVien/:MaTK',authMiddleware, LichLamViecController.getCaLamByNhanVien);
route.get('/getAllDaDangKy',authMiddleware, authorizeRoles(1, 3), LichLamViecController.getAllDaDangKy);
route.get('/getAllCaLamByNhanVien/:MaTK',authMiddleware, LichLamViecController.getAllCaLamByNhanVien);
route.post('/dangKyCa',authMiddleware, LichLamViecController.dangKyCa);
route.delete('/huyDangKy/:MaLLV',authMiddleware, LichLamViecController.huyDangKy);
route.get('/',authMiddleware, authorizeRoles(1, 3), LichLamViecController.getAll);
route.get('/:id',authMiddleware, LichLamViecController.getById);
route.post('/',authMiddleware, authorizeRoles(1, 3), LichLamViecController.create);
route.put('/',authMiddleware, authorizeRoles(1, 3), LichLamViecController.update);
route.delete('/:id',authMiddleware, authorizeRoles(1, 3), LichLamViecController.delete);

module.exports = route; 