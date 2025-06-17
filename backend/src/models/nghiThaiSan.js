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
      type: DataTypes.ENUM('Ch? duy?t','?ang ngh?','?ã k?t thúc','?ã duy?t'),
      allowNull: false
    },
    FileGiayThaiSan: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    LuongNghiPhep: {
      type: DataTypes.DECIMAL(15,2),
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
    ]
  });
};
