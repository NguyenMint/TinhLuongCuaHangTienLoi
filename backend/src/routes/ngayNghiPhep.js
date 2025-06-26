const express = require("express");
const route = express.Router();
const NgayNghiPhepController = require("../controllers/NgayNghiPhepController");
const { authMiddleware } = require("../middleware/authMiddleware");
route.get('/donChoDuyet',authMiddleware,NgayNghiPhepController.getDonXinChoDuyet);
route.get('/donxinnghiByNV/:MaTK',authMiddleware,NgayNghiPhepController.getDonXinNghiByNV);
route.post('/xinNghiPhep',authMiddleware,NgayNghiPhepController.xinNghiPhep);
route.put('/duyetDon/:MaNNP',authMiddleware,NgayNghiPhepController.duyetDon);

module.exports = route;
