const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('HopDongLd', {
    MaHDLD: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenHD: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    File: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "File"
    },
    NgayKy: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    NgayBatDau: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    NgayKetThuc: {
      type: DataTypes.DATEONLY,
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
    tableName: 'hop_dong_ld',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaHDLD" },
        ]
      },
      {
        name: "File",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "File" },
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
