const { where } = require("sequelize");
const db = require("../models");
const TaiKhoan = db.TaiKhoan;
const NguoiPhuThuoc = db.NguoiPhuThuoc;
class TaiKhoanController {
  async getAll(req, res) {
    try {
      const taikhoans = await TaiKhoan.findAll({});
      res.status(200).json(taikhoans);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getById(req,res){
    try {
        const {MaTK} = req.params;
      const taikhoan = await TaiKhoan.findByPk(MaTK);
      res.status(200).json(taikhoan);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async create (req, res) {
  try {
    const {
      HoTen, GioiTinh, NgaySinh, DiaChi, SoDienThoai, CCCD,
      LoaiNV, TenNganHang, STK, TrangThai, Email, Password,
      BacLuong, LuongCoBanHienTai, SoNgayNghiPhep, SoNgayChuaNghi,
      MaVaiTro, MaCN, QuanLyBoi
    } = req.body;
    const existCCCD = await TaiKhoan.findOne({where:{CCCD}});
    const existCCCDNPT = await NguoiPhuThuoc.findOne({where:{CCCD}});
    if(existCCCD || existCCCDNPT){
      return res.status(409).json({message:"Đã tồn tại CCCD này rồi"});
    }
    const existSTK = await NguoiPhuThuoc.findOne({where:{STK}});
    if(existSTK){
      return res.status(409).json({message:"Đã tồn tại CCCD này rồi"})
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng upload avatar' });
    }

    const avatarPath = path.join('uploads/avatars/', req.file.filename);
    const newTaiKhoan = await TaiKhoan.create({
      HoTen,
      GioiTinh,
      NgaySinh,
      DiaChi,
      SoDienThoai,
      CCCD,
      Avatar: avatarPath,
      LoaiNV,
      TenNganHang,
      STK,
      TrangThai,
      Email,
      Password,
      BacLuong,
      LuongCoBanHienTai,
      SoNgayNghiPhep,
      SoNgayChuaNghi,
      MaVaiTro,
      MaCN,
      QuanLyBoi
    });

    return res.status(201).json(newTaiKhoan);

  } catch (error) {
    console.error('Lỗi khi tạo tài khoản:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo tài khoản', error: error.message });
  }
};
}
module.exports = new TaiKhoanController();
