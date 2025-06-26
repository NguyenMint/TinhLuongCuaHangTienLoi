const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('NgayNghiPhep', {
    MaNNP: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaTK: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tai_khoan',
        key: 'MaTK'
      }
    },
    NgayBatDau: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    NgayKetThuc: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    SoNgayNghi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    NgayDangKy: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    TrangThai: {
      type: DataTypes.ENUM('Chờ duyệt','Đã duyệt','Từ chối'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ngay_nghi_phep',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaNNP" },
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
