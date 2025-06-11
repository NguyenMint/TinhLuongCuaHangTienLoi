const express = require("express");
const router = express.Router();
const bangLuongController = require("../controllers/bangLuongController");

router.post("/", bangLuongController.create);

router.get("/getKyLuong", bangLuongController.getKyLuong);

router.get("/", bangLuongController.getAll);

router.get("/:id", bangLuongController.findOne);

router.put("/:id", bangLuongController.update);

router.delete("/:id", bangLuongController.delete);

module.exports = router;
