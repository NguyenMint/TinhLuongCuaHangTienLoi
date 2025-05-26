const TaiKhoanRoute = require('./taikhoan');
const initRoutes = (app) =>{
    app.use("/taikhoan",TaiKhoanRoute);
}
module.exports = initRoutes;