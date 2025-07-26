require("dotenv").config();
const { where } = require("sequelize");
const db = require("../models");
const path = require("path");
const fs = require("fs");
const { Op } = db.Sequelize;
const TaiKhoan = db.TaiKhoan;
const NguoiPhuThuoc = db.NguoiPhuThuoc;
const ChiNhanh = db.ChiNhanh;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { log } = require("console");
const { getSoNgayTrongThang } = require("../util/util");

async function generateMaNhanVien(LoaiNV, MaVaiTro) {
  let prefix = "";

  if (MaVaiTro == 1) {
    prefix = "QL";
  } else if (LoaiNV === "PartTime") {
    prefix = "PT";
  } else if (LoaiNV === "FullTime") {
    prefix = "FT";
  } else {
    throw new Error("Loại nhân viên không hợp lệ");
  }

  const whereCondition =
    prefix === "QL"
      ? { MaVaiTro: 1, MaNhanVien: { [Op.like]: `${prefix}%` } }
      : { LoaiNV, MaNhanVien: { [Op.like]: `${prefix}%` } };

  const last = await TaiKhoan.findOne({
    where: whereCondition,
    order: [["MaNhanVien", "DESC"]],
  });

  let nextNumber = 1;
  if (last && last.MaNhanVien) {
    const lastNumber = parseInt(last.MaNhanVien.slice(2));
    if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(4, "0")}`;
}

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
  async getAllNhanVienVaQuanLy(req, res) {
    try {
      const taikhoans = await TaiKhoan.findAll({
        where: { MaVaiTro: { [Op.in]: [2, 1] } },
        include: [
          { model: db.VaiTro, as: "MaVaiTro_vai_tro" },
          { model: db.ChiNhanh, as: "MaCN_chi_nhanh" },
        ],
      });
      res.status(200).json(taikhoans);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getById(req, res) {
    try {
      const { MaTK } = req.params;
      const user = await TaiKhoan.findByPk(MaTK,{
        include:[
          {
            model:ChiNhanh,
            as:"MaCN_chi_nhanh"
          }
        ]
      });
      const result = {
        MaTK: user.MaTK,
        Email: user.Email,
        HoTen: user.HoTen,
        GioiTinh: user.GioiTinh,
        NgaySinh: user.NgaySinh,
        DiaChi: user.DiaChi,
        SoDienThoai: user.SoDienThoai,
        CCCD: user.CCCD,
        Avatar: user.Avatar,
        LoaiNV: user.LoaiNV,
        TenNganHang: user.TenNganHang,
        STK: user.STK,
        TrangThai: user.TrangThai,
        BacLuong: user.Bacluong,
        LuongCoBanHienTai: user.LuongCoBanHienTai,
        SoNgayNghiPhep: user.SoNgayNghiPhep,
        SoNgayChuaNghi: user.SoNgayChuaNghi,
        MaCN: user.MaCN,
        QuanLyBoi: user.QuanLyBoi,
        MaVaiTro: user.MaVaiTro,
        TenChiNhanh: user.MaCN_chi_nhanh?.TenChiNhanh,
        DiaChiCN: user.MaCN_chi_nhanh?.DiaChi,
      };
      res.status(200).json(result);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getAllQuanLyByChiNhanh(req, res) {
    const { MaCN } = req.params;
    try {
      const taikhoans = await TaiKhoan.findAll({
        where: { MaCN, MaVaiTro: 1 },
      });
      res.status(200).json(taikhoans);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async create(req, res) {
    try {
      const { CCCD, STK, Email, SoNgayNghiPhep, LoaiNV, MaVaiTro } = req.body;
      const deleteUploadedFile = () => {
        if (req.file) {
          const filePath = path.join(
            __dirname,
            "../../uploads/avatars",
            req.file.filename
          );
          fs.unlink(filePath, (err) => {
            if (err) console.error("Không thể xóa file:", err);
          });
        }
      };
      const MaNhanVien = await generateMaNhanVien(LoaiNV, MaVaiTro);
      const existCCCD = await TaiKhoan.findOne({ where: { CCCD } });
      const existCCCDNPT = await NguoiPhuThuoc.findOne({ where: { CCCD } });
      if (existCCCD || existCCCDNPT) {
        deleteUploadedFile();
        return res.status(409).json({ message: "Đã tồn tại CCCD này rồi" });
      }
      const existSTK = await TaiKhoan.findOne({ where: { STK } });
      if (existSTK) {
        deleteUploadedFile();
        return res.status(409).json({ message: "Đã tồn tại STK này rồi" });
      }
      const existEmail = await TaiKhoan.findOne({ where: { Email } });
      if (existEmail) {
        deleteUploadedFile();
        return res.status(409).json({ message: "Đã tồn tại Email này rồi" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "Vui lòng upload avatar" });
      }
      const avatarPath = path.join("uploads/avatars/", req.file.filename);
      const hashedPassword = await bcrypt.hash("1", 10);
      const newTaiKhoan = await TaiKhoan.create({
        ...req.body,
        MaNhanVien,
        Avatar: avatarPath,
        STK,
        Email,
        Password: hashedPassword,
        TrangThai: "Đang làm",
        SoNgayNghiPhep: SoNgayNghiPhep,
        SoNgayChuaNghi: SoNgayNghiPhep,
      });
      return res.status(201).json(newTaiKhoan);
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async update(req, res) {
    try {
      const { MaTK } = req.params;
      const taikhoan = await TaiKhoan.findByPk(MaTK);
      if (!taikhoan) {
        return res.status(404).json({ message: "Không tồn tại tài khoản này" });
      }
      const updateData = { ...req.body };
      const deleteUploadedFile = () => {
        if (req.file) {
          const filePath = path.join(
            __dirname,
            "../../",
            req.file.filename
          );
          fs.unlink(filePath, (err) => {
            if (err) console.error("Không thể xóa file:", err);
          });
        }
      };
      if (req.CCCD) {
        const existCCCD = await TaiKhoan.findOne({
          where: { CCCD: req.body.CCCD, MaTK: { [Op.ne]: MaTK } },
        });
        const existCCCDNPT = await NguoiPhuThuoc.findOne({
          where: { CCCD: req.body.CCCD },
        });
        if (existCCCD || existCCCDNPT) {
          deleteUploadedFile();
          return res.status(409).json({ message: "Đã tồn tại CCCD này rồi" });
        }
      }
      if (req.body.STK) {
        const existSTK = await TaiKhoan.findOne({
          where: { STK: req.body.STK, MaTK: { [Op.ne]: MaTK } },
        });
        if (existSTK) {
          deleteUploadedFile();
          return res.status(409).json({ message: "Đã tồn tại STK này rồi" });
        }
      }
      if (req.body.Email) {
        const existEmail = await TaiKhoan.findOne({
          where: { Email: req.body.Email, MaTK: { [Op.ne]: MaTK } },
        });
        if (existEmail) {
          deleteUploadedFile();
          return res.status(409).json({ message: "Đã tồn tại Email này rồi" });
        }
      }
      if (req.file) {
        const oldAvatarPath = path.join(__dirname, "../../", taikhoan.Avatar);
        fs.unlink(oldAvatarPath, (err) => {
          if (err) console.error("Không thể xóa avatar cũ:", err);
        });
        updateData.Avatar = path.join("uploads/avatars", req.file.filename);
      }
      const isPartTime = taikhoan.LoaiNV === 'PartTime';

      console.log("updateData.BacLuong: " ,updateData.BacLuong, "taikhoan.BacLuong: " ,taikhoan.BacLuong); 
      console.log("updateData.LuongCoBanHienTai: " ,updateData.LuongCoBanHienTai, "taikhoan.LuongCoBanHienTai: " ,taikhoan.LuongCoBanHienTai); 
      if (isPartTime) {
        if (updateData.LuongTheoGioHienTai !== undefined && taikhoan.LuongTheoGioHienTai != updateData.LuongTheoGioHienTai) {
          await db.LichSuTangLuong.create({
            MaTK: taikhoan.MaTK,
            LuongTheoGioCu: taikhoan.LuongTheoGioHienTai,
            LuongTheoGioMoi: updateData.LuongTheoGioHienTai,
            NgayApDung: new Date()
          });
        }
      } else {
        if ((Number(updateData.BacLuong) !== undefined && Number(taikhoan.BacLuong) != Number(updateData.BacLuong)) ||
            (Number(updateData.LuongCoBanHienTai) !== undefined && Number(taikhoan.LuongCoBanHienTai) != Number(updateData.LuongCoBanHienTai))) {
          await db.LichSuTangLuong.create({
            MaTK: taikhoan.MaTK,
            BacLuongCu: taikhoan.BacLuong,
            BacLuongMoi: updateData.BacLuong !== undefined ? updateData.BacLuong : taikhoan.BacLuong,
            LuongCoBanCu: taikhoan.LuongCoBanHienTai,
            LuongTheoGioCu: taikhoan.LuongTheoGioHienTai,
            LuongTheoGioMoi: updateData.LuongTheoGioHienTai !== undefined ? updateData.LuongTheoGioHienTai : taikhoan.LuongTheoGioHienTai,
            LuongCoBanMoi: updateData.LuongCoBanHienTai !== undefined ? updateData.LuongCoBanHienTai : taikhoan.LuongCoBanHienTai,
            NgayApDung: new Date()
          });
        }
      }
      await taikhoan.update(updateData);


      res.status(200).json(taikhoan);
    } catch (error) {
      console.error("Lỗi khi update tài khoản:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async searchEmployee(req, res) {
    try {
      const { keyword } = req.query;

      const filterTK = await TaiKhoan.findAll({
        where: {
          [Op.or]: [
            { MaNhanVien: { [Op.like]: `%${keyword}%` } },
            { HoTen: { [Op.like]: `%${keyword}%` } },
          ],
        },
      });
      res.status(200).json(filterTK);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async login(req, res) {
    try {
      const { MaNhanVien, Password } = req.body;

      const user = await TaiKhoan.findOne({
        where: { MaNhanVien },
        include: [{ model: db.ChiNhanh, as: "MaCN_chi_nhanh" }],
      });
      if (!user) {
        return res.status(404).json({ message: "Mã nhân viên không tồn tại" });
      }
      const isMatch = await bcrypt.compare(Password, user.Password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu không đúng" });
      }
      const payload = {
        MaTK: user.MaTK,
        Email: user.Email,
        HoTen: user.HoTen,
        GioiTinh: user.GioiTinh,
        NgaySinh: user.NgaySinh,
        DiaChi: user.DiaChi,
        SoDienThoai: user.SoDienThoai,
        CCCD: user.CCCD,
        Avatar: user.Avatar,
        LoaiNV: user.LoaiNV,
        TenNganHang: user.TenNganHang,
        STK: user.STK,
        TrangThai: user.TrangThai,
        BacLuong: user.Bacluong,
        LuongCoBanHienTai: user.LuongCoBanHienTai,
        SoNgayNghiPhep: user.SoNgayNghiPhep,
        SoNgayChuaNghi: user.SoNgayChuaNghi,
        MaCN: user.MaCN,
        QuanLyBoi: user.QuanLyBoi,
        MaVaiTro: user.MaVaiTro,
        TenChiNhanh: user.MaCN_chi_nhanh?.TenChiNhanh,
        DiaChiCN: user.MaCN_chi_nhanh?.DiaChi,
      };

      const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).json({ access_token, user: payload });
    } catch (error) {
      console.error("ERROR:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async resetMK(req, res) {
    try {
      const { MaTK } = req.params;
      const taiKhoan = await TaiKhoan.findByPk(MaTK);
      if (!taiKhoan) {
        return res
          .status(404)
          .json({ messeage: "Không tồn tại tài khoản này" });
      }
      const newPass = await bcrypt.hash("1", 10);
      await taiKhoan.update({
        Password: newPass,
      });
      res.status(200).json({ message: "Reset password thành công" });
    } catch (error) {
      console.error("ERROR:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async changePass(req, res) {
    try {
      const { Password, NewPassword } = req.body;
      const taiKhoan = await TaiKhoan.findByPk(req.params.MaTK);
      if (!taiKhoan) {
        return res.status(404).json({ messeage: "Tài khoản không tồn tại" });
      }
      const isMatch = await bcrypt.compare(Password, taiKhoan.Password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu không đúng" });
      }
      const newPass = await bcrypt.hash(NewPassword, 10);
      await taiKhoan.update({
        Password: newPass,
      });
      res.status(200).json({ message: "Thay đổi password thành công" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async updateNgungLamViec(req, res) {
    try {
      const { MaTK } = req.body;
      const taikhoan = await TaiKhoan.findByPk(MaTK);
      await taikhoan.update({ TrangThai: "Ngừng làm việc" });
      res.status(200).json(taikhoan);
    } catch (error) {
      console.error("Lỗi khi update tài khoản:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async updateTiepTucLamViec(req, res) {
    try {
      const { MaTK } = req.body;
      const taikhoan = await TaiKhoan.findByPk(MaTK);
      console.log(taikhoan);

      await taikhoan.update({ TrangThai: "Đang làm" });
      res.status(200).json(taikhoan);
    } catch (error) {
      console.error("Lỗi khi update tài khoản:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new TaiKhoanController();
