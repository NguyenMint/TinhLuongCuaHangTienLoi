const db = require("../models");
const BangLuong = db.BangLuong;
const ChiTietBangLuong = db.ChiTietBangLuong;
const TaiKhoan = db.TaiKhoan;
const NguoiPhuThuoc = db.NguoiPhuThuoc;
const KhenThuongKyLuat = db.KhenThuongKyLuat;
const PhuCap = db.PhuCap;
const { Op } = require("sequelize");

// Create a new salary sheet
exports.create = async (req, res) => {
  try {
    const {
      MaTK,
      KyLuong,
      NgayTao,
      NgayThanhToan,
      TongGioLamViec,
      TongPhuCap,
      TongThuong,
      TongPhat,
      SoNguoiPhuThuoc,
      TongLuong,
      ThuNhapMienThue,
      ThuNhapChiuThue,
      MucGiamTruGiaCanh,
      ThueSuat,
      ThuePhaiDong,
      LuongThucNhan,
    } = req.body;

    const bangLuong = await BangLuong.create({
      MaTK,
      KyLuong,
      NgayTao,
      NgayThanhToan,
      TongGioLamViec,
      TongPhuCap,
      TongThuong,
      TongPhat,
      SoNguoiPhuThuoc,
      TongLuong,
      ThuNhapMienThue,
      ThuNhapChiuThue,
      MucGiamTruGiaCanh,
      ThueSuat,
      ThuePhaiDong,
      LuongThucNhan,
    });

    res.status(201).json({
      success: true,
      message: "Salary sheet created successfully",
      data: bangLuong,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating salary sheet",
      error: error.message,
    });
  }
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

// Calculate salary for an employee
exports.calculateSalary = async (req, res) => {
  try {
    const { MaTK, KyLuong } = req.body;

    // Get employee information
    const employee = await TaiKhoan.findByPk(MaTK);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Get dependent count
    const dependentCount = await NguoiPhuThuoc.count({
      where: { MaTK },
    });

    // Get rewards and penalties for the period
    const [rewards, penalties] = await Promise.all([
      KhenThuongKyLuat.findAll({
        where: {
          MaTK,
          ThuongPhat: true,
          NgayApDung: {
            [Op.between]: [
              new Date(KyLuong + "-01"),
              new Date(KyLuong + "-31"),
            ],
          },
        },
      }),
      KhenThuongKyLuat.findAll({
        where: {
          MaTK,
          ThuongPhat: false,
          NgayApDung: {
            [Op.between]: [
              new Date(KyLuong + "-01"),
              new Date(KyLuong + "-31"),
            ],
          },
        },
      }),
    ]);

    // Calculate total rewards and penalties
    const totalRewards = rewards.reduce(
      (sum, reward) => sum + Number(reward.MucThuongPhat),
      0
    );
    const totalPenalties = penalties.reduce(
      (sum, penalty) => sum + Number(penalty.MucThuongPhat),
      0
    );

    // Get allowances
    const allowances = await PhuCap.findAll({
      where: { MaTK },
    });

    const totalAllowances = allowances.reduce(
      (sum, allowance) => sum + Number(allowance.GiaTriPhuCap),
      0
    );

    // Calculate tax
    const personalDeduction = 11000000; // Base personal deduction
    const dependentDeduction = 4400000; // Deduction per dependent
    const totalDeduction =
      personalDeduction + dependentCount * dependentDeduction;

    const taxableIncome =
      employee.LuongCoBanHienTai + totalRewards - totalDeduction;
    let taxRate = 0;
    let taxAmount = 0;

    if (taxableIncome > 0) {
      if (taxableIncome <= 5000000) {
        taxRate = 0.05;
      } else if (taxableIncome <= 10000000) {
        taxRate = 0.1;
      } else if (taxableIncome <= 18000000) {
        taxRate = 0.15;
      } else if (taxableIncome <= 32000000) {
        taxRate = 0.2;
      } else if (taxableIncome <= 52000000) {
        taxRate = 0.25;
      } else if (taxableIncome <= 80000000) {
        taxRate = 0.3;
      } else {
        taxRate = 0.35;
      }
      taxAmount = taxableIncome * taxRate;
    }

    // Calculate final salary
    const netSalary =
      employee.LuongCoBanHienTai +
      totalRewards +
      totalAllowances -
      totalPenalties -
      taxAmount;

    const salarySheet = {
      MaTK,
      KyLuong,
      NgayTao: new Date(),
      NgayThanhToan: new Date(),
      TongGioLamViec: 0, // This should be calculated from attendance records
      TongPhuCap: totalAllowances,
      TongThuong: totalRewards,
      TongPhat: totalPenalties,
      SoNguoiPhuThuoc: dependentCount,
      TongLuong: employee.LuongCoBanHienTai,
      ThuNhapMienThue: totalAllowances,
      ThuNhapChiuThue: employee.LuongCoBanHienTai + totalRewards,
      MucGiamTruGiaCanh: totalDeduction,
      ThueSuat: taxRate * 100,
      ThuePhaiDong: taxAmount,
      LuongThucNhan: netSalary,
    };

    res.status(200).json({
      success: true,
      data: salarySheet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error calculating salary",
      error: error.message,
    });
  }
};
