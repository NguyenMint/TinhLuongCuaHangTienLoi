const { where } = require("sequelize");
const db = require("../models");
const ThangLuong = db.ThangLuong;
const { Op } = db.Sequelize;
class ThangLuongController {
  async getAll(req, res) {
    try {
      const thangLuongs = await ThangLuong.findAll({});
      res.status(200).json(thangLuongs);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getAllThangLuongFullTime(req,res){
    try {
      const thangLuongs = await ThangLuong.findAll({
        where: { LoaiNV: "FullTime" },
      });
      res.status(200).json(thangLuongs);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getAllMauLuongPartTime(req,res){
    try {
      const thangLuongs = await ThangLuong.findAll({
        where: { LoaiNV: "PartTime" },
      });
      res.status(200).json(thangLuongs);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async create(req, res) {
    try {
      const {
        BacLuong,
        MaVaiTro,
        LuongCoBan,
        LuongTheoGio,
        LoaiNV,
      } = req.body;
      let thangLuong;
      if (LoaiNV === "FullTime") {
        const existBacLuong = await ThangLuong.findOne({
          where: { BacLuong, MaVaiTro },
        });
        if (existBacLuong) {
          return res.status(409).json({ message: "Bậc lương đã tồn tại" });
        }
        const LuongTheoGioFullTime = parseFloat(LuongCoBan/30/8);
        thangLuong = await ThangLuong.create({
          LuongCoBan,
          LuongTheoGio:LuongTheoGioFullTime,
          BacLuong,
          MaVaiTro,
          LoaiNV,
        });
      } else {
        thangLuong = await ThangLuong.create({
          LuongTheoGio,
          MaVaiTro,
          LoaiNV,
        });
      }
      res.status(201).json(thangLuong);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const {
        BacLuong,
        MaVaiTro,
        LuongCoBan,
        LuongTheoGio,
        LoaiNV,
        SoNgayPhep,
      } = req.body;
      const thangLuong = await ThangLuong.findByPk(req.params.id);
      if (!thangLuong) {
        return res.status(404).json({ message: "Thang lương không tồn tại" });
      }
      if (LoaiNV === "FullTime") {
        const existBacLuong = await ThangLuong.findOne({
          where: { BacLuong, MaVaiTro, MaThangLuong:{[Op.ne]: req.params.id} },
        });
        if (existBacLuong) {
          return res.status(409).json({ message: "Bậc lương đã tồn tại" });
        }
        const LuongTheoGioFullTime = parseFloat(LuongCoBan/30/8);
        await thangLuong.update({
          LuongCoBan,
          LuongTheoGio:LuongTheoGioFullTime,
          BacLuong,
          MaVaiTro,
          SoNgayPhep,
          LoaiNV,
        });
      } else {
        await thangLuong.update({
          LuongTheoGio,
          MaVaiTro,
          LoaiNV,
        });
      }
      res.status(200).json(thangLuong);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const thangLuong = await ThangLuong.findByPk(req.params.id);
      if (!thangLuong) {
        return res.status(404).json({ message: "Thang lương không tồn tại" });
      }
      let nhanVien = null;
      if (thangLuong.LoaiNV === "FullTime") {
        nhanVien = await db.TaiKhoan.findOne({
          where:{BacLuong: thangLuong.BacLuong, LuongCoBanHienTai: thangLuong.LuongCoBan}
        });
      }else {
        nhanVien = await db.TaiKhoan.findOne({
          where:{LuongTheoGioHienTai: thangLuong.LuongTheoGio}
        });
      }
      if(nhanVien){
        return res.status(400).json({ message: "Không thể xóa thang lương đang được sử dụng" });
      }
      await thangLuong.destroy();
      res.status(200).json({ message: "Xóa thang lương thành công" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new ThangLuongController();
