const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LichSuTangLuong', {
    MaLSTL: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    LuongCoBanCu: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    LuongCoBanMoi: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    BacLuongCu: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BacLuongMoi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NgayApDung: {
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
    },
    LuongTheoGioCu: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    LuongTheoGioMoi: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'lich_su_tang_luong',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaLSTL" },
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
