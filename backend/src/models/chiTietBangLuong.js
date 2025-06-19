const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ChiTietBangLuong', {
    MaCTBL: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    GioLamViec: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    LuongMotGio: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    HeSoLuong: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    isCuoiTuan: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isNgayLe: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isCaDem: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    TienLuongCa: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    TienPhat: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    TienPhuCap: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    tongtien: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    Ngay: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    MaBangLuong: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'bang_luong',
        key: 'MaBangLuong'
      }
    }
  }, {
    sequelize,
    tableName: 'chi_tiet_bang_luong',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaCTBL" },
        ]
      },
      {
        name: "MaBangLuong",
        using: "BTREE",
        fields: [
          { name: "MaBangLuong" },
        ]
      },
    ]
  });
};
