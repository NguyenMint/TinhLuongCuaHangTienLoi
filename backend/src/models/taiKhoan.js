const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TaiKhoan', {
    MaTK: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaNhanVien: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    HoTen: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    GioiTinh: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    NgaySinh: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    DiaChi: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    SoDienThoai: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: "SoDienThoai"
    },
    CCCD: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: "CCCD"
    },
    Avatar: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "Avatar"
    },
    LoaiNV: {
      type: DataTypes.ENUM('PartTime','FullTime','Mangager'),
      allowNull: false
    },
    TenNganHang: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    STK: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: "STK"
    },
    TrangThai: {
      type: DataTypes.ENUM('Đang làm','Ngừng làm việc','Thai sản'),
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "Email"
    },
    Password: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    BacLuong: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    LuongCoBanHienTai: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    LuongTheoGioHienTai: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    SoNgayNghiPhep: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    SoNgayChuaNghi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    MaVaiTro: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vai_tro',
        key: 'MaVaiTro'
      }
    },
    MaCN: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chi_nhanh',
        key: 'MaCN'
      }
    },
    QuanLyBoi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tai_khoan',
        key: 'MaTK'
      }
    }
  }, {
    sequelize,
    tableName: 'tai_khoan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaTK" },
        ]
      },
      {
        name: "SoDienThoai",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "SoDienThoai" },
        ]
      },
      {
        name: "CCCD",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "CCCD" },
        ]
      },
      {
        name: "Avatar",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Avatar" },
        ]
      },
      {
        name: "STK",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "STK" },
        ]
      },
      {
        name: "Email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Email" },
        ]
      },
      {
        name: "MaVaiTro",
        using: "BTREE",
        fields: [
          { name: "MaVaiTro" },
        ]
      },
      {
        name: "MaCN",
        using: "BTREE",
        fields: [
          { name: "MaCN" },
        ]
      },
      {
        name: "QuanLyBoi",
        using: "BTREE",
        fields: [
          { name: "QuanLyBoi" },
        ]
      },
    ]
  });
};
