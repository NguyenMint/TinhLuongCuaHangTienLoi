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
const chiTietBangLuong = require("../models/chiTietBangLuong");
// Create a new salary detail
exports.create = async (req, res) => {
  try {
    const { MaChamCong } = req.body;

    const chamCong = await ChamCong.findByPk(MaChamCong, {
      include: [
        {
          model: db.LichLamViec,
          as: "MaLLV_lich_lam_viec",
          include: [
            {
              model: db.CaLam,
              as: "MaCaLam_ca_lam",
            },
          ],
        },
      ],
    });
    if (!chamCong) {
      return res.status(404).json({ message: "Mã chấm công không tồn tại" });
    }
    let isNgayLe = false,
      isCuoiTuan = false,
      isCaDem = false;
    if (chamCong.MaLLV_lich_lam_viec.MaCaLam_ca_lam.isCaDem) {
      isCaDem = true;
    }
    let heSoPhuCapNgayLe =null, heSoPhuCapCuoiTuan =null, heSoNgayThuongCaDem = null;
    if (isCaDem) {
      heSoPhuCapNgayLe = await HeSoPhuCap.findOne({
        where: {
          Ngay: chamCong.NgayChamCong,
          isCaDem: 1,
          LoaiNgay: "Ngày lễ",
        },
      });
      heSoPhuCapCuoiTuan = await HeSoPhuCap.findOne({
        where: {
          isCaDem: 1,
          LoaiNgay: "Cuối tuần",
        },
      });
      heSoNgayThuongCaDem = await HeSoPhuCap.findOne({
        where:{
          isCaDem:1,
          LoaiNgay:"Ngày thường"
        }
      });
    } else {
      heSoPhuCapNgayLe = await HeSoPhuCap.findOne({
        where: {
          Ngay: chamCong.NgayChamCong,
          isCaDem: 0,
          LoaiNgay: "Ngày lễ",
        },
      });
      heSoPhuCapCuoiTuan = await HeSoPhuCap.findOne({
        where: {
          isCaDem: 0,
          LoaiNgay: "Cuối tuần",
        },
      });
    }
    const taiKhoan = await TaiKhoan.findByPk(chamCong.MaLLV_lich_lam_viec.MaTK);
    if (!taiKhoan) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }
    let GioLamViec = 0,
      LuongMotGio = 0,
      TienLuongNgay = 0,
      HeSoLuong = 1.0;
    if (heSoPhuCapNgayLe) {
      HeSoLuong = heSoPhuCapNgayLe.HeSoLuong;
      isNgayLe = true;
      if (isWeekend(chamCong.NgayChamCong)) {
        isCuoiTuan = true;
      }
    } else if (heSoPhuCapCuoiTuan && isWeekend(chamCong.NgayChamCong)) {
      isCuoiTuan = true;
      HeSoLuong = heSoPhuCapCuoiTuan.HeSoLuong;
    }
    else if(isCaDem){
      HeSoLuong = heSoNgayThuongCaDem.HeSoLuong;
    }
    GioLamViec = tinhTongGioLamCaLam(
      chamCong.MaLLV_lich_lam_viec.MaCaLam_ca_lam.ThoiGianBatDau,
      chamCong.MaLLV_lich_lam_viec.MaCaLam_ca_lam.ThoiGianKetThuc
    );
    LuongMotGio = taiKhoan.LuongTheoGioHienTai;
    TienLuongNgay = LuongMotGio * GioLamViec * HeSoLuong;
    const khenThuongs = await KhenThuongKyLuat.findAll({
      where: { MaLLV: chamCong.MaLLV, ThuongPhat: true },
    });
    let TienPhuCap = 0;
    khenThuongs.forEach((khen) => {
      TienPhuCap += khen.MucThuongPhat;
    });
    const kyLuats = await KhenThuongKyLuat.findAll({
      where: {MaLLV: chamCong.MaLLV, ThuongPhat: false },
    });
    let TienPhat = 0;
    kyLuats.forEach((khen) => {
      TienPhat += khen.MucThuongPhat;
    });
    const tongtien =
      parseFloat(TienLuongNgay) + parseFloat(TienPhuCap) - parseFloat(TienPhat);
    let chiTietBangLuong = [];
    if (chamCong.MaCTBL === null) {
      chiTietBangLuong = await ChiTietBangLuong.create({
        GioLamViec,
        TienLuongNgay,
        LuongMotGio,
        HeSoLuong,
        isCuoiTuan,
        isNgayLe,
        isCaDem,
        TienPhat,
        TienPhuCap,
        LoaiPhuCap: "",
        tongtien,
        Ngay: chamCong.NgayChamCong,
        MaBangLuong: null,
      });
      await chamCong.update({ MaCTBL: chiTietBangLuong.MaCTBL });
    } else {
      chiTietBangLuong = await ChiTietBangLuong.findByPk(chamCong.MaCTBL);
      chiTietBangLuong.update({
        GioLamViec,
        TienLuongNgay,
        LuongMotGio,
        HeSoLuong,
        isCuoiTuan,
        isNgayLe,
        isCaDem,
        TienPhat,
        TienPhuCap,
        LoaiPhuCap: "",
        tongtien,
        Ngay: chamCong.NgayChamCong,
        MaBangLuong: null,
      });
    }
    return res.status(200).json(chiTietBangLuong);
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

    // Get LichLamViec records for the given date and employee
    const lichLamViecs = await LichLamViec.findAll({
      where: {
        MaTK,
        NgayLam: Ngay,
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
