const db = require("../models");
const ChiTietBangLuong = db.ChiTietBangLuong;
const BangLuong = db.BangLuong;
const ChamCong = db.ChamCong;
const TaiKhoan = db.TaiKhoan;
const ThangLuong = db.ThangLuong;
const KhenThuongKyLuat = db.KhenThuongKyLuat;
const LichLamViec = db.LichLamViec;
const CaLam = db.CaLam;
const HeSoPhuCap = db.HeSoPhuCap;
const { Op, where } = require("sequelize");
const {
  getSoNgayTrongThang,
  tinhTongGioLamCaLam,
  isWeekend,
} = require("../util/util");
// Create a new salary detail
exports.create = async (req, res) => {
  try {
    const { Ngay, MaTK } = req;

    const chamCongList = await ChamCong.findAll({
      where: {
        NgayChamCong: Ngay,
        TrangThai: "Hoàn thành",
      },
      include: [
        {
          model: db.LichLamViec,
          as: "MaLLV_lich_lam_viec",
          where: { MaNS: MaTK },
          include: [
            {
              model: db.CaLam,
              as: "MaCaLam_ca_lam",
            },
          ],
        },
      ],
    });
    const heSoPhuCapNgayLe = await HeSoPhuCap.findOne({
      where: {
        Ngay,
      },
    });
    const heSoPhuCapCuoiTuan = await HeSoPhuCap.findOne({
      where: {
        LoaiNgay: "Cuối tuần",
      },
    });
    const taiKhoan = await TaiKhoan.findByPk(MaTK);
    const thangluong = await ThangLuong.findOne({
      where: {
        BacLuong: taiKhoan.BacLuong,
        LuongCoBan: taiKhoan.LuongCoBanHienTai,
        LoaiNV: "FullTime",
      },
    });
    const soNgayPhep = thangluong ? thangluong.SoNgayPhep : 0;
    const luongOneHour =
      taiKhoan.LuongCoBanHienTai / (getSoNgayTrongThang(Ngay) - soNgayPhep) / 8;
    let GioLamViecTrongNgay = 0,
      TienLuongNgay = 0,
      heSoNgay = 1.0;
    if (heSoPhuCapNgayLe) {
      heSoNgay = parseFloat(heSoPhuCapNgayLe.HeSoLuong);
    } else if (heSoPhuCapCuoiTuan && isWeekend(Ngay)) {
      heSoNgay = parseFloat(heSoPhuCapCuoiTuan.HeSoLuong);
    }
    chamCongList.forEach((record) => {
      const gioLam = tinhTongGioLamCaLam(
        record.MaLLV_lich_lam_viec.MaCaLam_ca_lam.ThoiGianBatDau,
        record.MaLLV_lich_lam_viec.MaCaLam_ca_lam.ThoiGianKetThuc
      );
      GioLamViecTrongNgay += gioLam;
      const tienLuongCa =
        gioLam *
        luongOneHour *
        parseFloat(record.MaLLV_lich_lam_viec.MaCaLam_ca_lam.HeSoLuong) *
        heSoNgay;
      TienLuongNgay += tienLuongCa;
    });
    const khenThuongs = await KhenThuongKyLuat.findAll({
      where: { MaTK, NgayApDung: Ngay, ThuongPhat: true },
    });
    let TienPhuCap = 0;
    khenThuongs.forEach((khen) => {
      TienPhuCap += khen.MucThuongPhat;
    });
    const kyLuats = await KhenThuongKyLuat.findAll({
      where: { MaTK, NgayApDung: Ngay, ThuongPhat: false },
    });
    let TienPhat = 0;
    kyLuats.forEach((khen) => {
      TienPhat += khen.MucThuongPhat;
    });
    const tongtien =
      parseFloat(TienLuongNgay) + parseFloat(TienPhuCap) - parseFloat(TienPhat);
    const chamCongDaCoChiTietBL = await ChamCong.findOne({
      where: {
        NgayChamCong: Ngay,
        MaCTBL: { [Op.ne]: null },
      },
      include: [
        {
          model: db.LichLamViec,
          as: "MaLLV_lich_lam_viec",
          where: {
            MaNS: MaTK,
          },
        },
      ],
    });
    if (chamCongDaCoChiTietBL) {
      const chiTietBangLuong = await ChiTietBangLuong.findByPk(
        chamCongDaCoChiTietBL.MaCTBL
      );
      await chiTietBangLuong.update({
        GioLamViecTrongNgay,
        TienLuongNgay,
        TienPhat,
        TienPhuCap,
        tongtien,
      });
      for (const chamCong of chamCongList) {
        await chamCong.update({ MaCTBL: chiTietBangLuong.MaCTBL });
      }
      return chiTietBangLuong;
    }
    const chiTietBangLuong = await ChiTietBangLuong.create({
      GioLamViecTrongNgay,
      TienLuongNgay,
      TienPhat,
      TienPhuCap,
      LoaiPhuCap: "",
      tongtien,
      Ngay,
      MaBangLuong: null,
    });
    for (const chamCong of chamCongList) {
      await chamCong.update({ MaCTBL: chiTietBangLuong.MaCTBL });
    }
    return chiTietBangLuong;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating salary detail",
      error: error.message,
    });
  }
};
exports.getByNhanVienAndNgay = async (req, res) => {
  try {
    const { Ngay, MaTK } = req.query;
    const chiTietBangLuong = await ChiTietBangLuong.findOne({
      where: {
        Ngay,
      },
      include: [
        {
          model: ChamCong,
          as: "cham_congs",
          include: [
            {
              model: LichLamViec,
              as: "MaLLV_lich_lam_viec",
              where: {
               MaTK,
              },
              include: [
                {
                  model: CaLam,
                  as: "MaCaLam_ca_lam",
                },
              ],
            },
          ],
        },
      ],
    });
    const khenThuongKyLuats = await KhenThuongKyLuat.findAll({
      where: {
        MaTK,
        NgayApDung: Ngay,
      },
    });
    res.status(200).json({ chiTietBangLuong, khenThuongKyLuats });
  } catch (error) {
    console.log("ERROR: " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get all salary details
exports.findAll = async (req, res) => {
  try {
    const chiTietBangLuong = await ChiTietBangLuong.findAll({
      include: [
        {
          model: BangLuong,
          as: "MaBangLuong_bang_luong",
          include: [
            {
              model: TaiKhoan,
              as: "MaTK_tai_khoan",
              attributes: ["HoTen", "MaTK"],
            },
          ],
        },
      ],
    });

    res.status(200).json(chiTietBangLuong);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving salary details",
      error: error.message,
    });
  }
};
// Get salary detail by ID
exports.findOne = async (req, res) => {
  try {
    const chiTietBangLuong = await ChiTietBangLuong.findByPk(req.params.id, {
      include: [
        {
          model: BangLuong,
          as: "MaBangLuong_bang_luong",
          include: [
            {
              model: TaiKhoan,
              as: "MaTK_tai_khoan",
              attributes: ["HoTen", "MaTK"],
            },
          ],
        },
        {
          model: ChamCong,
          as: "cham_congs",
        },
      ],
    });

    if (!chiTietBangLuong) {
      return res.status(404).json({
        success: false,
        message: "Salary detail not found",
      });
    }

    res.status(200).json({
      success: true,
      data: chiTietBangLuong,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving salary detail",
      error: error.message,
    });
  }
};

// Update salary detail
exports.update = async (req, res) => {
  try {
    const chiTietBangLuong = await ChiTietBangLuong.findByPk(req.params.id);

    if (!chiTietBangLuong) {
      return res.status(404).json({
        success: false,
        message: "Salary detail not found",
      });
    }

    await chiTietBangLuong.update(req.body);

    res.status(200).json({
      success: true,
      message: "Salary detail updated successfully",
      data: chiTietBangLuong,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating salary detail",
      error: error.message,
    });
  }
};

// Delete salary detail
exports.delete = async (req, res) => {
  try {
    const chiTietBangLuong = await ChiTietBangLuong.findByPk(req.params.id);

    if (!chiTietBangLuong) {
      return res.status(404).json({
        success: false,
        message: "Salary detail not found",
      });
    }

    await chiTietBangLuong.destroy();

    res.status(200).json({
      success: true,
      message: "Salary detail deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting salary detail",
      error: error.message,
    });
  }
};
