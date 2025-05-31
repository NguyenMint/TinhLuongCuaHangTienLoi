const { where } = require("sequelize");
const db = require("../models");
const { Op } = db.Sequelize;
const NguoiPhuThuoc = db.NguoiPhuThuoc;
const TaiKhoan = db.TaiKhoan;
class NguoiPhuThuocController {
  async getAll(req, res) {
    try {
      const nguoiphuthuoc = await NguoiPhuThuoc.findAll({});
      res.status(200).json(nguoiphuthuoc);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async create(req, res) {
    const { CCCD } = req.body;
    if (CCCD) {
      const existCCCD = await NguoiPhuThuoc.findOne({ where: { CCCD } });
      const existCCCDTK = await TaiKhoan.findOne({ where: { CCCD } });
      if (existCCCD || existCCCDTK) {
        return res.json({ message: "Đã tồn tại CCCD này rồi" });
      }
    }
    const nguoiphuthuoc = await NguoiPhuThuoc.create(req.body);
    res.status(200).json(nguoiphuthuoc);
  }
  async update(req, res) {
    const { MaNPT } = req.params;
    const nguoiphuthuoc = await NguoiPhuThuoc.findByPk(MaNPT);
    if (!nguoiphuthuoc) {
      return res
        .status(404)
        .json({ message: "Không tồn tại người phụ thuộc này" });
    }
    const { CCCD } = req.body;
    if (CCCD) {
      const existCCCD = await NguoiPhuThuoc.findOne({
        where: { CCCD, MaNPT: { [Op.ne]: MaNPT } },
      });
      const existCCCDTK = await TaiKhoan.findOne({ where: { CCCD } });
      if (existCCCD || existCCCDTK) {
        return res.json({ message: "Đã tồn tại CCCD này rồi" });
      }
    }
    await nguoiphuthuoc.update(req.body);
    res.status(200).json(nguoiphuthuoc);
  }
  async delete(req, res) {
    const { MaNPT } = req.params;
    const nguoiphuthuoc = await NguoiPhuThuoc.findByPk(MaNPT);
    if (!nguoiphuthuoc) {
      return res
        .status(404)
        .json({ message: "Không tồn tại người phụ thuộc này" });
    }
    await nguoiphuthuoc.destroy();
    res.status(200).json({ message: "Xóa thành công" });
  }
}
module.exports = new NguoiPhuThuocController();
