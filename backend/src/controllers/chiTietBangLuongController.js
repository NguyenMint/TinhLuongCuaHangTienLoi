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
const { tinhTongGioLamCaLam, isWeekend } = require("../util/util");
exports.createSalaryDetail = async ({ MaChamCong }) => {
  try {
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
      throw new Error("Mã chấm công không tồn tại");
    }
    let isNgayLe = false,
      isCuoiTuan = false,
      isCaDem = false;
    if (chamCong.MaLLV_lich_lam_viec.MaCaLam_ca_lam.isCaDem) {
      isCaDem = true;
    }
    let heSoPhuCapNgayLe = null,
      heSoPhuCapCuoiTuan = null,
      heSoNgayThuongCaDem = null;
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
        where: {
          isCaDem: 1,
          LoaiNgay: "Ngày thường",
        },
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
      throw new Error("Tài khoản không tồn tại");
    }
    let GioLamViec = 0,
      LuongMotGio = 0,
      TienLuongCa = 0,
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
    } else if (isCaDem) {
      HeSoLuong = heSoNgayThuongCaDem.HeSoLuong;
    }
    GioLamViec = tinhTongGioLamCaLam(
      chamCong.MaLLV_lich_lam_viec.MaCaLam_ca_lam.ThoiGianBatDau,
      chamCong.MaLLV_lich_lam_viec.MaCaLam_ca_lam.ThoiGianKetThuc
    );
    LuongMotGio = taiKhoan.LuongTheoGioHienTai;
    TienLuongCa = LuongMotGio * GioLamViec * HeSoLuong;
    const khenThuongs = await KhenThuongKyLuat.findAll({
      where: { MaLLV: chamCong.MaLLV, ThuongPhat: true },
    });
    let TienPhuCap = 0;
    khenThuongs.forEach((khen) => {
      TienPhuCap += parseFloat(khen.MucThuongPhat);
    });
    const kyLuats = await KhenThuongKyLuat.findAll({
      where: { MaLLV: chamCong.MaLLV, ThuongPhat: false },
    });
    let TienPhat = 0;
    kyLuats.forEach((khen) => {
      TienPhat += parseFloat(khen.MucThuongPhat);
    });
    const tongtien =
      parseFloat(TienLuongCa) + parseFloat(TienPhuCap) - parseFloat(TienPhat);
    let chiTietBangLuong = [];
    if (chamCong.MaCTBL === null) {
      chiTietBangLuong = await ChiTietBangLuong.create({
        GioLamViec,
        TienLuongCa,
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
        TienLuongCa,
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
    return chiTietBangLuong;
  } catch (error) {
    throw error;
  }
};
exports.getByNhanVienAndNgay = async (req, res) => {
  try {
    const { Ngay, MaTK } = req.query;

    const chiTietBangLuong = await ChiTietBangLuong.findAll({
      where: {
        Ngay,
      },
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
              include: [
                {
                  model: CaLam,
                  as: "MaCaLam_ca_lam",
                },
                {
                  model: KhenThuongKyLuat,
                  as: "khen_thuong_ky_luats",
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json(chiTietBangLuong);
  } catch (error) {
    console.log("ERROR: " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
