const express = require("express");
const route = express.Router();
const KhenThuongKyLuatController = require("../controllers/KhenThuongKyLuatController");
route.get("/",KhenThuongKyLuatController.getAll);
route.post("/",KhenThuongKyLuatController.create);
route.put("/:MaKTKL",KhenThuongKyLuatController.update);
route.delete("/:MaKTKL",KhenThuongKyLuatController.delete);
module.exports = route;