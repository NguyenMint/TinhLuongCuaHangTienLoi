const express = require("express");
const route = express.Router();
const HopDongController = require("../controllers/HopDongLDController");
const {uploadHopDong} = require("../middleware/upload");
route.get('/',HopDongController.getAll);
route.post('/',uploadHopDong.single("hopdong"),HopDongController.create);
route.put('/:MaHDLD',uploadHopDong.single('hopdong'),HopDongController.update);
route.delete('/:MaHDLD',HopDongController.delete);
module.exports = route;