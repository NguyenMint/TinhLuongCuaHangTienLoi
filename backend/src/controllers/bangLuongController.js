const db = require("../models");
const BangLuong = db.BangLuong;
const ChiTietBangLuong = db.ChiTietBangLuong;
const TaiKhoan = db.TaiKhoan;
const NguoiPhuThuoc = db.NguoiPhuThuoc;
const PhuCap = db.PhuCap;
const ChamCong = db.ChamCong;
const DangKyCa = db.DangKyCa;
const { Op, where } = require("sequelize");
const {formatDate} = require("../util/util");

// Create a new salary sheet
exports.create = async (req, res) => {
  const { MaTK, Thang, Nam } = req.body;
  const startOfMonth = new Date(Nam, Thang - 1, 1);
  const endOfMonth = new Date(Nam, Thang, 0);
  const KyLuong = formatDate(startOfMonth) + " - " + formatDate(endOfMonth);
  const phuCaps = await PhuCap.findAll({
    where: {
      MaTK,
      TrangThai: true,
    },
  });
  let TongPhuCap = 0;
  phuCaps.forEach((phucap) => {
    TongPhuCap += phucap.GiaTriPhuCap;
  });
  const chiTietBangLuongs = await ChiTietBangLuong.findAll({
    where: { Ngay: { [Op.between]: [startOfMonth, endOfMonth] } },
    include: [
      {
        model: ChamCong,
        as: "cham_congs",
        required:true,
        include: [
          {
            model: DangKyCa,
            as: "MaDKC_dang_ky_ca",
            where: {
              MaNS: MaTK,
            },
          },
        ],
      },
    ],
  });
  let TongThuong = 0,
    TongPhat = 0,
    TongGioLamViec = 0,
    TongLuong = 0,
    LuongThang = 0;
  chiTietBangLuongs.forEach((chitietBL) => {
    TongThuong += parseFloat(chitietBL.TienPhuCap);
    TongPhat += parseFloat(chitietBL.TienPhat);
    TongLuong += parseFloat(chitietBL.tongtien);
    TongGioLamViec += parseInt(chitietBL.GioLamViecTrongNgay);
    LuongThang += parseFloat(chitietBL.TienLuongNgay);
  });
  const SoNguoiPhuThuoc = await NguoiPhuThuoc.count({
    where: {
      MaTK,
    },
  });
  let MucGiamTruGiaCanh = 11000000;
  if (SoNguoiPhuThuoc > 0) {
    MucGiamTruGiaCanh += SoNguoiPhuThuoc * 4400000;
  }
  const ThuNhapMienThue = LuongThang;
  let ThuNhapChiuThue = 0;
  if (LuongThang > MucGiamTruGiaCanh) {
    ThuNhapChiuThue = LuongThang - MucGiamTruGiaCanh;
  }
  let ThueSuat = 0, ThuePhaiDong = 0;
  if (ThuNhapChiuThue > 0) {
    if (ThuNhapChiuThue <= 5000000) {
      ThueSuat = 5;
    } else if (ThuNhapChiuThue <= 10000000) {
      ThueSuat = 10;
    } else if (ThuNhapChiuThue <= 18000000) {
      ThueSuat = 15;
    } else if (ThuNhapChiuThue <= 32000000) {
      ThueSuat = 20;
    } else if (ThuNhapChiuThue <= 52000000) {
      ThueSuat = 25;
    } else if (ThuNhapChiuThue <= 80000000) {
      ThueSuat = 30;
    } else {
      ThueSuat = 35;
    }
    ThuePhaiDong = ThuNhapChiuThue * (ThueSuat/100);
  }
  const LuongThucNhan = TongLuong - ThuePhaiDong;
  const bangLuong = await BangLuong.create({
    TongPhuCap,
    TongThuong,
    TongPhat,
    TongGioLamViec,
    SoNguoiPhuThuoc,
    TongLuong,
    ThuNhapMienThue,
    ThuNhapChiuThue,
    MucGiamTruGiaCanh,
    ThueSuat,
    ThuePhaiDong,
    NgayTao: new Date(),
    NgayThanhToan:null,
    LuongThucNhan,
    KyLuong,
    MaTK
  });
  res.status(200).json(bangLuong);
};

// Get all salary sheets
exports.findAll = async (req, res) => {
  try {
    const bangLuong = await BangLuong.findAll({
      include: [
        {
          model: TaiKhoan,
          as: "MaTK_tai_khoan",
          attributes: ["HoTen", "MaTK", "MaCN"],
          include: [
            {
              model: db.ChiNhanh,
              as: "MaCN_chi_nhanh",
              attributes: ["TenChiNhanh"],
            },
          ],
        },
      ],
    });

    res.status(200).json(bangLuong);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving salary sheets",
      error: error.message,
    });
  }
};

// Get salary sheet by ID
exports.findOne = async (req, res) => {
  try {
    const bangLuong = await BangLuong.findByPk(req.params.id, {
      include: [
        {
          model: TaiKhoan,
          as: "MaTK_tai_khoan",
          attributes: ["HoTen", "MaTK"],
        },
        {
          model: ChiTietBangLuong,
          as: "chi_tiet_bang_luongs",
        },
      ],
    });

    if (!bangLuong) {
      return res.status(404).json({
        success: false,
        message: "Salary sheet not found",
      });
    }

    res.status(200).json({
      success: true,
      data: bangLuong,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving salary sheet",
      error: error.message,
    });
  }
};

// Update salary sheet
exports.update = async (req, res) => {
  try {
    const bangLuong = await BangLuong.findByPk(req.params.id);

    if (!bangLuong) {
      return res.status(404).json({
        success: false,
        message: "Salary sheet not found",
      });
    }

    await bangLuong.update(req.body);

    res.status(200).json({
      success: true,
      message: "Salary sheet updated successfully",
      data: bangLuong,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating salary sheet",
      error: error.message,
    });
  }
};

// Delete salary sheet
exports.delete = async (req, res) => {
  try {
    const bangLuong = await BangLuong.findByPk(req.params.id);

    if (!bangLuong) {
      return res.status(404).json({
        success: false,
        message: "Salary sheet not found",
      });
    }

    await bangLuong.destroy();

    res.status(200).json({
      success: true,
      message: "Salary sheet deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting salary sheet",
      error: error.message,
    });
  }
};




