const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('NguoiPhuThuoc', {
    MaNPT: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    HoTen: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    NgaySinh: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    DiaChi: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    SoDienThoai: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: "SoDienThoai"
    },
    CCCD: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: "CCCD"
    },
    TruongHopPhuThuoc: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    QuanHe: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    MaTK: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tai_khoan',
        key: 'MaTK'
      }
    }
  }, {
    sequelize,
    tableName: 'nguoi_phu_thuoc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaNPT" },
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
        name: "MaNV",
        using: "BTREE",
        fields: [
          { name: "MaTK" },
        ]
      },
    ]
  });
};
