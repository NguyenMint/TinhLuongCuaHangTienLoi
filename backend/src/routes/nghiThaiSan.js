const express = require("express");
const router = express.Router();
const ntsCtrl = require("../controllers/nghiThaiSanController");
const { uploadGiayThaiSan } = require("../middleware/upload");

router.post("/", ntsCtrl.createNghiThaiSan);
router.get("/", ntsCtrl.getAllNghiThaiSan);
router.get("/:MaTK", ntsCtrl.getNghiThaiSanByMaTK);
router.put("/:id", ntsCtrl.updateNghiThaiSan);
router.delete("/:id", ntsCtrl.deleteNghiThaiSan);
router.post("/upload", uploadGiayThaiSan.single("giaythaisan"), ntsCtrl.uploadGiayThaiSan);

module.exports = router; 