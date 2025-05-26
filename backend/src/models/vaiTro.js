const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('VaiTro', {
    MaVaiTro: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Quyen: {
      type: DataTypes.ENUM('QuanLy','NhanVien'),
      allowNull: false,
      unique: "Quyen"
    }
  }, {
    sequelize,
    tableName: 'vai_tro',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaVaiTro" },
        ]
      },
      {
        name: "Quyen",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Quyen" },
        ]
      },
    ]
  });
};
