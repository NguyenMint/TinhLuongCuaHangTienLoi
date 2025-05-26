var DataTypes = require("sequelize").DataTypes;
var _BangLuong = require("./bangLuong");
var _CaLam = require("./caLam");
var _ChamCong = require("./chamCong");
var _ChiNhanh = require("./chiNhanh");
var _ChiTietBangLuong = require("./chiTietBangLuong");
var _ChungChi = require("./chungChi");
var _DangKyCa = require("./dangKyCa");
var _HeSoPhuCap = require("./heSoPhuCap");
var _HopDongLd = require("./hopDongLd");
var _KhenThuongKyLuat = require("./khenThuongKyLuat");
var _LichSuTangLuong = require("./lichSuTangLuong");
var _NgayNghiPhep = require("./ngayNghiPhep");
var _NguoiPhuThuoc = require("./nguoiPhuThuoc");
var _PhuCap = require("./phuCap");
var _TaiKhoan = require("./taiKhoan");
var _ThangLuong = require("./thangLuong");
var _VaiTro = require("./vaiTro");

function initModels(sequelize) {
  var BangLuong = _BangLuong(sequelize, DataTypes);
  var CaLam = _CaLam(sequelize, DataTypes);
  var ChamCong = _ChamCong(sequelize, DataTypes);
  var ChiNhanh = _ChiNhanh(sequelize, DataTypes);
  var ChiTietBangLuong = _ChiTietBangLuong(sequelize, DataTypes);
  var ChungChi = _ChungChi(sequelize, DataTypes);
  var DangKyCa = _DangKyCa(sequelize, DataTypes);
  var HeSoPhuCap = _HeSoPhuCap(sequelize, DataTypes);
  var HopDongLd = _HopDongLd(sequelize, DataTypes);
  var KhenThuongKyLuat = _KhenThuongKyLuat(sequelize, DataTypes);
  var LichSuTangLuong = _LichSuTangLuong(sequelize, DataTypes);
  var NgayNghiPhep = _NgayNghiPhep(sequelize, DataTypes);
  var NguoiPhuThuoc = _NguoiPhuThuoc(sequelize, DataTypes);
  var PhuCap = _PhuCap(sequelize, DataTypes);
  var TaiKhoan = _TaiKhoan(sequelize, DataTypes);
  var ThangLuong = _ThangLuong(sequelize, DataTypes);
  var VaiTro = _VaiTro(sequelize, DataTypes);

  ChiTietBangLuong.belongsTo(BangLuong, { as: "MaBangLuong_bang_luong", foreignKey: "MaBangLuong"});
  BangLuong.hasMany(ChiTietBangLuong, { as: "chi_tiet_bang_luongs", foreignKey: "MaBangLuong"});
  DangKyCa.belongsTo(CaLam, { as: "MaCaLam_ca_lam", foreignKey: "MaCaLam"});
  CaLam.hasMany(DangKyCa, { as: "dang_ky_cas", foreignKey: "MaCaLam"});
  TaiKhoan.belongsTo(ChiNhanh, { as: "MaCN_chi_nhanh", foreignKey: "MaCN"});
  ChiNhanh.hasMany(TaiKhoan, { as: "tai_khoans", foreignKey: "MaCN"});
  ChamCong.belongsTo(ChiTietBangLuong, { as: "MaCTBL_chi_tiet_bang_luong", foreignKey: "MaCTBL"});
  ChiTietBangLuong.hasMany(ChamCong, { as: "cham_congs", foreignKey: "MaCTBL"});
  ChamCong.belongsTo(DangKyCa, { as: "MaDKC_dang_ky_ca", foreignKey: "MaDKC"});
  DangKyCa.hasMany(ChamCong, { as: "cham_congs", foreignKey: "MaDKC"});
  BangLuong.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(BangLuong, { as: "bang_luongs", foreignKey: "MaTK"});
  ChungChi.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(ChungChi, { as: "chung_chis", foreignKey: "MaTK"});
  DangKyCa.belongsTo(TaiKhoan, { as: "MaNS_tai_khoan", foreignKey: "MaNS"});
  TaiKhoan.hasMany(DangKyCa, { as: "dang_ky_cas", foreignKey: "MaNS"});
  HeSoPhuCap.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(HeSoPhuCap, { as: "he_so_phu_caps", foreignKey: "MaTK"});
  HopDongLd.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(HopDongLd, { as: "hop_dong_lds", foreignKey: "MaTK"});
  KhenThuongKyLuat.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(KhenThuongKyLuat, { as: "khen_thuong_ky_luats", foreignKey: "MaTK"});
  LichSuTangLuong.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(LichSuTangLuong, { as: "lich_su_tang_luongs", foreignKey: "MaTK"});
  NgayNghiPhep.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(NgayNghiPhep, { as: "ngay_nghi_pheps", foreignKey: "MaTK"});
  NgayNghiPhep.belongsTo(TaiKhoan, { as: "NguoiDuyet_tai_khoan", foreignKey: "NguoiDuyet"});
  TaiKhoan.hasMany(NgayNghiPhep, { as: "NguoiDuyet_ngay_nghi_pheps", foreignKey: "NguoiDuyet"});
  NguoiPhuThuoc.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(NguoiPhuThuoc, { as: "nguoi_phu_thuocs", foreignKey: "MaTK"});
  PhuCap.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(PhuCap, { as: "phu_caps", foreignKey: "MaTK"});
  TaiKhoan.belongsTo(TaiKhoan, { as: "QuanLyBoi_tai_khoan", foreignKey: "QuanLyBoi"});
  TaiKhoan.hasMany(TaiKhoan, { as: "tai_khoans", foreignKey: "QuanLyBoi"});
  TaiKhoan.belongsTo(VaiTro, { as: "MaVaiTro_vai_tro", foreignKey: "MaVaiTro"});
  VaiTro.hasMany(TaiKhoan, { as: "tai_khoans", foreignKey: "MaVaiTro"});
  ThangLuong.belongsTo(VaiTro, { as: "MaVaiTro_vai_tro", foreignKey: "MaVaiTro"});
  VaiTro.hasMany(ThangLuong, { as: "thang_luongs", foreignKey: "MaVaiTro"});

  return {
    BangLuong,
    CaLam,
    ChamCong,
    ChiNhanh,
    ChiTietBangLuong,
    ChungChi,
    DangKyCa,
    HeSoPhuCap,
    HopDongLd,
    KhenThuongKyLuat,
    LichSuTangLuong,
    NgayNghiPhep,
    NguoiPhuThuoc,
    PhuCap,
    TaiKhoan,
    ThangLuong,
    VaiTro,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
