const db = require("../models");
const ChiTietBangLuong = db.ChiTietBangLuong;
const BangLuong = db.BangLuong;
const ChamCong = db.ChamCong;
const TaiKhoan = db.TaiKhoan;
const { Op } = require("sequelize");

// Create a new salary detail
exports.create = async (req, res) => {
  try {
    // const {
    //   MaBangLuong,
    //   GioLamViecTrongNgay,
    //   TienLuongNgay,
    //   TienPhat,
    //   TienPhuCap,
    //   LoaiPhuCap,
    //   tongtien,
    // } = req.body;

    console.log(req.body); 


    // const chiTietBangLuong = await ChiTietBangLuong.create({
    //   MaBangLuong,
    //   GioLamViecTrongNgay,
    //   TienLuongNgay,
    //   TienPhat,
    //   TienPhuCap,
    //   LoaiPhuCap,
    //   tongtien
    // });

    res.status(201).json({
      success: true,
      message: "Salary detail created successfully",
      // data: chiTietBangLuong,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating salary detail",
      error: error.message,
    });
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

exports.calculateDailySalary = async (req, res) => {
  try {
    // const { MaBangLuong, NgayChamCong } = req.body;

    // // Get salary sheet
    // const bangLuong = await BangLuong.findByPk(MaBangLuong, {
    //   include: [
    //     {
    //       model: TaiKhoan,
    //       as: "MaTK_tai_khoan",
    //     },
    //   ],
    // });

    // if (!bangLuong) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Salary sheet not found",
    //   });
    // }

    // Get attendance records for the day
    const chamCong = await ChamCong.findOne({
      where: {
        MaCTBL: null,
        NgayChamCong,
        MaDKC: {
          [Op.in]: db.sequelize.literal(`(
            SELECT MaDKC 
            FROM dang_ky_ca 
            WHERE MaNS = ${bangLuong.MaTK}
          )`),
        },
      },
    });

    if (!chamCong) {
      return res.status(404).json({
        success: false,
        message: "No attendance record found for this day",
      });
    }

    // Calculate working hours
    const gioVao = new Date(chamCong.GioVao);
    const gioRa = new Date(chamCong.GioRa);
    const gioLamViec = (gioRa - gioVao) / (1000 * 60 * 60); // Convert to hours

    // Calculate daily salary based on working hours
    const luongTheoGio = bangLuong.MaTK_tai_khoan.LuongCoBanHienTai / 176; // Assuming 176 working hours per month
    const tienLuongNgay = luongTheoGio * gioLamViec;

    // Calculate penalties for late arrival and early departure
    const tienPhat =
      (chamCong.DiTre || 0) * 50000 + (chamCong.VeSom || 0) * 50000;

    // Calculate allowances
    const tienPhuCap = 0; // This should be calculated based on allowances for the day
    const loaiPhuCap = ""; // This should be determined based on the type of allowance

    // Calculate total
    const tongtien = tienLuongNgay + tienPhuCap - tienPhat;

    const chiTietBangLuong = {
      MaBangLuong,
      GioLamViecTrongNgay: gioLamViec,
      TienLuongNgay: tienLuongNgay,
      TienPhat: tienPhat,
      TienPhuCap: tienPhuCap,
      LoaiPhuCap: loaiPhuCap,
      tongtien,
    };

    res.status(200).json({
      success: true,
      data: chiTietBangLuong,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error calculating daily salary",
      error: error.message,
    });
  }
};
