const db = require("../models");
const BangLuong = db.BangLuong;
const ChiTietBangLuong = db.ChiTietBangLuong;
const TaiKhoan = db.TaiKhoan;
const NguoiPhuThuoc = db.NguoiPhuThuoc;
const PhuCap = db.PhuCap;
const ChamCong = db.ChamCong;
const LichLamViec = db.LichLamViec;
const KhenThuongKyLuat = db.KhenThuongKyLuat;
const { Op, where } = require("sequelize");
const { formatDate, tinhThueTNCN } = require("../util/util");
const sequelize = require("../config/connectionDB");
const taiKhoan = require("../models/taiKhoan");
const cron = require('node-cron');

async function createBL(MaTK, Thang, Nam) {
  try {
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
      TongPhuCap += parseFloat(phucap.GiaTriPhuCap);
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
              model: LichLamViec,
              as: "MaLLV_lich_lam_viec",
              where: {
                MaTK,
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
      TongGioLamViec += parseInt(chitietBL.GioLamViec);
      LuongThang += parseFloat(chitietBL.TienLuongCa);
    });
    TongLuong += TongPhuCap;
    const phuCapTinhThue = await PhuCap.findAll({
      where: {
        MaTK,
        TrangThai: 1,
        DuocMienThue: 0,
      },
    });
    const thuongPhuCapNgayTinhThue = await db.KhenThuongKyLuat.findAll({
      where: {
        ThuongPhat: 1,
        DuocMienThue: 0,
      },
      include: [
        {
          model: LichLamViec,
          as: "MaLLV_lich_lam_viec",
          required: true,
          where: {
            MaTK,
          },
        },
      ],
    });
    let tongPhuCapTinhThue = 0,
      tongThuongPhuCapNgayTinhThue = 0;
    phuCapTinhThue.forEach((phucap) => {
      tongPhuCapTinhThue += parseFloat(phucap.GiaTriPhuCap);
    });
    thuongPhuCapNgayTinhThue.forEach((phucap) => {
      tongThuongPhuCapNgayTinhThue += parseFloat(phucap.MucThuongPhat);
    });
    const ThuNhapTruocThue =
      LuongThang + tongPhuCapTinhThue + tongThuongPhuCapNgayTinhThue;
    const SoNguoiPhuThuoc = await NguoiPhuThuoc.count({
      where: {
        MaTK,
      },
    });
    let MucGiamTruGiaCanh = 11000000;
    if (SoNguoiPhuThuoc > 0) {
      MucGiamTruGiaCanh += SoNguoiPhuThuoc * 4400000;
    }
    let ThuNhapChiuThue = 0;
    if (ThuNhapTruocThue > MucGiamTruGiaCanh) {
      ThuNhapChiuThue = ThuNhapTruocThue - MucGiamTruGiaCanh;
    }

    const ThuePhaiDong = tinhThueTNCN(ThuNhapChiuThue);
    const LuongThucNhan = TongLuong - ThuePhaiDong;
    const bangLuongExist = await BangLuong.findOne({
      where: {
        MaTK,
        KyLuong,
      },
    });
    let bangLuong = null;

    if (bangLuongExist) {
      bangLuong = await bangLuongExist.update({
        LuongThang,
        TongPhuCap,
        TongThuong,
        TongPhat,
        TongGioLamViec,
        SoNguoiPhuThuoc,
        TongLuong,
        ThuNhapTruocThue,
        ThuNhapChiuThue,
        MucGiamTruGiaCanh,
        ThuePhaiDong,
        NgayTao: new Date(),
        NgayThanhToan: null,
        LuongThucNhan,
        KyLuong,
        MaTK,
      });
    } else {
      bangLuong = await BangLuong.create({
        LuongThang,
        TongPhuCap,
        TongThuong,
        TongPhat,
        TongGioLamViec,
        SoNguoiPhuThuoc,
        TongLuong,
        ThuNhapTruocThue,
        ThuNhapChiuThue,
        MucGiamTruGiaCanh,
        ThuePhaiDong,
        NgayTao: new Date(),
        NgayThanhToan: null,
        LuongThucNhan,
        KyLuong,
        MaTK,
      });
    }

    for (const ct of chiTietBangLuongs) {
      await ct.update({
        MaBangLuong: bangLuong.MaBangLuong,
      });
    }

    return bangLuongExist;
  } catch (error) {
    return error;
  }
}

 // AUTO CREATE BL
 async function  autoCreateMonthlyPayroll() {
  try {
    const now = new Date();
    const thangTruoc = now.getMonth(); //0-11
    const namTruoc =
      thangTruoc === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const thangThucTe = thangTruoc === 0 ? 12 : thangTruoc;

    const allAccounts = await TaiKhoan.findAll({
      attributes: ["MaTK"],
      where: { [Op.not]: { MaVaiTro: [3, 1] } },
      raw: true,
    });

    if (allAccounts.length === 0) {
      console.log("Không có nhân viên nào để tạo bảng lương");
      return {
        success: false,
        message: "Không có nhân viên nào để tạo bảng lương",
      };
    }

    const results = await Promise.all(
      allAccounts.map(async (account) => {
        try {
          const result = await createBL(account.MaTK, thangThucTe, namTruoc);
          return { MaTK: account.MaTK, success: true, result };
        } catch (error) {
          console.error(
            `Lỗi tạo bảng lương cho nhân viên ${account.MaTK}:`,
            error
          );
          return { MaTK: account.MaTK, success: false, error: error.message };
        }
      })
    );

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    console.log(
      `Hoàn thành tạo bảng lương tự động: ${successCount} thành công, ${failCount} thất bại`
    );

    return {
      success: true,
      message: `Tạo bảng lương tự động thành công cho ${successCount} nhân viên`,
      details: {
        thang: thangThucTe,
        nam: namTruoc,
        totalEmployees: allAccounts.length,
        successCount,
        failCount,
        results,
      },
    };
  } catch (error) {
    console.error("Lỗi trong quá trình tạo bảng lương tự động:", error);
    return {
      success: false,
      message: "Lỗi trong quá trình tạo bảng lương tự động",
      error: error.message,
    };
  }
}

