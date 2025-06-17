const db = require("../models");
const LichLamViec = db.LichLamViec;
const { Op, where } = require("sequelize");
class LichLamViecController {
  async getAll(req, res) {
    try {
      const LichLamViecs = await LichLamViec.findAll({
        include: [
          { model: db.ChamCong, as: "cham_congs" },
          { model: db.CaLam, as: "MaCaLam_ca_lam" },
          {
            model: db.TaiKhoan,
            as: "MaTK_tai_khoan",
            attributes: ["MaTK", "HoTen", "MaCN", "MaNhanVien"],
          },
          {
            model:db.KhenThuongKyLuat,
            as:"khen_thuong_ky_luats"
          }
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
        // Lấy ngày hôm trước
        const prevDate = new Date(NgayLam);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevDateStr = prevDate.toISOString().slice(0, 10);
        where[Op.or] = [
          { NgayLam: NgayLam },
          {
            NgayLam: prevDateStr,
            // Điều kiện ca qua đêm: giờ kết thúc < giờ bắt đầu
            "$MaCaLam_ca_lam.ThoiGianKetThuc$": {
              [Op.lt]: db.sequelize.col("MaCaLam_ca_lam.ThoiGianBatDau"),
            },
          },
        ];
      }
      const caLam = await LichLamViec.findAll({
        where,
        include: [
          { model: db.CaLam, as: "MaCaLam_ca_lam" },
          {
            model: db.ChamCong,
            as: "cham_congs",
          },
        ],
      });
      res.status(200).json(caLam);
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
