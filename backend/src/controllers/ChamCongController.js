const { where } = require("sequelize");
const db = require("../models");
const { createSalaryDetail } = require("./chiTietBangLuongController");
const ChamCong = db.ChamCong;
const { NghiThaiSan } = db;
const { sendMail, formatDate } = require("../util/util");
class ChamCongController {
  async chamcong(req, res) {
    try {
      const { GioVao, GioRa, MaLLV, NgayChamCong } = req.body;

      const lichLamViec = await db.LichLamViec.findOne({
        where: { MaLLV },
        include: [
          { model: db.CaLam, as: "MaCaLam_ca_lam" },
          { model: db.ChamCong, as: "cham_congs" },
        ],
      });

      if (!lichLamViec) {
        return res
          .status(404)
          .json({ message: "Không tồn tại lịch đăng ký ca này" });
      }

      const { ThoiGianBatDau, ThoiGianKetThuc } = lichLamViec.MaCaLam_ca_lam;
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
          if (isNextDay(NgayChamCong, lichLamViec.NgayLam)) {
            raThucTe += 24 * 60;
          }
        }
        // Kiểm tra quyền lợi thai sản
        const nts = await NghiThaiSan.findOne({
          where: {
            MaTK: lichLamViec.MaTK,
            TrangThai: ["Đang nghĩ", "Đã duyệt"],
            NgayBatDau: { [db.Sequelize.Op.lte]: NgayChamCong },
            NgayKetThuc: { [db.Sequelize.Op.gte]: NgayChamCong },
          },
        });
        if (nts) {
          VeSom = 0;
          if (raChuan - raThucTe > 30) {
            VeSom = raChuan - raThucTe - 30;
          }
        } else if (raChuan - raThucTe > 10) {
          VeSom = raChuan - raThucTe;
        }
      }
      const existing = await ChamCong.findOne({ where: { MaLLV } });
      if (existing) {
        await existing.update({
          GioRa: GioRa || existing.GioRa,
          VeSom,
          NgayChamCong: lichLamViec.NgayLam,
        });
        return res.status(200).json(existing);
      } else {
        const chamCong = await ChamCong.create({
          MaLLV,
          GioVao,
          GioRa,
          DiTre,
          VeSom,
          NgayChamCong: lichLamViec.NgayLam,
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
      const { GioVao, DiTre, GioRa, VeSom, MaChamCong, NgayLam, MaLLV } =
        req.body;
      const NgayChamCong = NgayLam;
      let updatedRecord = null;
      let chamCongRecord = null;

      if (!!MaChamCong) {
        chamCongRecord = await db.ChamCong.findOne({
          where: { MaChamCong },
          include: [
            {
              model: db.LichLamViec,
              as: "MaLLV_lich_lam_viec",
            },
          ],
        });

        if (!chamCongRecord || !chamCongRecord.MaLLV_lich_lam_viec) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy bản ghi chấm công" });
        }

        await db.ChamCong.update(
          { GioVao, DiTre, GioRa, VeSom, trangthai: "Hoàn thành" },
          { where: { MaChamCong } }
        );
        updatedRecord = await db.ChamCong.findOne({ where: { MaChamCong } });

        if (!updatedRecord) {
          return res.status(404).json({ message: "Cập nhật không thành công" });
        }
      } else {
        updatedRecord = await ChamCong.create({
          MaLLV,
          GioVao,
          GioRa,
          DiTre,
          VeSom,
          NgayChamCong,
          trangthai: "Hoàn thành",
        });
        if (!updatedRecord) {
          return res
            .status(500)
            .json({ message: "Tạo bản ghi chấm công mới thất bại" });
        }
        chamCongRecord = await db.ChamCong.findOne({
          where: { MaChamCong: updatedRecord.MaChamCong },
          include: [
            {
              model: db.LichLamViec,
              as: "MaLLV_lich_lam_viec",
            },
          ],
        });
      }

      try {
        await createSalaryDetail({
          MaChamCong: chamCongRecord.MaChamCong,
        });
      } catch (err) {
        console.warn("Không thể tạo bảng lương:", err.message);
      }

      try {
        const lichLamViec = chamCongRecord.MaLLV_lich_lam_viec;
        if (lichLamViec) {
          const taiKhoan = await db.TaiKhoan.findByPk(lichLamViec.MaTK);
          const ncc = formatDate(new Date(NgayChamCong));
          if (taiKhoan && taiKhoan.Email) {
            await sendMail({
              to: taiKhoan.Email,
              subject: "Thông báo chấm công",
              text: `Xin chào ${
                taiKhoan.HoTen || "bạn"
              },\n\nChấm công ngày ${ncc} của bạn đã được duyệt và hoàn tất.\n\nBạn có thể đăng nhập vào hệ thống để kiểm tra chi tiết lịch làm việc, thời gian vào/ra, hoặc khiếu nại nếu có sai sót.\n\nTrân trọng,\nPhòng nhân sự`,
              html: `
    <p>Xin chào <b>${taiKhoan.HoTen || "bạn"}</b>,</p>
    <p>Chấm công ngày <b>${ncc}</b> của bạn đã được duyệt và hoàn tất.</p>
    <p>Bạn có thể đăng nhập vào hệ thống để:</p>
    <ul>
      <li>Xem chi tiết lịch làm việc</li>
      <li>Kiểm tra thời gian vào/ra</li>
      <li>Gửi khiếu nại nếu phát hiện sai sót</li>
    </ul>
    <p><a href="http://localhost:3000/login" target="_blank">Nhấn vào đây để đăng nhập</a></p>
    <p>Trân trọng,<br/>Phòng nhân sự</p>`,
            });
          }
        }
      } catch (err) {
        console.warn("Không thể gửi email thông báo:", err.message);
      }

      return res.status(201).json(updatedRecord);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new ChamCongController();
