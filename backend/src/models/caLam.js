const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CaLam', {
    MaCa: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenCa: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "TenCa"
    },
    ThoiGianBatDau: {
      type: DataTypes.TIME,
      allowNull: false
    },
    ThoiGianKetThuc: {
      type: DataTypes.TIME,
      allowNull: false
    },
    MoTa: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isCaDem: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'ca_lam',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaCa" },
        ]
      },
      {
        name: "TenCa",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "TenCa" },
        ]
      },
    ]
  });
};
