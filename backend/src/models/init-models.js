var DataTypes = require("sequelize").DataTypes;
var _BangLuong = require("./bangLuong");
var _CaLam = require("./caLam");
var _ChamCong = require("./chamCong");
var _ChiNhanh = require("./chiNhanh");
var _ChiTietBangLuong = require("./chiTietBangLuong");
var _ChungChi = require("./chungChi");
var _HeSoPhuCap = require("./heSoPhuCap");
var _HopDongLd = require("./hopDongLd");
var _KhenThuongKyLuat = require("./khenThuongKyLuat");
var _LichLamViec = require("./lichLamViec");
var _LichSuTangLuong = require("./lichSuTangLuong");
var _NgayNghiPhep = require("./ngayNghiPhep");
var _NghiThaiSan = require("./nghiThaiSan");
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
  var HeSoPhuCap = _HeSoPhuCap(sequelize, DataTypes);
  var HopDongLd = _HopDongLd(sequelize, DataTypes);
  var KhenThuongKyLuat = _KhenThuongKyLuat(sequelize, DataTypes);
  var LichLamViec = _LichLamViec(sequelize, DataTypes);
  var LichSuTangLuong = _LichSuTangLuong(sequelize, DataTypes);
  var NgayNghiPhep = _NgayNghiPhep(sequelize, DataTypes);
  var NghiThaiSan = _NghiThaiSan(sequelize, DataTypes);
  var NguoiPhuThuoc = _NguoiPhuThuoc(sequelize, DataTypes);
  var PhuCap = _PhuCap(sequelize, DataTypes);
  var TaiKhoan = _TaiKhoan(sequelize, DataTypes);
  var ThangLuong = _ThangLuong(sequelize, DataTypes);
  var VaiTro = _VaiTro(sequelize, DataTypes);

  ChiTietBangLuong.belongsTo(BangLuong, { as: "MaBangLuong_bang_luong", foreignKey: "MaBangLuong"});
  BangLuong.hasMany(ChiTietBangLuong, { as: "chi_tiet_bang_luongs", foreignKey: "MaBangLuong"});
  LichLamViec.belongsTo(CaLam, { as: "MaCaLam_ca_lam", foreignKey: "MaCaLam"});
  CaLam.hasMany(LichLamViec, { as: "lich_lam_viecs", foreignKey: "MaCaLam"});
  TaiKhoan.belongsTo(ChiNhanh, { as: "MaCN_chi_nhanh", foreignKey: "MaCN"});
  ChiNhanh.hasMany(TaiKhoan, { as: "tai_khoans", foreignKey: "MaCN"});
  ChamCong.belongsTo(ChiTietBangLuong, { as: "MaCTBL_chi_tiet_bang_luong", foreignKey: "MaCTBL"});
  ChiTietBangLuong.hasMany(ChamCong, { as: "cham_congs", foreignKey: "MaCTBL"});
  ChamCong.belongsTo(LichLamViec, { as: "MaLLV_lich_lam_viec", foreignKey: "MaLLV"});
  LichLamViec.hasMany(ChamCong, { as: "cham_congs", foreignKey: "MaLLV"});
  KhenThuongKyLuat.belongsTo(LichLamViec, { as: "MaLLV_lich_lam_viec", foreignKey: "MaLLV"});
  LichLamViec.hasMany(KhenThuongKyLuat, { as: "khen_thuong_ky_luats", foreignKey: "MaLLV"});
  BangLuong.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(BangLuong, { as: "bang_luongs", foreignKey: "MaTK"});
  ChungChi.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(ChungChi, { as: "chung_chis", foreignKey: "MaTK"});
  HeSoPhuCap.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(HeSoPhuCap, { as: "he_so_phu_caps", foreignKey: "MaTK"});
  HopDongLd.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(HopDongLd, { as: "hop_dong_lds", foreignKey: "MaTK"});
  LichLamViec.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(LichLamViec, { as: "lich_lam_viecs", foreignKey: "MaTK"});
  LichSuTangLuong.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(LichSuTangLuong, { as: "lich_su_tang_luongs", foreignKey: "MaTK"});
  NgayNghiPhep.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(NgayNghiPhep, { as: "ngay_nghi_pheps", foreignKey: "MaTK"});
  NgayNghiPhep.belongsTo(TaiKhoan, { as: "NguoiDuyet_tai_khoan", foreignKey: "NguoiDuyet"});
  TaiKhoan.hasMany(NgayNghiPhep, { as: "NguoiDuyet_ngay_nghi_pheps", foreignKey: "NguoiDuyet"});
  NghiThaiSan.belongsTo(TaiKhoan, { as: "MaTK_tai_khoan", foreignKey: "MaTK"});
  TaiKhoan.hasMany(NghiThaiSan, { as: "nghi_thai_sans", foreignKey: "MaTK"});
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
    HeSoPhuCap,
    HopDongLd,
    KhenThuongKyLuat,
    LichLamViec,
    LichSuTangLuong,
    NgayNghiPhep,
    NghiThaiSan,
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
