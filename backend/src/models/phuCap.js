const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PhuCap', {
    MaPhuCap: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    LoaiPhuCap: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    GiaTriPhuCap: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    TrangThai: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'phu_cap',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaPhuCap" },
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
