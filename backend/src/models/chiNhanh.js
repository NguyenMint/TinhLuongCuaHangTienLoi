const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ChiNhanh', {
    MaCN: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenChiNhanh: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "TenChiNhanh"
    },
    DiaChi: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "DiaChi"
    }
  }, {
    sequelize,
    tableName: 'chi_nhanh',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaCN" },
        ]
      },
      {
        name: "DiaChi",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "DiaChi" },
        ]
      },
      {
        name: "TenChiNhanh",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "TenChiNhanh" },
        ]
      },
    ]
  });
};
