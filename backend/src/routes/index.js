const TaiKhoanRoute = require('./taikhoan');
const ChiNhanhRoute = require('./chinhanh');
const phuCapRoute = require('./PhuCap');
const chungChiRoute = require('./chungChi');
const thangLuongRoute = require('./thangLuong');
const caLamRoute = require('./caLam');
const heSoPhuCapRoute = require('./heSoPhuCap');

const initRoutes = (app) =>{
    app.use("/taikhoan",TaiKhoanRoute);
    app.use("/chinhanh",ChiNhanhRoute);
    app.use("/phucap",phuCapRoute);
    app.use("/chungchi",chungChiRoute);
    app.use("/thangluong",thangLuongRoute);
    app.use("/calam",caLamRoute);
    app.use("/hesophucap",heSoPhuCapRoute);
}

module.exports = initRoutes;