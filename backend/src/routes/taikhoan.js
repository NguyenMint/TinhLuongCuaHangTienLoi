const express = require("express");
const route = express.Router();
const TaiKhoanController = require("../controllers/TaiKhoanController");
const { uploadAvatar } = require("../middleware/upload");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authMiddleware");
route.get(
  "/search",
  authMiddleware,
  authorizeRoles(1, 3),
  TaiKhoanController.searchEmployee
);
route.get(
  "/getAllNhanVienVaQuanLy",
  authMiddleware,
  authorizeRoles(1, 3),
  TaiKhoanController.getAllNhanVienVaQuanLy
);
route.get(
  "/getAllQuanLyByChiNhanh/:MaCN",
  authMiddleware,
  authorizeRoles(1, 3),
  TaiKhoanController.getAllQuanLyByChiNhanh
);
route.put(
  "/resetPass/:MaTK",
  authMiddleware,
  authorizeRoles(1, 3),
  TaiKhoanController.resetMK
);
route.put("/changePass/:MaTK", authMiddleware, TaiKhoanController.changePass);
route.put(
  "/updateNgungLamViec",
  authMiddleware,
  authorizeRoles(1, 3),
  TaiKhoanController.updateNgungLamViec
);
route.put(
  "/updateTiepTucLamViec",
  authMiddleware,
  authorizeRoles(1, 3),
  TaiKhoanController.updateTiepTucLamViec
);
route.get("/", authMiddleware, authorizeRoles(1, 3), TaiKhoanController.getAll);
route.get("/:MaTK", authMiddleware, TaiKhoanController.getById);
route.post(
  "/",
  authMiddleware,
  authorizeRoles(1, 3),
  uploadAvatar.single("avatar"),
  TaiKhoanController.create
);
route.put(
  "/:MaTK",
  authMiddleware,
  authorizeRoles(1, 3),
  uploadAvatar.single("avatar"),
  TaiKhoanController.update
);
route.post("/login", TaiKhoanController.login);

module.exports = route;
