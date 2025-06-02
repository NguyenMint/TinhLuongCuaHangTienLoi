const SequelizeAuto = require('sequelize-auto');
require('dotenv').config();
const auto = new SequelizeAuto(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  directory: './src/models', 
  additional: {
    timestamps: false 
  },
  caseModel: 'p', 
  caseFile: 'c',  
  singularize: true, 
  lang: 'es5',
});

auto.run()
  .then(() => {
    console.log('✅ Generate model thành công!');
  })
  .catch(err => {
    console.error('❌ Lỗi khi generate model:', err);
  });
