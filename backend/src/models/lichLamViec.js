const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LichLamViec', {
    MaLLV: {
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
    MaCaLam: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ca_lam',
        key: 'MaCa'
      }
    },
    TrangThai: {
      type: DataTypes.ENUM('Đã Đăng Ký','Chờ Xác Nhận','Từ Chối','Hủy Ca','Chuyển Ca','Chờ Duyệt Chuyển Ca'),
      allowNull: false,
      defaultValue: "Chờ Xác Nhận"
    },
    NgayLam: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    MaLLVCu: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'lich_lam_viec',
        key: 'MaLLV'
      }
    }
  }, {
    sequelize,
    tableName: 'lich_lam_viec',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaLLV" },
        ]
      },
      {
        name: "MaNS",
        using: "BTREE",
        fields: [
          { name: "MaTK" },
        ]
      },
      {
        name: "MaCaLam",
        using: "BTREE",
        fields: [
          { name: "MaCaLam" },
        ]
      },
      {
        name: "MaLLVCu",
        using: "BTREE",
        fields: [
          { name: "MaLLVCu" },
        ]
      },
    ]
  });
};
