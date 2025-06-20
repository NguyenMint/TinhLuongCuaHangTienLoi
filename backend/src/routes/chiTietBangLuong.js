const express = require("express");
const router = express.Router();
const chiTietBangLuongController = require("../controllers/chiTietBangLuongController");

router.get('/getByNhanVienAndNgay',chiTietBangLuongController.getByNhanVienAndNgay);
router.post("/", chiTietBangLuongController.create);
router.get("/", chiTietBangLuongController.findAll);
router.get("/:id", chiTietBangLuongController.findOne);
router.put("/:id", chiTietBangLuongController.update);
router.delete("/:id", chiTietBangLuongController.delete);

module.exports = router;
