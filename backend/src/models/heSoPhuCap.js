const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('HeSoPhuCap', {
    MaHSN: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Ngay: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    HeSoLuong: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    LoaiNgay: {
      type: DataTypes.ENUM('Cuối tuần','Ngày lễ'),
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
    tableName: 'he_so_phu_cap',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaHSN" },
        ]
      },
      {
        name: "MaTK",
        using: "BTREE",
        fields: [
          { name: "MaTK" },
        ]
      },
    ]
  });
};
