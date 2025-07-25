const express = require("express");
const router = express.Router();
const nghiThaiSanController = require("../controllers/nghiThaiSanController");
const { uploadGiayThaiSan } = require("../middleware/upload");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/",authMiddleware, nghiThaiSanController.createNghiThaiSan);
router.get("/",authMiddleware,authMiddleware, nghiThaiSanController.getAllNghiThaiSan);
router.get("/:MaTK",authMiddleware, nghiThaiSanController.getNghiThaiSanByMaTK);
router.put("/:id",authMiddleware, nghiThaiSanController.updateNghiThaiSan);
router.delete("/:id",authMiddleware, nghiThaiSanController.deleteNghiThaiSan);
router.post("/upload",authMiddleware, uploadGiayThaiSan.single("giaythaisan"), nghiThaiSanController.uploadGiayThaiSan);

module.exports = router; 