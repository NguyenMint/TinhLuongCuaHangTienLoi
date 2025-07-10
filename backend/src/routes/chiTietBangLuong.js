const express = require("express");
const router = express.Router();
const chiTietBangLuongController = require("../controllers/chiTietBangLuongController");
const {authMiddleware} = require('../middleware/authMiddleware');
router.get('/getByNhanVienAndNgay',authMiddleware,chiTietBangLuongController.getByNhanVienAndNgay);
module.exports = router;
