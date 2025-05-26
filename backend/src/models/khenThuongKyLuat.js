const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('KhenThuongKyLuat', {
    MaKTKL: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NgayApDung: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ThuongPhat: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    LyDo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    MucThuongPhat: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    DuocMienThue: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'khen_thuong_ky_luat',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaKTKL" },
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