// cron job tự động tạo bảng lương
function initAutoPayrollScheduler() {
  cron.schedule(
    "0 9 1 * *", //minute hour dayOfMonth month dayOfWeek
    async () => {
      try {
        const result = await autoCreateMonthlyPayroll();
        console.log("Kết quả tạo bảng lương tự động:", result);
      } catch (error) {
        console.error("Lỗi trong cron job tạo bảng lương:", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Ho_Chi_Minh",
    }
  );

  console.log(
    "Đã khởi tạo scheduler tự động tạo bảng lương - chạy vào 09:00 ngày 1 hàng tháng"
  );
}


// Create a new salary sheet
class bangLuongController {
  async create(req, res) {
    try {
      const { MaTK, Thang, Nam } = req.body;
      const bangLuong = await createBL(MaTK, Thang, Nam);

      res.status(201).json({ success: true, bangLuong });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      console.log("error: " + error);
    }
  }

  // Create salary sheets for all employees for a given month and year
  async createAll(req, res) {
    try {
      const { Thang, Nam } = req.body;

      const allAccounts = await TaiKhoan.findAll({
        attributes: ["MaTK"],
        where: { [Op.not]: { MaVaiTro: [3, 1] } },
        raw: true,
      });

      const results = await Promise.all(
        allAccounts.map((account) => createBL(account.MaTK, Thang, Nam))
      );
      res.status(201).json({ success: true, results });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
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

  async deleteBL(req, res) {
    try {
      const { KyLuong } = req.body;
      const bangLuong = await BangLuong.findAll({
        where: { KyLuong: KyLuong },
        attributes: ["MaBangLuong"],
        raw: true,
      });
      await bangLuong.map(async (mbl) => {
        await ChiTietBangLuong.update(
          { MaBangLuong: null },
          {
            where: { MaBangLuong: mbl.MaBangLuong },
          }
        );
      });

      if (!bangLuong) {
        return res.status(404).json({
          success: false,
          message: "Salary sheet not found",
        });
      }
      for (const bl of bangLuong) {
        await db.BangLuong.destroy({ where: { MaBangLuong: bl.MaBangLuong } });
      }
      res.status(200).json({
        success: true,
        message: "Salary sheet deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting sa1lary sheet",
        error: error.message,
      });
    }
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

  async getBLByCN(req, res) {
    try {
      const { macn } = req.params;

      const payrolls = await BangLuong.findAll({
        attributes: [
          "KyLuong",
          "NgayTao",

          [
            sequelize.fn("SUM", sequelize.col("TongLuong")),
            "TongLuongThucNhan",
          ],
          [sequelize.fn("COUNT", sequelize.col("BangLuong.MaTK")), "SoLuong"],
          [
            sequelize.literal(
              "SUM(CASE WHEN NgayThanhToan IS NULL THEN 1 ELSE 0 END)"
            ),
            "ChuaTra",
          ],
          [
            sequelize.literal(
              "SUM(CASE WHEN NgayThanhToan IS NOT NULL THEN TongLuong ELSE 0 END)"
            ),
            "LuongDaTra",
          ],
        ],
        include: [
          {
            where: { MaCN: macn },
            model: TaiKhoan,
            as: "MaTK_tai_khoan",
            attributes: ["MaCN"],
            include: [
              {
                model: db.ChiNhanh,
                as: "MaCN_chi_nhanh",
                attributes: ["TenChiNhanh"],
              },
            ],
          },
        ],
        group: ["KyLuong", "MaTK_tai_khoan.MaCN", "TenChiNhanh"],
        raw: true,
      });

      const formattedPayrolls = payrolls.map((payroll) => ({
        KyLuong: payroll.KyLuong,
        NgayTao: payroll.NgayTao,
        MaCN: payroll["MaTK_tai_khoan.MaCN"],
        TongLuongThucNhan: Number(payroll.TongLuongThucNhan),
        SoLuong: Number(payroll.SoLuong),
        ChuaTra: Number(payroll.ChuaTra),
        TenChiNhanh: payroll["MaTK_tai_khoan.MaCN_chi_nhanh.TenChiNhanh"],
        LuongDaTra: Number(payroll.LuongDaTra),
        LuongChuaTra: Number(payroll.TongLuongThucNhan - payroll.LuongDaTra),
      }));

      res.json(formattedPayrolls);
    } catch (error) {
      console.error("Error fetching payrolls:", error.message, error.stack);
      res
        .status(500)
        .json({ error: "Lỗi server khi lấy danh sách bảng lương" });
    }
  }
  async getBLTotal(req, res) {
    try {
      const payrolls = await BangLuong.findAll({
        attributes: [
          "KyLuong",
          "NgayTao",

          [
            sequelize.fn("SUM", sequelize.col("TongLuong")),
            "TongLuongThucNhan",
          ],
          [sequelize.fn("COUNT", sequelize.col("BangLuong.MaTK")), "SoLuong"],
          [
            sequelize.literal(
              "SUM(CASE WHEN NgayThanhToan IS NULL THEN 1 ELSE 0 END)"
            ),
            "ChuaTra",
          ],
          [
            sequelize.literal(
              "SUM(CASE WHEN NgayThanhToan IS NOT NULL THEN TongLuong ELSE 0 END)"
            ),
            "LuongDaTra",
          ],
        ],
        group: ["KyLuong"],
        raw: true,
      });

      const formattedPayrolls = payrolls.map((payroll) => ({
        KyLuong: payroll.KyLuong,
        NgayTao: payroll.NgayTao,
        TongLuongThucNhan: Number(payroll.TongLuongThucNhan),
        SoLuong: Number(payroll.SoLuong),
        ChuaTra: Number(payroll.ChuaTra),
        LuongDaTra: Number(payroll.LuongDaTra),
        LuongChuaTra: Number(payroll.TongLuongThucNhan - payroll.LuongDaTra),
      }));

      res.json(formattedPayrolls);
    } catch (error) {
      console.error("Error fetching payrolls:", error.message, error.stack);
      res
        .status(500)
        .json({ error: "Lỗi server khi lấy danh sách bảng lương" });
    }
  }
  async getPLByKyLuong(req, res) {
    const { kyLuong } = req.body;

    try {
      const payrolls = await BangLuong.findAll({
        where: { KyLuong: kyLuong },
        include: [
          {
            model: TaiKhoan,
            as: "MaTK_tai_khoan",
            attributes: ["MaNhanVien", "HoTen"]
          },
          {
            model: ChiTietBangLuong,
            as: "chi_tiet_bang_luongs",
            attributes: [
              "Ngay",
              "GioLamViec",
              "LuongMotGio",
              "HeSoLuong",
              "isNgayLe",
              "isCuoiTuan",
              "isCaDem",
              "TienLuongCa",
              "TienPhuCap",
              "TienPhat",
              "tongtien",
            ],
            include: [
              {
                model: ChamCong,
                as: "cham_congs",
                attributes: ["MaChamCong"],
                include: [
                  {
                    model: LichLamViec,
                    as: "MaLLV_lich_lam_viec",
                    attributes: ["MaLLV"],
                    include: [
                      {
                        model: KhenThuongKyLuat,
                        as: "khen_thuong_ky_luats",
                        attributes: ["ThuongPhat", "LyDo", "MucThuongPhat"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      const response = {
        KyLuong: kyLuong,
        employees: payrolls.map((payroll) => ({
          MaBangLuong: payroll.MaBangLuong,
          MaNhanVien: payroll.MaTK_tai_khoan.MaNhanVien,
          HoTen: payroll.MaTK_tai_khoan.HoTen,
          LuongThang: payroll.LuongThang,
          TongGioLamViec: payroll.TongGioLamViec,
          TongLuong: payroll.TongLuong,
          TongPhuCap: payroll.TongPhuCap,
          TongThuong: payroll.TongThuong,
          TongPhat: payroll.TongPhat,
          ThuNhapTruocThue:payroll.ThuNhapTruocThue,
          MucGiamTruGiaCanh: payroll.MucGiamTruGiaCanh,
          ThuNhapChiuThue: payroll.ThuNhapChiuThue,
          ThuePhaiDong: payroll.ThuePhaiDong,
          LuongThucNhan: payroll.LuongThucNhan,
          details: payroll.chi_tiet_bang_luongs.map((detail) => ({
            Ngay: detail.Ngay,
            GioLamViec: detail.GioLamViec,
            LuongMotGio: detail.LuongMotGio,
            HeSoLuong: detail.HeSoLuong,
            isNgayLe: detail.isNgayLe,
            isCuoiTuan: detail.isCuoiTuan,
            isCaDem: detail.isCaDem,
            TienLuongCa: detail.TienLuongCa,
            TienPhuCap: detail.TienPhuCap,
            TienPhat: detail.TienPhat,
            tongtien: detail.tongtien,
            detailsThuongPhat:
              detail.cham_congs?.[0]?.MaLLV_lich_lam_viec?.khen_thuong_ky_luats?.map(
                (ktkl) => ({
                  ThuongPhat: ktkl.ThuongPhat,
                  LyDo: ktkl.LyDo,
                  MucThuongPhat: ktkl.MucThuongPhat,
                })
              ) || [],
          })),
        })),
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching payroll details:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  }
  async getPLByKyLuongCN(req, res) {
    const { kyLuong, maCN } = req.body;

    try {
      const payrolls = await BangLuong.findAll({
        where: { KyLuong: kyLuong },
        include: [
          {
            where: { MaCN: maCN },
            model: TaiKhoan,
            as: "MaTK_tai_khoan",
            attributes: ["MaNhanVien", "HoTen"],
          },
          {
            model: ChiTietBangLuong,
            as: "chi_tiet_bang_luongs",
            attributes: [
              "Ngay",
              "GioLamViec",
              "LuongMotGio",
              "HeSoLuong",
              "isNgayLe",
              "isCuoiTuan",
              "isCaDem",
              "TienLuongCa",
              "TienPhuCap",
              "TienPhat",
              "tongtien",
            ],
          },
        ],
      });

      const response = {
        KyLuong: kyLuong,
        employees: payrolls.map((payroll) => ({
          MaBangLuong: payroll.MaBangLuong,
          MaNhanVien: payroll.MaTK_tai_khoan.MaNhanVien,
          HoTen: payroll.MaTK_tai_khoan.HoTen,
          LuongThang: payroll.LuongThang,
          TongGioLamViec: payroll.TongGioLamViec,
          TongLuong: payroll.TongLuong,
          TongPhuCap: payroll.TongPhuCap,
          TongThuong: payroll.TongThuong,
          TongPhat: payroll.TongPhat,
          ThuePhaiDong: payroll.ThuePhaiDong,
          LuongThucNhan: payroll.LuongThucNhan,
          details: payroll.chi_tiet_bang_luongs.map((detail) => ({
            Ngay: detail.Ngay,
            GioLamViec: detail.GioLamViec,
            LuongMotGio: detail.LuongMotGio,
            HeSoLuong: detail.HeSoLuong,
            isNgayLe: detail.isNgayLe,
            isCuoiTuan: detail.isCuoiTuan,
            isCaDem: detail.isCaDem,
            TienLuongCa: detail.TienLuongCa,
            TienPhuCap: detail.TienPhuCap,
            TienPhat: detail.TienPhat,
            tongtien: detail.tongtien,
            detailsThuongPhat:
              detail.cham_congs?.[0]?.MaLLV_lich_lam_viec?.khen_thuong_ky_luats?.map(
                (ktkl) => ({
                  ThuongPhat: ktkl.ThuongPhat,
                  LyDo: ktkl.LyDo,
                  MucThuongPhat: ktkl.MucThuongPhat,
                })
              ) || [],
          })),
        })),
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching payroll details:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  }

  // testing
  async triggerAutoPayroll(req, res) {
    try {
      console.log("Trigger thủ công tạo bảng lương tự động");
      const result = await autoCreateMonthlyPayroll();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi trigger tạo bảng lương tự động",
        error: error.message,
      });
    }
  }

 
}

// function initPayrollScheduler() {
//   const controller = new bangLuongController();
//   controller.initAutoPayrollScheduler();
// }

module.exports = new bangLuongController();
module.exports.initPayrollScheduler = initAutoPayrollScheduler;
module.exports.autoCreateMonthlyPayroll = autoCreateMonthlyPayroll;