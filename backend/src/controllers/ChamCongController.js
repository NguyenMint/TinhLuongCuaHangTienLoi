const { where } = require("sequelize");
const db = require("../models");
const ChiTietBangLuongController = require("./chiTietBangLuongController");
const ChamCong = db.ChamCong;
class ChamCongController {
  async chamcong(req, res) {
    try {
      const { GioVao, GioRa, MaDKC, NgayChamCong, NgayLe } = req.body;

      const dangKyCa = await db.DangKyCa.findOne({
        where: { MaDKC },
        include: [
          { model: db.CaLam, as: "MaCaLam_ca_lam" },
          { model: db.ChamCong, as: "cham_congs" },
        ],
      });

      if (!dangKyCa) {
        return res
          .status(404)
          .json({ message: "Không tồn tại lịch đăng ký ca này" });
      }

      const { ThoiGianBatDau, ThoiGianKetThuc} =
        dangKyCa.MaCaLam_ca_lam;
      let DiTre = 0;
      let VeSom = 0;
      const [gioBatDau] = ThoiGianBatDau.split(":").map(Number);
      const [gioKetThuc] = ThoiGianKetThuc.split(":").map(Number);
      const isCaQuaNgay = gioKetThuc < gioBatDau;
      const timeToMinutes = (timeStr) => {
        const [gioVao, phutVao] = timeStr.split(":").map(Number);
        return gioVao * 60 + phutVao;
      };
      if (GioVao) {
        const vaoChuan = timeToMinutes(ThoiGianBatDau);
        const vaoThucTe = timeToMinutes(GioVao);
        if (vaoThucTe - vaoChuan > 10) {
          DiTre = vaoThucTe - vaoChuan;
        }
      }
      const isNextDay = (afterDate, beforeDate) => {
        const d1 = new Date(afterDate);
        const d2 = new Date(beforeDate);
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        const diffInDays = (d1 - d2) / (1000 * 60 * 60 * 24);
        return diffInDays === 1;
      };
      if (GioRa) {
        let raChuan = timeToMinutes(ThoiGianKetThuc);
        let raThucTe = timeToMinutes(GioRa);
        if (isCaQuaNgay) {
          raChuan += 24 * 60;
          if (isNextDay(NgayChamCong, dangKyCa.NgayDangKy)) {
            raThucTe += 24 * 60;
          }
        }
        if (raChuan - raThucTe > 10) {
          VeSom = raChuan - raThucTe;
        }
      }

      const existing = await ChamCong.findOne({ where: { MaDKC } });

      if (existing) {
        await existing.update({
          GioVao: GioVao || existing.GioVao,
          GioRa: GioRa || existing.GioRa,
          DiTre,
          VeSom,
          NgayLe,
          NgayChamCong:dangKyCa.NgayDangKy,
        });
        return res.status(200).json(existing);
      } else {
        const chamCong = await ChamCong.create({
          MaDKC,
          GioVao,
          GioRa,
          DiTre,
          VeSom,
          NgayChamCong:dangKyCa.NgayDangKy,
          NgayLe,
          trangthai: "Chờ duyệt",
        });
        return res.status(201).json(chamCong);
      }
    } catch (error) {
      console.error("ERROR:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update_chamcong(req, res) {
    try {
      const { GioVao, DiTre, GioRa, VeSom, MaChamCong } = req.body;

      const chamCongRecord = await db.ChamCong.findOne({
        where: { MaChamCong },
        include: [
          {
            model: db.DangKyCa,
            as: "MaDKC_dang_ky_ca",
          },
        ],
      });

      if (!chamCongRecord || !chamCongRecord.MaDKC_dang_ky_ca) {
        return res
          .status(404)
          .json({ message: "Không tồn tại lịch đăng ký ca này" });
      }

      await db.ChamCong.update(
        { GioVao, DiTre, GioRa, VeSom, trangthai: "Hoàn thành" },
        { where: { MaChamCong } }
      );

      const updated = await db.ChamCong.findOne({ where: { MaChamCong } });

      if (!updated) {
        return res.status(404).json({ message: "Cập nhật không thành công" });
      }

      try {
        await ChiTietBangLuongController.create({
          Ngay: updated.NgayChamCong,
          MaTK: chamCongRecord.MaDKC_dang_ky_ca.MaNS,
        });
      } catch (err) {
        console.warn("Không thể tạo bảng lương:", err.message);
      }

      return res.status(201).json(updated);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new ChamCongController();
