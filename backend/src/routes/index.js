const TaiKhoanRoute = require('./taikhoan');
const ChiNhanhRoute = require('./chinhanh');
const phuCapRoute = require('./PhuCap');
const chungChiRoute = require('./chungChi');
const thangLuongRoute = require('./thangLuong');
const caLamRoute = require('./caLam');
const heSoPhuCapRoute = require('./heSoPhuCap');
const khenThuongKyLuatRoute = require("./khenthuongkyluat");
const NguoiPhuThuocRoute = require("./nguoiphuthuoc");
const initRoutes = (app) =>{
    app.use("/taikhoan",TaiKhoanRoute);
    app.use("/chinhanh",ChiNhanhRoute);
    app.use("/phucap",phuCapRoute);
    app.use("/chungchi",chungChiRoute);
    app.use("/thangluong",thangLuongRoute);
    app.use("/calam",caLamRoute);
    app.use("/hesophucap",heSoPhuCapRoute);
    app.use("/khenthuongkyluat",khenThuongKyLuatRoute);
    app.use("/nguoiphuthuoc",NguoiPhuThuocRoute);
}

module.exports = initRoutes;