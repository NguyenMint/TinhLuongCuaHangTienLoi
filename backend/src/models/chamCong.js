const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ChamCong', {
    MaChamCong: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NgayChamCong: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    GioVao: {
      type: DataTypes.TIME,
      allowNull: true
    },
    GioRa: {
      type: DataTypes.TIME,
      allowNull: true
    },
    DiTre: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VeSom: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MaDKC: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dang_ky_ca',
        key: 'MaDKC'
      }
    },
    NgayLe: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    trangthai: {
      type: DataTypes.ENUM('Chờ duyệt','Hoàn thoành','Từ chối'),
      allowNull: false
    },
    MaCTBL: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chi_tiet_bang_luong',
        key: 'MaCTBL'
      }
    }
  }, {
    sequelize,
    tableName: 'cham_cong',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaChamCong" },
        ]
      },
      {
        name: "fk_chamcong_dangkyca",
        using: "BTREE",
        fields: [
          { name: "MaDKC" },
        ]
      },
      {
        name: "MaCTBL",
        using: "BTREE",
        fields: [
          { name: "MaCTBL" },
        ]
      },
    ]
  });
};
