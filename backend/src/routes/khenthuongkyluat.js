const express = require("express");
const route = express.Router();
const KhenThuongKyLuatController = require("../controllers/KhenThuongKyLuatController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authMiddleware");
route.get("/",authMiddleware,KhenThuongKyLuatController.getAll);
route.post("/",authMiddleware,authorizeRoles(1,3), KhenThuongKyLuatController.create);
route.delete("/:MaKTKL",authMiddleware, authorizeRoles(1,3), KhenThuongKyLuatController.delete);
module.exports = route;