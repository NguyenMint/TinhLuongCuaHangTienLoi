const express = require('express');
const route = express.Router();
const TaiKhoanController = require("../controllers/TaiKhoanController");
route.get('/',TaiKhoanController.getAll);
route.get('/:MaTK',TaiKhoanController.getById);
module.exports = route;