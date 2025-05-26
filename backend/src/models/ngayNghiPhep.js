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
    LoaiPhep: {
      type: DataTypes.STRING(100),
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
    LyDo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    NgayDangKy: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    NguoiDuyet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tai_khoan',
        key: 'MaTK'
      }
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
      {
        name: "NguoiDuyet",
        using: "BTREE",
        fields: [
          { name: "NguoiDuyet" },
        ]
      },
    ]
  });
};
