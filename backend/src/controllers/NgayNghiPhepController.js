const { Where } = require("sequelize/lib/utils");
const db = require("../models");
const NgayNghiPhep = db.NgayNghiPhep;
const TaiKhoan = db.TaiKhoan;
const LichLamViec = db.LichLamViec;
const ChamCong = db.ChamCong;
const CaLam = db.CaLam;
const chiTietBangLuongController = require("../controllers/chiTietBangLuongController");
class NgayNghiPhepController {
  async xinNghiPhep(req, res) {
    try {
      const { MaTK, NgayBatDau, NgayKetThuc } = req.body;
      const taiKhoan = await TaiKhoan.findByPk(MaTK);
      if (!taiKhoan) {
        return res.status(404).json({ message: "Không tồn tại tài khoản này" });
      }
      const startDate = new Date(NgayBatDau);
      const endDate = new Date(NgayKetThuc);
      const SoNgayNghi =
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      if (SoNgayNghi > taiKhoan.SoNgayChuaNghi) {
        return res
          .status(400)
          .json({ message: "Số ngày nghĩ vượt quá mức cho phép" });
      }
      const nghiPhep = await NgayNghiPhep.create({
        MaTK,
        NgayBatDau,
        NgayKetThuc,
        SoNgayNghi,
        NgayDangKy: new Date(),
        TrangThai: "Chờ duyệt",
      });
      res.status(201).json(nghiPhep);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getDonXinChoDuyet(req, res) {
    try {
      const donXinNghi = await NgayNghiPhep.findAll({
        where: {
          TrangThai: "Chờ duyệt",
        },
        include:[
          {
            model: TaiKhoan,
            as: "MaTK_tai_khoan",
            attributes:["MaNhanVien","HoTen"]
          }
        ]
      });
      res.status(200).json(donXinNghi);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async duyetDon(req, res) {
    try {
      const { MaNNP } = req.params;
      const { TrangThai } = req.body;
      const nghiPhep = await NgayNghiPhep.findByPk(MaNNP);
      if (!nghiPhep) {
        return res.status(404).json({ message: "Không tồn tại nghĩ phép này" });
      }
      await nghiPhep.update({
        TrangThai,
      });
      const taiKhoan = await TaiKhoan.findByPk(nghiPhep.MaTK);
      if (TrangThai === "Đã duyệt") {
        const startDate = new Date(nghiPhep.NgayBatDau);
        const endDate = new Date(nghiPhep.NgayKetThuc);
        const caLam = await CaLam.findOne({
          order: [["MaCa", "ASC"]],
        });
        if (!caLam) {
          return res
            .status(400)
            .json({ message: "Không tìm thấy thông tin ca làm" });
        }
        for (
          let currentDate = new Date(startDate);
          currentDate <= endDate;
          currentDate.setDate(currentDate.getDate() + 1)
        ) {
          const lichLamViec = await LichLamViec.create({
            MaTK: nghiPhep.MaTK,
            MaCaLam: caLam.MaCa,
            NgayLam: currentDate,
            TrangThai: "Đã Đăng Ký",
          });
          const chamCong = await ChamCong.create({
            NgayChamCong: currentDate,
            GioVao: caLam.ThoiGianBatDau,
            GioRa: caLam.ThoiGianKetThuc,
            DiTre: 0,
            VeSom: 0,
            MaLLV: lichLamViec.MaLLV,
            trangthai: "Hoàn thành",
          });
          await chiTietBangLuongController.createSalaryDetail({
            MaChamCong: chamCong.MaChamCong,
          });
          const soNgayConLai = taiKhoan.SoNgayChuaNghi - nghiPhep.SoNgayNghi;
          await taiKhoan.update({
            SoNgayChuaNghi: soNgayConLai,
          });
        }
      }
      res.status(200).json(nghiPhep);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getDonXinNghiByNV(req,res){
    try {
      const {MaTK} = req.params;
      const donXinNghi = await NgayNghiPhep.findAll({
        where: {
          MaTK:MaTK
        },
      });
      res.status(200).json(donXinNghi);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
module.exports = new NgayNghiPhepController();
