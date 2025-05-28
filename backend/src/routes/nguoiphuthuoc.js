const express = require('express');
const route = express.Router();
const NguoiPhuThuocController = require("../controllers/NguoiPhuThuocController");
route.get("/",NguoiPhuThuocController.getAll);
route.post("/",NguoiPhuThuocController.create);
route.put("/:MaNPT",NguoiPhuThuocController.update);
route.delete("/:MaNPT",NguoiPhuThuocController.delete);
module.exports = route;