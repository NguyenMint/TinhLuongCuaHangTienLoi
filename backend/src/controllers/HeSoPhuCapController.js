const { where } = require("sequelize");
const db = require("../models");
const heSoPhuCap = require("../models/heSoPhuCap");
const HeSoPhuCap = db.HeSoPhuCap;
const TaiKhoan = db.TaiKhoan;
const { Op } = db.Sequelize;
class HeSoPhuCapController {
  async getAll(req, res) {
    try {
      const cuoiTuan = await HeSoPhuCap.findAll({
        where: { LoaiNgay: "Cuối tuần" },
      });
      const ngayThuong = await HeSoPhuCap.findAll({
        where: { LoaiNgay: "Ngày thường" },
      });
      const ngayLe = await HeSoPhuCap.findAll({
        where: { LoaiNgay: "Ngày lễ" },
      });

      res.status(200).json({
        cuoiTuan,
        ngayThuong,
        ngayLe,
      });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getById(req, res) {
    try {
      const heSoPhuCap = await HeSoPhuCap.findByPk(req.params.id);
      if (!heSoPhuCap) {
        return res.status(404).json({ message: "Hệ số phụ cấp không tồn tại" });
      }
      res.status(200).json(heSoPhuCap);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      let { LoaiNgay, Ngay, HeSoLuongCaDem, HeSoLuongCaThuong } = req.body;
      if (LoaiNgay === "Cuối tuần") {
        const existHeSoCuoiTuan = await HeSoPhuCap.findOne({
          where: { LoaiNgay: "Cuối tuần" },
        });
        if (existHeSoCuoiTuan) {
          return res
            .status(409)
            .json({ message: "Đã có hệ số phụ cấp cuối tuần" });
        }
        Ngay = null;
      }
      if (LoaiNgay === "Ngày thường") {
        const existHeSoNgayThuong = await HeSoPhuCap.findOne({
          where: { LoaiNgay: "Ngày thường" },
        });
        if (existHeSoNgayThuong) {
          return res
            .status(409)
            .json({ message: "Đã có hệ số phụ cấp Ngày thường" });
        }
        Ngay = null;
      }
      const admin = await TaiKhoan.findOne({ where: { MaVaiTro: 3 } });
      const MaTK = admin.MaTK;
      const heSoPhuCapCaDem = await HeSoPhuCap.create({
        LoaiNgay,
        Ngay,
        HeSoLuong: HeSoLuongCaDem,
        isCaDem: 1,
        MaTK,
      });
      const heSoPhuCapCaThuong = await HeSoPhuCap.create({
        LoaiNgay,
        Ngay,
        HeSoLuong: HeSoLuongCaThuong,
        isCaDem: 0,
        MaTK,
      });
      res.status(201).json({ heSoPhuCapCaDem, heSoPhuCapCaThuong });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      let {
        Ngay,
        LoaiNgay,
        HeSoLuongCaDem,
        HeSoLuongCaThuong,
        MaHSNCaDem,
        MaHSNCaThuong,
      } = req.body;
      const heSoPhuCapCaDem = await HeSoPhuCap.findByPk(MaHSNCaDem);
      const heSoPhuCapCaThuong = await HeSoPhuCap.findByPk(MaHSNCaThuong);
      if (!heSoPhuCapCaDem || !heSoPhuCapCaThuong) {
        return res.status(404).json({ message: "Hệ số phụ cấp không tồn tại" });
      }
      if (LoaiNgay === "Cuối tuần" || LoaiNgay == "Ngày thường") {
        Ngay = null;
      }
      await heSoPhuCapCaDem.update({
        Ngay,
        HeSoLuong: HeSoLuongCaDem,
        isCaDem: 1,
      });
      await heSoPhuCapCaThuong.update({
        Ngay,
        HeSoLuong: HeSoLuongCaThuong,
        isCaDem: 0,
      });
      res.status(200).json({ heSoPhuCapCaDem, heSoPhuCapCaThuong });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const { MaHSNCaDem, MaHSNCaThuong } = req.body;
      console.log(req.body);
      const heSoPhuCapCaDem = await HeSoPhuCap.findByPk(MaHSNCaDem);
      const heSoPhuCapCaThuong = await HeSoPhuCap.findByPk(MaHSNCaThuong);
      if (!heSoPhuCapCaDem || !heSoPhuCapCaThuong) {
        return res.status(404).json({ message: "Hệ số phụ cấp không tồn tại" });
      }

      if (!heSoPhuCapCaDem && !heSoPhuCapCaThuong) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy hệ số phụ cấp để xóa" });
      }

      await heSoPhuCapCaDem.destroy();
      await heSoPhuCapCaThuong.destroy();

      res.status(200).json({ message: "Xóa hệ số phụ cấp thành công" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new HeSoPhuCapController();
