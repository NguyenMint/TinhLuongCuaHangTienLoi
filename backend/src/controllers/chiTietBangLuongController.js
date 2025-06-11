const db = require("../models");
const ChiTietBangLuong = db.ChiTietBangLuong;
const BangLuong = db.BangLuong;
const ChamCong = db.ChamCong;
const TaiKhoan = db.TaiKhoan;
const ThangLuong = db.ThangLuong;
const KhenThuongKyLuat = db.KhenThuongKyLuat;
const DangKyCa = db.DangKyCa;
const CaLam = db.CaLam;
const { Op, where } = require("sequelize");
const { getSoNgayTrongThang, tinhTongGioLamCaLam } = require("../util/util");
// Create a new salary detail
exports.create = async (req, res) => {
  try {
    const { Ngay, MaTK } = req.body;
    const chamCongList = await ChamCong.findAll({
      where: {
        NgayChamCong: Ngay,
        TrangThai: "Hoàn thành",
      },
      include: [
        {
          model: db.DangKyCa,
          as: "MaDKC_dang_ky_ca",
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
    let GioLamViecTrongNgay = 0;
    chamCongList.forEach((record) => {
      GioLamViecTrongNgay += tinhTongGioLamCaLam(
        record.MaDKC_dang_ky_ca.MaCaLam_ca_lam.ThoiGianBatDau,
        record.MaDKC_dang_ky_ca.MaCaLam_ca_lam.ThoiGianKetThuc
      );
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
    let TienLuongNgay = GioLamViecTrongNgay * luongOneHour;
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
          model: db.DangKyCa,
          as: "MaDKC_dang_ky_ca",
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
      return res.status(200).json(chiTietBangLuong);
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
    res.status(201).json(chiTietBangLuong);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating salary detail",
      error: error.message,
    });
  }
};
exports.getByNhanVienAndNgay = async (req,res) => {
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
              model: DangKyCa,
              as: "MaDKC_dang_ky_ca",
              where: {
                MaNS: MaTK,
              },
              include:[
                {
                  model: CaLam,
                  as:"MaCaLam_ca_lam"
                }
              ]
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

exports.calculateDailySalary = async (req, res) => {
  try {
    // const { MaBangLuong, NgayChamCong } = req.body;
    const { MaDKC } = req.body;
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

    const dangKyCa = await db.DangKyCa.findOne({
      where: { MaDKC },
      include: [
        { model: db.CaLam, as: "MaCaLam_ca_lam" },
        { model: db.ChamCong, as: "cham_congs" },
        {
          model: db.TaiKhoan,
          attributes: ["luongCoBanHienTai", "MaTK", "LoaiNV"],
          as: "MaNS_tai_khoan",
        },
      ],
    });

    // console.log(dangKyCa.MaNS_tai_khoan);

    const { ThoiGianBatDau, ThoiGianKetThuc } = dangKyCa.MaCaLam_ca_lam;

    // Col1. Tính tiền làm việc theo ca
    let luongTheoGio = 0;
    const soNgay = getSoNgayTrongThang(dangKyCa.NgayDangKy); // Lấy số ngày trong tháng

    if (dangKyCa.MaNS_tai_khoan.LoaiNV == "FullTime") {
      luongTheoGio = (
        dangKyCa.MaNS_tai_khoan.dataValues.luongCoBanHienTai / soNgay
      ).toFixed(2);
    } else {
      luongTheoGio = dangKyCa.MaNS_tai_khoan.dataValues.luongCoBanHienTai;
    }

    const batDau = new Date(`2025-01-01T${ThoiGianBatDau}`);
    let ketThuc = new Date(`2025-01-01T${ThoiGianKetThuc}`);

    if (ketThuc <= batDau) {
      ketThuc.setDate(ketThuc.getDate() + 1);
    }

    let tongGioLam = (ketThuc - batDau) / 3600000; //Chuyển từ giây qua số giờ làm việc

    // Col2. Tiền phạt từ đi trễ và về sớm
    let TienPhat = 0;
    const DiTre = dangKyCa.cham_congs[0].dataValues?.DiTre ?? 0;
    const VeSom = dangKyCa.cham_congs[0].dataValues?.VeSom ?? 0;

    console.log(DiTre, VeSom);

    if (DiTre < 5) {
      console.log("Không trễ");
    } else if (DiTre < 15) {
      tongGioLam -= 1;
    } else if (DiTre < 60) {
      tongGioLam -= 2;
    } else {
      tongGioLam = 0;
    }

    if (VeSom < 5) {
      console.log("Không về sớm");
    } else if (VeSom < 15) {
      tongGioLam -= 1;
    } else if (VeSom < 60) {
      tongGioLam -= 2;
    } else {
      tongGioLam = 0;
    }

    const tienLuongNgay = parseFloat((luongTheoGio * tongGioLam).toFixed(2));

    console.log(dangKyCa.cham_congs);

    // Get attendance records for the day
    // const chamCong = await ChamCong.findOne({
    //   where: {
    //     MaCTBL: null,
    //     NgayChamCong,
    //     MaDKC: {
    //       [Op.in]: db.sequelize.literal(`(
    //         SELECT MaDKC
    //         FROM dang_ky_ca
    //         WHERE MaNS = ${bangLuong.MaTK}
    //       )`),
    //     },
    //   },
    // });

    // if (!chamCong) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No attendance record found for this day",
    //   });
    // }

    // // Calculate working hours
    // const gioVao = new Date(chamCong.GioVao);
    // const gioRa = new Date(chamCong.GioRa);
    // const gioLamViec = (gioRa - gioVao) / (1000 * 60 * 60); // Convert to hours

    // // Calculate daily salary based on working hours
    // const luongTheoGio = bangLuong.MaTK_tai_khoan.LuongCoBanHienTai / 176; // Assuming 176 working hours per month
    // const tienLuongNgay = luongTheoGio * gioLamViec;

    // // Calculate penalties for late arrival and early departure
    // const tienPhat =
    //   (chamCong.DiTre || 0) * 50000 + (chamCong.VeSom || 0) * 50000;

    // // Calculate allowances
    // const tienPhuCap = 0; // This should be calculated based on allowances for the day
    // const loaiPhuCap = ""; // This should be determined based on the type of allowance

    // // Calculate total
    // const tongtien = tienLuongNgay + tienPhuCap - tienPhat;

    // const chiTietBangLuong = {
    //   MaBangLuong,
    //   GioLamViecTrongNgay: gioLamViec,
    //   TienLuongNgay: tienLuongNgay,
    //   TienPhat: tienPhat,
    //   TienPhuCap: tienPhuCap,
    //   LoaiPhuCap: loaiPhuCap,
    //   tongtien,
    // };

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
