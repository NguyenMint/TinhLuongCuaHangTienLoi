const { where } = require("sequelize");
const db = require("../models");
const ChamCong = db.ChamCong;
class ChamCongController {
  async chamcong(req, res) {
    try {
      const { GioVao, GioRa, MaDKC } = req.body;
      const dangKyCa = await db.DangKyCa.findOne({
        where: { MaDKC },
        include: [
          {
            model: db.CaLam,
            as: "MaCaLam_ca_lam",
          },
          {
            model: db.ChamCong,
            as: "cham_congs",
          },
        ],
      });
      if (!dangKyCa) {
        return res
          .status(404)
          .json({ message: "Không tồn tại lịch đăng ký ca này" });
      }
      if (GioRa && dangKyCa.cham_congs.length > 0) {
        const GioRaChuan = dangKyCa.MaCaLam_ca_lam.ThoiGianKetThuc;
        const [gioRaChuan, phutRaChuan] = GioRaChuan.split(":").map(Number);
        const [gioRaThucTe, phutRaThucTe] = GioRa.split(":").map(Number);
        const raChuan = gioRaChuan * 60 + phutRaChuan;
        const raThucTe = gioRaThucTe * 60 + phutRaThucTe;
        let VeSom = 0;
        if (raChuan - raThucTe > 10) {
          VeSom = raChuan - raThucTe;
        }
        const chamCong = await ChamCong.findOne({ where: { MaDKC } });
        if (chamCong) {
          await chamCong.update({
            GioRa,
            VeSom,
          });
        }
        return res.status(200).json(chamCong);
      }
      const GioVaoChuan = dangKyCa.MaCaLam_ca_lam.ThoiGianBatDau;
      const [gioVaoChuan, phutVaoChuan] = GioVaoChuan.split(":").map(Number);
      const [gioVaoThucTe, phutVaoThucTe] = GioVao.split(":").map(Number);
      const vaoChuan = gioVaoChuan * 60 + phutVaoChuan;
      const vaoThucTe = gioVaoThucTe * 60 + phutVaoThucTe;
      let DiTre = 0;
      if (vaoThucTe - vaoChuan > 10) {
        DiTre = vaoThucTe - vaoChuan;
      }
      const chamCong = await ChamCong.create({
        ...req.body,
        DiTre,
        trangthai: "Chờ duyệt",
      });
      return res.status(201).json(chamCong);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
module.exports = new ChamCongController();
