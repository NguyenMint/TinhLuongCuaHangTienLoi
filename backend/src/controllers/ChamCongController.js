const { where } = require("sequelize");
const db = require("../models");
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
        return res.status(404).json({ message: "Không tồn tại lịch đăng ký ca này" });
      }
  
      const { ThoiGianBatDau, ThoiGianKetThuc } = dangKyCa.MaCaLam_ca_lam;
      let DiTre = 0;
      let VeSom = 0;
  
      // Tính đi trễ nếu có GioVao
      if (GioVao) {
        const [gioVaoChuan, phutVaoChuan] = ThoiGianBatDau.split(":").map(Number);
        const [gioVaoThucTe, phutVaoThucTe] = GioVao.split(":").map(Number);
        const vaoChuan = gioVaoChuan * 60 + phutVaoChuan;
        const vaoThucTe = gioVaoThucTe * 60 + phutVaoThucTe;
        if (vaoThucTe - vaoChuan > 10) {
          DiTre = vaoThucTe - vaoChuan;
        }
      }
  
      // Tính về sớm nếu có GioRa
      if (GioRa) {
        const [gioRaChuan, phutRaChuan] = ThoiGianKetThuc.split(":").map(Number);
        const [gioRaThucTe, phutRaThucTe] = GioRa.split(":").map(Number);
        const raChuan = gioRaChuan * 60 + phutRaChuan;
        const raThucTe = gioRaThucTe * 60 + phutRaThucTe;
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
          NgayChamCong
        });
        return res.status(200).json(existing);
      } else {
        const chamCong = await ChamCong.create({
          MaDKC,
          GioVao,
          GioRa,
          DiTre,
          VeSom,
          NgayChamCong,
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

      const dangKyCa = await db.ChamCong.findOne({
        where: { MaChamCong },
      });

      if (!dangKyCa) {
        return res
          .status(404)
          .json({ message: "Không tồn tại lịch đăng ký ca này" });
      }

      const chamCong = await ChamCong.update(
        {
          GioVao,
          DiTre,
          GioRa,
          VeSom,
          trangthai: "Hoàn thoành",
        },
        {
          where: { MaChamCong },
        }
      );

      const updatedChamCong = await db.ChamCong.findOne({
        where: { MaChamCong },
      });

      if (!updatedChamCong) {
        return res.status(404).json({ message: "Cập nhật không thành công" });
      }

      return res.status(201).json(updatedChamCong);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new ChamCongController();
