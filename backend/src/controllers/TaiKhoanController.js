const { where } = require("sequelize");
const db = require("../models");
const path = require("path");
const fs = require("fs");
const { Op } = db.Sequelize;
const TaiKhoan = db.TaiKhoan;
const NguoiPhuThuoc = db.NguoiPhuThuoc;
class TaiKhoanController {
  async getAll(req, res) {
    try {
      const taikhoans = await TaiKhoan.findAll({});
      res.status(200).json(taikhoans);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getAllNhanVien(req, res) {
    try {
      const taikhoans = await TaiKhoan.findAll({ where: { MaVaiTro: 2 } });
      res.status(200).json(taikhoans);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getById(req, res) {
    try {
      const { MaTK } = req.params;
      const taikhoan = await TaiKhoan.findByPk(MaTK);
      res.status(200).json(taikhoan);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async create(req, res) {
    try {
      const { CCCD, STK, Email } = req.body;
      const deleteUploadedFile = () => {
        if (req.file) {
          const filePath = path.join(
            __dirname,
            "../../uploads/avatars",
            req.file.filename
          );
          fs.unlink(filePath, (err) => {
            if (err) console.error("Không thể xóa file:", err);
          });
        }
      };
      const existCCCD = await TaiKhoan.findOne({ where: { CCCD } });
      const existCCCDNPT = await NguoiPhuThuoc.findOne({ where: { CCCD } });
      if (existCCCD || existCCCDNPT) {
        deleteUploadedFile();
        return res.status(409).json({ message: "Đã tồn tại CCCD này rồi" });
      }
      const existSTK = await TaiKhoan.findOne({ where: { STK } });
      if (existSTK) {
        deleteUploadedFile();
        return res.status(409).json({ message: "Đã tồn tại STK này rồi" });
      }
      const existEmail = await TaiKhoan.findOne({ where: { Email } });
      if (existEmail) {
        deleteUploadedFile();
        return res.status(409).json({ message: "Đã tồn tại Email này rồi" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "Vui lòng upload avatar" });
      }
      const avatarPath = path.join("uploads/avatars/", req.file.filename);
      const newTaiKhoan = await TaiKhoan.create({
        ...req.body,
        Avatar: avatarPath,
        STK,
        Email,
      });
      return res.status(201).json(newTaiKhoan);
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async update(req, res) {
    try {
      const { MaTK } = req.params;
      const taikhoan = await TaiKhoan.findByPk(MaTK);
      if (!taikhoan) {
        return res.status(404).json({ message: "Không tồn tại tài khoản này" });
      }
      const deleteUploadedFile = () => {
        if (req.file) {
          const filePath = path.join(
            __dirname,
            "../../uploads/avatars",
            req.file.filename
          );
          fs.unlink(filePath, (err) => {
            if (err) console.error("Không thể xóa file:", err);
          });
        }
      };
      const { CCCD, STK, Email } = req.body;
      const existCCCD = await TaiKhoan.findOne({
        where: { CCCD, MaTK: { [Op.ne]: MaTK } },
      });
      const existCCCDNPT = await NguoiPhuThuoc.findOne({ where: { CCCD } });
      if (existCCCD || existCCCDNPT) {
        deleteUploadedFile();
        return res.status(409).json({ message: "Đã tồn tại CCCD này rồi" });
      }
      const existSTK = await TaiKhoan.findOne({
        where: { STK, MaTK: { [Op.ne]: MaTK } },
      });
      if (existSTK) {
        deleteUploadedFile();
        return res.status(409).json({ message: "Đã tồn tại STK này rồi" });
      }
      const existEmail = await TaiKhoan.findOne({
        where: { Email, MaTK: { [Op.ne]: MaTK } },
      });
      if (existEmail) {
        deleteUploadedFile();
        return res.status(409).json({ message: "Đã tồn tại Email này rồi" });
      }
      if (req.file) {
        const oldAvatarPath = path.join(__dirname, "../../", taikhoan.Avatar);
        fs.unlink(oldAvatarPath, (err) => {
          if (err) console.error("Không thể xóa avatar cũ:", err);
        });
      }
      const avatarPath = path.join("uploads/avatars", req.file.filename);
      await taikhoan.update({
        ...req.body,
        Avatar: avatarPath,
        CCCD,
        Email,
        STK,
      });
      res.status(200).json(taikhoan);
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
module.exports = new TaiKhoanController();
