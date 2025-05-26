const TaiKhoanRoute = require('./taikhoan');
const ChiNhanhRoute = require('./chinhanh');
const initRoutes = (app) =>{
    app.use("/taikhoan",TaiKhoanRoute);
    app.use("/chinhanh",ChiNhanhRoute);
}
module.exports = initRoutes;