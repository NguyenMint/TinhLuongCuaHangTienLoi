const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ChiTietBangLuong', {
    MaCTBL: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    GioLamViecTrongNgay: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    TienLuongNgay: {
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
    LoaiPhuCap: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tongtien: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    MaBangLuong: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
