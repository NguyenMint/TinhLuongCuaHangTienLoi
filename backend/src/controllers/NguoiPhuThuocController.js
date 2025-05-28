const { where } = require('sequelize');
const db = require('../models');
const NguoiPhuThuoc = db.NguoiPhuThuoc;
const TaiKhoan = db.TaiKhoan;
class NguoiPhuThuocController {
    async getAll(req, res) {
    try {
      const nguoiphuthuoc = await NguoiPhuThuoc.findAll({});
      res.status(200).json(nguoiphuthuoc);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async create(req,res){
    const {CCCD} = req.body;
    if(CCCD){
        const existCCCD = await NguoiPhuThuoc.findOne({where:{CCCD}});
        const existCCCDTK = await TaiKhoan.findOne({where:{CCCD}});
        if(existCCCD || existCCCDTK){
            return res.json({message:"Đã tồn tại CCCD này rồi"});
        }
    }
    const nguoiphuthuoc = await NguoiPhuThuoc.create(req.body);
    res.status(200).json(nguoiphuthuoc);
  }
}
module.exports = new NguoiPhuThuocController();