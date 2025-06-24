const express = require("express");
const router = express.Router();
const bangLuongController = require("../controllers/bangLuongController");

router.post("/", bangLuongController.create);
router.get("/getKyLuong", bangLuongController.getKyLuong);
router.get("/", bangLuongController.getAll);

router.post("/getpl", bangLuongController.getPLByKyLuong);
router.post("/getplbycn", bangLuongController.getPLByKyLuongCN);
router.get("/getbl/:macn", bangLuongController.getBLByCN);
router.get("/getbltotal", bangLuongController.getBLTotal);
router.post("/createAll", bangLuongController.createAll);

router.get("/:id", bangLuongController.findOne);
router.put("/:id", bangLuongController.update);
router.delete("/deleteKyLuong", bangLuongController.deleteBL);
router.delete("/:id", bangLuongController.delete);

module.exports = router;
