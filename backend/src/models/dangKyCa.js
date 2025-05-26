const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DangKyCa', {
    MaDKC: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaNS: {
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
      type: DataTypes.ENUM('Đã Đăng Ký','Chờ Xác Nhận','Từ Chối','Hủy Ca','Chuyển Ca'),
      allowNull: false,
      defaultValue: "Chờ Xác Nhận"
    },
    NgayDangKy: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'dang_ky_ca',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaDKC" },
        ]
      },
      {
        name: "MaNS",
        using: "BTREE",
        fields: [
          { name: "MaNS" },
        ]
      },
      {
        name: "MaCaLam",
        using: "BTREE",
        fields: [
          { name: "MaCaLam" },
        ]
      },
    ]
  });
};
