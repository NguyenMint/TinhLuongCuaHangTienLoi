const db = require("../models");
const HopDong = db.HopDongLd;
const path = require("path");
const fs = require("fs");
class HopDongController {
  async getAll(req, res) {
    try {
      const hopdongs = await HopDong.findAll({});
      res.status(200).json(hopdongs);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getByMaTK(req, res) {
    try {
      const hopdongs = await HopDong.findAll({
        where: { MaTK: req.params.MaTK },
      });
      res.status(200).json(hopdongs);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Vui lòng upload file hợp đồng" });
      }
      const filePath = path.join("uploads/hopdong/", req.file.filename);
      const hopdongLD = await HopDong.create({
        ...req.body,
        File: filePath,
      });
      res.status(201).json(hopdongLD);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async update(req, res) {
    console.log(req.body);
    
    try {
      const { MaHDLD } = req.params;
      const hopdong = await HopDong.findByPk(MaHDLD);
      if (!hopdong) {
        return res.status(404).json({ message: "Hợp dồng không tồn tại" });
      }
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Vui lòng upload file hợp đồng" });
      }
      const oldAvatarPath = path.join(__dirname, "../../", hopdong.File);
      fs.unlink(oldAvatarPath, (err) => {
        if (err) console.error("Không thể xóa hợp đồng cũ:", err);
      });
      const filePath = path.join("uploads/hopdong", req.file.filename);
      await hopdong.update({
        ...req.body,
        File: filePath,
      });
      res.status(200).json(hopdong);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async delete(req, res) {
    try {
      const { MaHDLD } = req.params;
      const hopdong = await HopDong.findByPk(MaHDLD);
      if (!hopdong) {
        return res.status(404).json({ message: "Hợp dồng không tồn tại" });
      }
      const oldAvatarPath = path.join(__dirname, "../../", hopdong.File);
      fs.unlink(oldAvatarPath, (err) => {
        if (err) console.error("Không thể xóa hợp đồng cũ:", err);
      });
      await hopdong.destroy();
      res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
module.exports = new HopDongController();
