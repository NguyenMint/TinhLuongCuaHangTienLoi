const db = require("../models");
const BangLuong = db.BangLuong;
const ChiTietBangLuong = db.ChiTietBangLuong;
const TaiKhoan = db.TaiKhoan;
const NguoiPhuThuoc = db.NguoiPhuThuoc;
const PhuCap = db.PhuCap;
const ChamCong = db.ChamCong;
const DangKyCa = db.DangKyCa;
const { Op, where } = require("sequelize");
const { formatDate } = require("../util/util");
const sequelize = require("../config/connectionDB");

// Create a new salary sheet
class bangLuongController {
  async create(req, res) {
    try {
      const { MaTK, Thang, Nam } = req.body;
      const startOfMonth = new Date(Nam, Thang - 1, 1);
      const endOfMonth = new Date(Nam, Thang, 0);
      const KyLuong = formatDate(startOfMonth) + " - " + formatDate(endOfMonth);
      const bangLuongExist = await BangLuong.findOne({
        where: {
          MaTK,
          KyLuong,
        },
      });
      if (bangLuongExist) {
        return res.status(409).json({
          message: "Bảng lương của nhân viên ở kỳ lương này đã có rồi",
        });
      }
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
            required: true,
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
      let ThueSuat = 0,
        ThuePhaiDong = 0;
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
        ThuePhaiDong = ThuNhapChiuThue * (ThueSuat / 100);
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
        NgayThanhToan: null,
        LuongThucNhan,
        KyLuong,
        MaTK,
      });
      for (const ct of chiTietBangLuongs) {
        await ct.update({
          MaBangLuong: bangLuong.MaBangLuong,
        });
      }
      res.status(200).json({ success: true, bangLuong });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Get all salary sheets
  async getAll(req, res) {
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
  }

  // Get salary sheet by ID
  async findOne(req, res) {
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
  }

  // Update salary sheet
  async update(req, res) {
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
  }

  // Delete salary sheet
  async delete(req, res) {
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
  }

  // Calculate salary for an employee
  async calculateSalary(req, res) {
    try {
      const { MaTK, KyLuong } = req.body;

      // Get employee information with ThangLuong
      const employee = await TaiKhoan.findByPk(MaTK, {
        include: [
          {
            model: db.VaiTro,
            as: "MaVaiTro_vai_tro",
            include: [
              {
                model: db.ThangLuong,
                as: "thang_luongs",
                where: {
                  BacLuong: db.sequelize.col("BacLuong"),
                },
              },
            ],
          },
        ],
      });

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

      // Get attendance records for the month
      const [startDate, endDate] = KyLuong.split("-");
      const startOfMonth = new Date(startDate, endDate - 1, 1);
      const endOfMonth = new Date(startDate, endDate, 0);

      const chamCongRecords = await db.ChamCong.findAll({
        include: [
          {
            model: db.DangKyCa,
            as: "MaDKC_dang_ky_ca",
            where: {
              MaNS: MaTK,
              NgayDangKy: {
                [Op.between]: [startOfMonth, endOfMonth],
              },
            },
            include: [
              {
                model: db.CaLam,
                as: "MaCaLam_ca_lam",
              },
            ],
          },
        ],
      });

      // Calculate total working hours
      let totalWorkingHours = 0;
      chamCongRecords.forEach((record) => {
        if (record.GioVao && record.GioRa) {
          const [h1, m1, s1] = record.GioVao.split(":").map(Number);
          const [h2, m2, s2] = record.GioRa.split(":").map(Number);

          const gioVao = new Date(0, 0, 0, h1, m1, s1);
          let gioRa = new Date(0, 0, 0, h2, m2, s2);

          if (gioRa <= gioVao) {
            gioRa.setDate(gioRa.getDate() + 1);
          }

          const hours = (gioRa - gioVao) / (1000 * 60 * 60);
          totalWorkingHours += hours;
        }
      });
      console.log(totalWorkingHours);

      // Get rewards and penalties for the period
      const [rewards, penalties] = await Promise.all([
        db.KhenThuongKyLuat.findAll({
          where: {
            MaTK,
            ThuongPhat: true,
            NgayApDung: {
              [Op.between]: [startOfMonth, endOfMonth],
            },
          },
        }),
        db.KhenThuongKyLuat.findAll({
          where: {
            MaTK,
            ThuongPhat: false,
            NgayApDung: {
              [Op.between]: [startOfMonth, endOfMonth],
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

      // Phụ Cấp
      const allowances = await db.PhuCap.findAll({
        where: {
          MaTK,
          TrangThai: true,
        },
      });

      // Calculate total allowances (taxable and non-taxable)
      let taxableAllowances = 0;
      let nonTaxableAllowances = 0;

      allowances.forEach((allowance) => {
        if (allowance.DuocMienThue) {
          nonTaxableAllowances += Number(allowance.GiaTriPhuCap);
        } else {
          taxableAllowances += Number(allowance.GiaTriPhuCap);
        }
      });

      // Calculate tax
      const personalDeduction = 11000000; // Base personal deduction
      const dependentDeduction = 4400000; // Deduction per dependent
      const totalDeduction =
        personalDeduction + dependentCount * dependentDeduction;

      // Calculate taxable income
      const taxableIncome =
        employee.LuongCoBanHienTai +
        totalRewards +
        taxableAllowances -
        totalDeduction;
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
        taxableAllowances +
        nonTaxableAllowances -
        totalPenalties -
        taxAmount;

      const salarySheet = {
        MaTK,
        KyLuong,
        NgayTao: new Date(),
        NgayThanhToan: new Date(),
        TongGioLamViec: totalWorkingHours,
        TongPhuCap: taxableAllowances + nonTaxableAllowances,
        TongThuong: totalRewards,
        TongPhat: totalPenalties,
        SoNguoiPhuThuoc: dependentCount,
        TongLuong: employee.LuongCoBanHienTai,
        ThuNhapMienThue: nonTaxableAllowances,
        ThuNhapChiuThue:
          employee.LuongCoBanHienTai + totalRewards + taxableAllowances,
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
  }

  async calculateSalaryV2(req, res) {
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
    let ThueSuat = 0,
      ThuePhaiDong = 0;
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
      ThuePhaiDong = ThuNhapChiuThue * (ThueSuat / 100);
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
      NgayThanhToan: null,
      LuongThucNhan,
      KyLuong,
      MaTK,
    });
    res.status(200).json(bangLuong);
  }
  async getKyLuong(req, res) {
    try {
      const kyLuongList = await BangLuong.findAll({
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col("KyLuong")), "KyLuong"],
        ],
        raw: true,
      });

      res.status(200).json(kyLuongList);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving salary sheets",
        error: error.message,
      });
    }
  }
}
module.exports = new bangLuongController();
