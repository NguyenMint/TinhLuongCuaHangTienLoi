const db = require("../models");
const PhuCap = db.PhuCap;
class PhuCapController {
  async getAllByTK(req, res) {
    try {
      const PhuCaps = await PhuCap.findAll({
        where: { MaTK: req.params.MaTK },
      });
      res.status(200).json(PhuCaps);
    } catch (error) {
      console.log("ERROR: " + error);
    }
  }
  async getAllByTKConHieuLuc(req, res) {
    try {
      const taiKhoan = await db.TaiKhoan.findOne({
        where: { MaNhanVien: req.params.MaNhanVien },
      });
      if (!taiKhoan) {
        return res.status(404).json({ message: "Tài khoản không tồn tại" });
      }
      const PhuCaps = await PhuCap.findAll({
        where: { MaTK: taiKhoan.MaTK, TrangThai: 1 },
      });
      res.status(200).json(PhuCaps);
    } catch (error) {
      console.log("ERROR: " + error);
    }
  }
  async create(req, res) {
    try {
      const phucap = await PhuCap.create(req.body);

      res.status(201).json(phucap);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const phuCap = await PhuCap.findByPk(req.params.MaPhuCap);

      if (!phuCap) {
        return res.status(404).json({
          success: false,
          message: "PhuCap not found",
        });
      }

      await phuCap.destroy();

      res.status(200).json({
        success: true,
        message: "PhuCap deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting PhuCap",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const { MaPhuCap } = req.params;
      const phucap = await PhuCap.findByPk(MaPhuCap);
      if (!phucap) {
        return res
          .status(404)
          .json({ message: "Không tồn tại khen thưởng kỷ luật này" });
      }
      const TrangThai = phucap.TrangThai ? 0 : 1;
      await phucap.update({ TrangThai });
      res.status(200).json(phucap);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new PhuCapController();
