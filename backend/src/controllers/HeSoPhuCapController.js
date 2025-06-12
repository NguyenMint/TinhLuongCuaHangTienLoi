const { where } = require("sequelize");
const db = require("../models");
const HeSoPhuCap = db.HeSoPhuCap;
const TaiKhoan = db.TaiKhoan;
const {Op} = db.Sequelize;
class HeSoPhuCapController {
  async getAll(req, res) {
    try {
      const heSoPhuCaps = await HeSoPhuCap.findAll({});
      res.status(200).json(heSoPhuCaps);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getById(req, res) {
    try {
      const heSoPhuCap = await HeSoPhuCap.findByPk(req.params.id);
      if (!heSoPhuCap) {
        return res.status(404).json({ message: "Hệ số phụ cấp không tồn tại" });
      }
      res.status(200).json(heSoPhuCap);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      let { LoaiNgay, Ngay, HeSoLuong } = req.body;
      const existNgay = await HeSoPhuCap.findOne({
        where:{
          Ngay
        }
      });
      if(existNgay){
        return res.status(409).json({message:"Đã có hệ số phụ cấp cho ngày này rồi"});
      }
      if (LoaiNgay === "Cuối tuần") {
        const existHeSoCuoiTuan = await HeSoPhuCap.findOne({
          where: { LoaiNgay: "Cuối tuần" },
        });
        if (existHeSoCuoiTuan) {
          return res
            .status(409)
            .json({ message: "Đã có hệ số phụ cấp cuối tuần" });
        }
        Ngay = null;
      }
      const admin = await TaiKhoan.findOne({ where: { MaVaiTro: 3 } });
      const MaTK = admin.MaTK;
      const heSoPhuCap = await HeSoPhuCap.create({
        LoaiNgay,
        Ngay,
        HeSoLuong,
        MaTK,
      });
      res.status(201).json(heSoPhuCap);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const heSoPhuCap = await HeSoPhuCap.findByPk(req.params.id);
      if (!heSoPhuCap) {
        return res.status(404).json({ message: "Hệ số phụ cấp không tồn tại" });
      }
      let {Ngay,LoaiNgay,HeSoLuong} = (req.body);
      const existNgay = await HeSoPhuCap.findOne({
        where:{
          Ngay,
          MaHSN:{
            [Op.ne]:req.params.id
          }
        }
      });
      if(existNgay){
        return res.status(409).json({message:"Đã có hệ số phụ cấp cho ngày này rồi"});
      }
      if(LoaiNgay==="Cuối tuần"){
        Ngay=null;
      }
      await heSoPhuCap.update({
        Ngay,HeSoLuong
      });
      res.status(200).json(heSoPhuCap);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const heSoPhuCap = await HeSoPhuCap.findByPk(req.params.id);
      if (!heSoPhuCap) {
        return res.status(404).json({ message: "Hệ số phụ cấp không tồn tại" });
      }
      await heSoPhuCap.destroy();
      res.status(200).json({ message: "Xóa hệ số phụ cấp thành công" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new HeSoPhuCapController();
