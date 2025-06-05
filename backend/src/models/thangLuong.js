const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ThangLuong', {
    MaThangLuong: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    LuongCoBan: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    LuongTheoGio: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    BacLuong: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: "BacLuong"
    },
    LoaiNV: {
      type: DataTypes.ENUM('PartTime','FullTime'),
      allowNull: false
    },
    SoNgayPhep: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MaVaiTro: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vai_tro',
        key: 'MaVaiTro'
      }
    }
  }, {
    sequelize,
    tableName: 'thang_luong',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaThangLuong" },
        ]
      },
      {
        name: "BacLuong",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "BacLuong" },
        ]
      },
      {
        name: "MaVaiTro",
        using: "BTREE",
        fields: [
          { name: "MaVaiTro" },
        ]
      },
    ]
  });
};
