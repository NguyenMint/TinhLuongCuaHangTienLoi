const express = require("express");
const router = express.Router();

const lichSuTangLuongController = require("../controllers/LichSuTangLuongController");

router.get("/:MaTK", lichSuTangLuongController.getByMaTK);

module.exports = router;
