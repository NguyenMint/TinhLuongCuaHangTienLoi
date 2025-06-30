const { where } = require("sequelize");
const db = require("../models");
const { Op } = db.Sequelize;
const NguoiPhuThuoc = db.NguoiPhuThuoc;
const TaiKhoan = db.TaiKhoan;
class NguoiPhuThuocController {
  async getByNV(req, res) {
    try {
      const { MaTK } = req.params;
      const nguoiphuthuoc = await NguoiPhuThuoc.findAll({
        where: {
          MaTK,
        },
      });
      res.status(200).json(nguoiphuthuoc);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async create(req, res) {
    if (req.body.CCCD === "") {
      req.body.CCCD = null;
    }
    if (req.body.SoDienThoai === "") {
      req.body.SoDienThoai = null;
    }

    try {
      if (req.body.SoDienThoai) {
        const existSDT = await NguoiPhuThuoc.findOne({
          where: { SoDienThoai: req.body.SoDienThoai },
        });
        const existSDTTK = await TaiKhoan.findOne({
          where: { SoDienThoai: req.body.SoDienThoai },
        });
        if (existSDT || existSDTTK) {
          return res
            .status(409)
            .json({ message: "Đã tồn tại Số điện thoại này rồi" });
        }
      }
      if (req.body.CCCD) {
        const existCCCD = await NguoiPhuThuoc.findOne({
          where: { CCCD: req.body.CCCD },
        });
        const existCCCDTK = await TaiKhoan.findOne({
          where: { CCCD: req.body.CCCD },
        });
        if (existCCCD || existCCCDTK) {
          return res.status(409).json({ message: "Đã tồn tại CCCD này rồi" });
        }
      }

      const nguoiphuthuoc = await NguoiPhuThuoc.create(req.body);
      res.status(201).json(nguoiphuthuoc);
    } catch (error) {
      console.error("Lỗi khi tạo người phụ thuộc: ", error);
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi tạo người phụ thuộc." });
    }
  }
  async update(req, res) {
    const { MaNPT } = req.params;
    if (req.body.CCCD === "") {
      req.body.CCCD = null;
    }
    if (req.body.SoDienThoai === "") {
      req.body.SoDienThoai = null;
    }
    try {
      const nguoiphuthuoc = await NguoiPhuThuoc.findByPk(MaNPT);
      if (!nguoiphuthuoc) {
        return res
          .status(404)
          .json({ message: "Không tồn tại người phụ thuộc này" });
      }
      if (req.body.SoDienThoai) {
        const existSDT = await NguoiPhuThuoc.findOne({
          where: {
            SoDienThoai: req.body.SoDienThoai,
            MaNPT: { [Op.ne]: MaNPT },
          },
        });
        const existSDTTK = await TaiKhoan.findOne({
          where: { SoDienThoai: req.body.SoDienThoai },
        });
        if (existSDT || existSDTTK) {
          return res
            .status(409)
            .json({ message: "Đã tồn tại Số điện thoại này rồi" });
        }
      }
      if (req.body.CCCD) {
        const existCCCD = await NguoiPhuThuoc.findOne({
          where: {
            CCCD: req.body.CCCD,
            MaNPT: { [Op.ne]: MaNPT },
          },
        });
        const existCCCDTK = await TaiKhoan.findOne({
          where: { CCCD: req.body.CCCD },
        });
        if (existCCCD || existCCCDTK) {
          return res.status(409).json({ message: "Đã tồn tại CCCD này rồi" });
        }
      }

      await nguoiphuthuoc.update(req.body);
      res.status(200).json(nguoiphuthuoc);
    } catch (error) {
      console.error("Lỗi khi cập nhật người phụ thuộc: ", error);
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi cập nhật người phụ thuộc." });
    }
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
