const db = require("../models");
const LichLamViec = db.LichLamViec;
const { Op, where } = require("sequelize");
const { getSoNgayTrongThang } = require("../util/util");
const lichLamViec = require("../models/lichLamViec");
class LichLamViecController {
  async getAll(req, res) {
    try {
      const LichLamViecs = await LichLamViec.findAll({
        include: [
          { model: db.ChamCong, as: "cham_congs" },
          { model: db.CaLam, as: "MaCaLam_ca_lam" },
          {
            model: LichLamViec,
            as: "MaLLVCu_lich_lam_viec",
            include: [
              { model: db.CaLam, as: "MaCaLam_ca_lam" },
            ],
          },
          {
            model: db.TaiKhoan,
            as: "MaTK_tai_khoan",
            attributes: [
              "MaTK",
              "HoTen",
              "MaCN",
              "MaNhanVien",
              "LuongTheoGioHienTai",
            ],
          },
          {
            model: db.KhenThuongKyLuat,
            as: "khen_thuong_ky_luats",
          },
        ],
      });
      res.status(200).json(LichLamViecs);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getAllDaDangKy(req, res) {
    try {
      const LichLamViecs = await LichLamViec.findAll({
        where: {
          [Op.or]: [{ TrangThai: "Đã Đăng Ký" }, { TrangThai: "Chuyển Ca" }],
        },
        include: [
          { model: db.ChamCong, as: "cham_congs" },
          { model: db.CaLam, as: "MaCaLam_ca_lam" },
          {
            model: db.TaiKhoan,
            as: "MaTK_tai_khoan",
            attributes: [
              "MaTK",
              "HoTen",
              "MaCN",
              "MaNhanVien",
              "LuongTheoGioHienTai",
            ],
          },
          {
            model: db.KhenThuongKyLuat,
            as: "khen_thuong_ky_luats",
          },
        ],
      });
      res.status(200).json(LichLamViecs);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getById(req, res) {
    try {
      const lichLamViec = await LichLamViec.findByPk(req.params.id);
      if (!lichLamViec) {
        return res.status(404).json({ message: "Ca làm không tồn tại" });
      }
      res.status(200).json(lichLamViec);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getCaLamByNhanVien(req, res) {
    try {
      const { MaTK } = req.params;
      const { NgayLam } = req.query;
      const where = {
        MaTK,
        TrangThai: { [Op.in]: ["Đã Đăng Ký", "Chuyển Ca"] },
      };
      if (NgayLam) {
        const prevDate = new Date(NgayLam);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevDateStr = prevDate.toISOString().slice(0, 10);
        where[Op.or] = [
          { NgayLam: NgayLam },
          {
            NgayLam: prevDateStr,
            "$MaCaLam_ca_lam.ThoiGianKetThuc$": {
              [Op.lt]: db.sequelize.col("MaCaLam_ca_lam.ThoiGianBatDau"),
            },
          },
        ];
      }
      const caLamNV = await LichLamViec.findAll({
        where,
        include: [
          { model: db.CaLam, as: "MaCaLam_ca_lam" },
          {
            model: db.ChamCong,
            as: "cham_congs",
          },
        ],
      });
      res.status(200).json(caLamNV);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getAllCaLamByNhanVien(req, res) {
    try {
      const { MaTK } = req.params;
      const lichlamviec = await LichLamViec.findAll({
        where: {
          MaTK,
        },
        include: [
          { model: db.CaLam, as: "MaCaLam_ca_lam" },
          {
            model: LichLamViec,
            as: "MaLLVCu_lich_lam_viec",
            include: [
              { model: db.CaLam, as: "MaCaLam_ca_lam" },
            ],
          },
        ],
      });

      res.status(200).json(lichlamviec);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async dangKyCa(req, res) {
    try {
      const { MaTK, MaCaLam, NgayLam } = req.body;
      const dangKyCa = LichLamViec.create({
        MaTK,
        MaCaLam,
        TrangThai: "Chờ Xác Nhận",
        NgayLam,
      });
      res.status(200).json(dangKyCa);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async huyDangKy(req, res) {
    try {
      const lichLamViec = await LichLamViec.findByPk(req.params.MaLLV);
      if (!lichLamViec) {
        return res
          .status(404)
          .json({ message: "Không tồn tại đăng ký ca này" });
      }
      if (lichLamViec.TrangThai !== "Chờ Xác Nhận") {
        return res
          .status(400)
          .json({ message: "Chỉ hủy khi trạng thái còn chờ xác nhận" });
      }
      lichLamViec.destroy();
      res.status(200).json({ message: "Hủy đăng ký ca thành công" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async xinChuyenCa(req, res) {
    try {
      const { MaTK, MaCaLam, NgayLam, MaLLVCu } = req.body;
      const existLichLamViec = await LichLamViec.findOne({
        where: { MaTK, NgayLam, MaCaLam },
      });
      if (existLichLamViec) {
        return res.status(409).json({ message: "Trùng lịch" });
      }
      const daChamCong = await db.ChamCong.findOne({
        where: { MaLLV: MaLLVCu },
      });
      if (daChamCong) {
        return res
          .status(400)
          .json({ message: "Không thể xin chuyển ca khi đã có chấm công" });
      }
      const chuyenCa = await LichLamViec.create({
        MaTK,
        MaCaLam,
        TrangThai: "Chờ Duyệt Chuyển Ca",
        NgayLam,
        MaLLVCu,
      });
      res.status(200).json(chuyenCa);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async huyXinChuyenCa(req, res) {
    try {
      const lichLamViec = await LichLamViec.findByPk(req.params.MaLLV);
      if (!lichLamViec) {
        return res
          .status(404)
          .json({ message: "Không tồn tại đăng ký ca này" });
      }
      if (lichLamViec.TrangThai !== "Chờ Duyệt Chuyển Ca") {
        return res
          .status(400)
          .json({ message: "Chỉ hủy khi trạng thái còn chờ duyệt" });
      }
      lichLamViec.destroy();
      res.status(200).json({ message: "Hủy chuyển ca thành công" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async duyetXinChuyenCa(req, res) {
    try {
      const { MaLLV, TrangThai } = req.body;
      const lichLamViec = await LichLamViec.findByPk(MaLLV);
      if (!lichLamViec) {
        return res.status(404).json({ message: "Lịch làm việc không tồn tại" });
      }
      if (TrangThai === "Accepted") {
        const lichLamViecCu = await LichLamViec.findByPk(lichLamViec.MaLLVCu);
        if (!lichLamViecCu) {
          return res
            .status(404)
            .json({ message: "Lịch làm việc cũ không tồn tại" });
        }
        await lichLamViecCu.update({
          TrangThai: "Hủy Ca",
        });
        await lichLamViec.update({
          TrangThai: "Chuyển Ca",
        });
      } else if (TrangThai === "Denied") {
        await lichLamViec.update({
          TrangThai: "Từ chối",
        });
      }
      res.status(200).json(lichLamViec);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async create(req, res) {
    try {
      const response = await LichLamViec.create(req.body);
      res.status(201).json(response);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const { MaLLV, status } = req.body;
      const lichLamViec = await LichLamViec.findByPk(MaLLV);

      if (!lichLamViec) {
        return res.status(404).json({ message: "Ca làm không tồn tại" });
      }
      await lichLamViec.update({
        TrangThai: status,
      });
      res.status(200).json(lichLamViec);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const lichLamViec = await LichLamViec.findByPk(req.params.id, {
        include: [
          {
            model: db.ChamCong,
            as: "cham_congs",
          },
        ],
      });
      if (!lichLamViec) {
        return res.status(404).json({ message: "Lịch làm việc không tồn tại" });
      }
      if (lichLamViec.cham_congs.length > 0) {
        return res.status(400).json({
          message: "Không thể xóa Lịch làm việc khi đã có chấm công",
        });
      }
      await lichLamViec.destroy();
      res.status(200).json({ message: "Xóa đăng ký ca làm thành công" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new LichLamViecController();
