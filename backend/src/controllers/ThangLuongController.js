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

  async getById(req, res) {
    try {
      const thangLuong = await ThangLuong.findByPk(req.params.id);
      if (!thangLuong) {
        return res.status(404).json({ message: "Thang lương không tồn tại" });
      }
      res.status(200).json(thangLuong);
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
        SoNgayPhep,
      } = req.body;
      let thangLuong;
      if (LoaiNV === "FullTime") {
        const existBacLuong = await ThangLuong.findOne({
          where: { BacLuong, MaVaiTro },
        });
        if (existBacLuong) {
          return res.status(409).json({ message: "Bậc lương đã tồn tại" });
        }
        thangLuong = await ThangLuong.create({
          LuongCoBan,
          BacLuong,
          MaVaiTro,
          SoNgayPhep,
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
      const existBacLuong = await ThangLuong.findOne({
        where: { BacLuong, MaVaiTro, [Op.ne]: req.params.id },
      });
      if (existBacLuong) {
        return res.status(409).json({ message: "Bậc lương đã tồn tại" });
      }
      if (LoaiNV === "FullTime") {
        const existBacLuong = await ThangLuong.findOne({
          where: { BacLuong, MaVaiTro, [Op.ne]: req.params.id },
        });
        if (existBacLuong) {
          return res.status(409).json({ message: "Bậc lương đã tồn tại" });
        }
        await thangLuong.update({
          LuongCoBan,
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
      await thangLuong.destroy();
      res.status(200).json({ message: "Xóa thang lương thành công" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new ThangLuongController();
