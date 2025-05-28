const express = require("express");
const route = express.Router();
const KhenThuongKyLuatController = require("../controllers/KhenThuongKyLuatController");
route.get("/",KhenThuongKyLuatController.getAll);
module.exports = route;