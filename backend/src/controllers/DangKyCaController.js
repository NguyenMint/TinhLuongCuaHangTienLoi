const db = require("../models");
const DangKyCa = db.DangKyCa;
const { Op, where } = require("sequelize");
class DangKyCaController {
  async getAll(req, res) {
    try {
      const DangKyCas = await DangKyCa.findAll({
        include: [
          { model: db.ChamCong, as: "cham_congs" },
          { model: db.CaLam, as: "MaCaLam_ca_lam" },
          {
            model: db.TaiKhoan,
            as: "MaNS_tai_khoan",
            attributes: ["MaTK", "HoTen"],
            include: [
              {
                model: db.KhenThuongKyLuat,
                as: "khen_thuong_ky_luats",
                where: db.sequelize.where(
                  db.sequelize.col(
                    "MaNS_tai_khoan.khen_thuong_ky_luats.NgayApDung"
                  ),
                  "=",
                  db.sequelize.col("DangKyCa.NgayDangKy")
                ),

                required: false,
              },
            ],
          },
        ],
      });
      res.status(200).json(DangKyCas);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getById(req, res) {
    try {
      const dangKyCa = await DangKyCa.findByPk(req.params.id);
      if (!dangKyCa) {
        return res.status(404).json({ message: "Ca làm không tồn tại" });
      }
      res.status(200).json(dangKyCa);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getCaLamByNhanVien(req, res) {
    try {
      const { MaTK } = req.params;
      const { NgayDangKy } = req.query;
      const where = {
        MaNS: MaTK,
        TrangThai: { [Op.in]: ["Đã Đăng Ký", "Chuyển Ca"] },
      };
      if (NgayDangKy) {
        // Lấy ngày hôm trước
        const prevDate = new Date(NgayDangKy);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevDateStr = prevDate.toISOString().slice(0, 10);
        where[Op.or] = [
          { NgayDangKy: NgayDangKy },
          {
            NgayDangKy: prevDateStr,
            // Điều kiện ca qua đêm: giờ kết thúc < giờ bắt đầu
            "$MaCaLam_ca_lam.ThoiGianKetThuc$": {
              [Op.lt]: db.sequelize.col("MaCaLam_ca_lam.ThoiGianBatDau"),
            },
          },
        ];
      }
      const caLam = await DangKyCa.findAll({
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
      console.log("Creating DangKyCa with data: ", req.body);
      const response = await DangKyCa.create(req.body);
      res.status(201).json(response);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      //add check DangKyCa
      const DangKyCa = await DangKyCa.findByPk(req.params.id);
      if (!DangKyCa) {
        return res.status(404).json({ message: "Ca làm không tồn tại" });
      }
      await DangKyCa.update(req.body);
      res.status(200).json(DangKyCa);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const dangKyCa = await DangKyCa.findByPk(req.params.id, {
        include: [
          {
            model: db.ChamCong,
            as: "cham_congs",
          },
        ],
      });
      if (!dangKyCa) {
        return res
          .status(404)
          .json({ message: "Đăng ký ca làm không tồn tại" });
      }
      if (dangKyCa.cham_congs.length > 0) {
        return res.status(400).json({
          message: "Không thể xóa đăng ký ca làm khi đã có chấm công",
        });
      }
      await dangKyCa.destroy();
      res.status(200).json({ message: "Xóa đăng ký ca làm thành công" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new DangKyCaController();
