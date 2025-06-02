const express = require('express');
const route = express.Router();
const TaiKhoanController = require("../controllers/TaiKhoanController");
const {uploadAvatar} = require("../middleware/upload");
route.get('/search',TaiKhoanController.searchEmployee);
route.get('/',TaiKhoanController.getAll);
route.get('/getAllNhanVienVaQuanLy',TaiKhoanController.getAllNhanVienVaQuanLy);
route.get('/:MaTK',TaiKhoanController.getById);
route.post('/',uploadAvatar.single('avatar'),TaiKhoanController.create);
route.put('/:MaTK',uploadAvatar.single('avatar'),TaiKhoanController.update);
route.post('/login',TaiKhoanController.login);

module.exports = route;