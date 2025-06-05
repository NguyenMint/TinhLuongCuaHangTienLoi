const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BangLuong', {
    MaBangLuong: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TongPhuCap: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    TongThuong: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    TongPhat: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    TongGioLamViec: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    SoNguoiPhuThuoc: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    TongLuong: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    ThuNhapMienThue: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    ThuNhapChiuThue: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    MucGiamTruGiaCanh: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    ThueSuat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ThuePhaiDong: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    NgayTao: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    NgayThanhToan: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    LuongThucNhan: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    KyLuong: {
      type: DataTypes.CHAR(23),
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
    tableName: 'bang_luong',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaBangLuong" },
        ]
      },
      {
        name: "MaNS",
        using: "BTREE",
        fields: [
          { name: "MaTK" },
        ]
      },
    ]
  });
};
