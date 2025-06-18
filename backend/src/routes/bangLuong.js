const express = require("express");
const router = express.Router();
const bangLuongController = require("../controllers/bangLuongController");

router.post("/", bangLuongController.create);
router.get("/getKyLuong", bangLuongController.getKyLuong);
router.get("/", bangLuongController.getAll);

router.post("/getbl", bangLuongController.getBLByKyLuong);
router.get("/getbl/:macn", bangLuongController.getBLByCN);
router.get("/getbltotal", bangLuongController.getBLTotal);

router.get("/:id", bangLuongController.findOne);
router.put("/:id", bangLuongController.update);
router.delete("/:id", bangLuongController.delete);

module.exports = router;
