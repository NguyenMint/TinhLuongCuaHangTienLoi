const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ChungChi', {
    MaCC: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenCC: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    FileCC: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "FileCC"
    },
    NoiDaoTao: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    NgayCap: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    GhiChu: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    TrangThai: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'chung_chi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaCC" },
        ]
      },
      {
        name: "FileCC",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "FileCC" },
        ]
      },
      {
        name: "MaNS",
        using: "BTREE",
        fields: [
          { name: "MaTK" },
        ]
      },
    ]
  });
};
