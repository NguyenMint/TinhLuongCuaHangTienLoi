const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('KhenThuongKyLuat', {
    MaKTKL: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaLLV: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lich_lam_viec',
        key: 'MaLLV'
      }
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
        name: "MaLLV",
        using: "BTREE",
        fields: [
          { name: "MaLLV" },
        ]
      },
      {
        name: "MaLLV",
        using: "BTREE",
        fields: [
          { name: "MaLLV" },
        ]
      },
    ]
  });
};
