const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('NghiThaiSan', {
    MaNTS: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NgayBatDau: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    NgayKetThuc: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    TongSoNgayNghi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    TrangThai: {
      type: DataTypes.ENUM('Chờ duyệt','Đang nghỉ','Đã kết thúc','Đã duyệt'),
      allowNull: false
    },
    FileGiayThaiSan: {
      type: DataTypes.STRING(255),
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
    MaPhuCap: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'phu_cap',
        key: 'MaPhuCap'
      }
    }
  }, {
    sequelize,
    tableName: 'nghi_thai_san',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaNTS" },
        ]
      },
      {
        name: "nghi_thai_san_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "MaTK" },
        ]
      },
      {
        name: "fk_NghiThaiSan_PhuCap",
        using: "BTREE",
        fields: [
          { name: "MaPhuCap" },
        ]
      },
    ]
  });
};
