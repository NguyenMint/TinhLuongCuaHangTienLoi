const TaiKhoanRoute = require('./taikhoan');
const ChiNhanhRoute = require('./chinhanh');
const phuCapRoute = require('./PhuCap');
const initRoutes = (app) =>{
    app.use("/taikhoan",TaiKhoanRoute);
    app.use("/chinhanh",ChiNhanhRoute);
    app.use("/phucap",phuCapRoute);
}
module.exports = initRoutes;