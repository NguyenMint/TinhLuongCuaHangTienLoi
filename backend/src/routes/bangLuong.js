const express = require("express");
const router = express.Router();
const bangLuongController = require("../controllers/bangLuongController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authMiddleware");
router.post("/",authMiddleware, authorizeRoles(1, 3), bangLuongController.create);
router.get("/getKyLuong",authMiddleware, authorizeRoles(1, 3), bangLuongController.getKyLuong);
router.get("/",authMiddleware, authorizeRoles(1, 3), bangLuongController.getAll);

router.post("/getpl",authMiddleware, authorizeRoles(1, 3), bangLuongController.getPLByKyLuong);
router.post("/getplbycn",authMiddleware, authorizeRoles(1, 3), bangLuongController.getPLByKyLuongCN);
router.get("/getbl/:macn",authMiddleware, authorizeRoles(1, 3), bangLuongController.getBLByCN);
router.get("/getbltotal",authMiddleware, authorizeRoles(1, 3), bangLuongController.getBLTotal);
router.post("/createAll",authMiddleware, authorizeRoles(1, 3), bangLuongController.createAll);
router.delete("/deleteKyLuong",authMiddleware, authorizeRoles(1, 3), bangLuongController.deleteBL);
router.get("/:id",authMiddleware, authorizeRoles(1, 3), bangLuongController.findOne);

module.exports = router;
