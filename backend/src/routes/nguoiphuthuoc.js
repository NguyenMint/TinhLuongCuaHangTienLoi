const express = require('express');
const route = express.Router();
const NguoiPhuThuocController = require("../controllers/NguoiPhuThuocController");
route.get("/",NguoiPhuThuocController.getAll);
route.post("/",NguoiPhuThuocController.create);
module.exports = route;