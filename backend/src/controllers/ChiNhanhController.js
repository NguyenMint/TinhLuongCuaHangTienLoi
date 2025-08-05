const { where } = require("sequelize");
const db = require("../models");
const {Op} = db.Sequelize;
const ChiNhanh = db.ChiNhanh;
class ChiNhanhController {
  async getAll(req, res) {
    try {
      const chinhanhs = await ChiNhanh.findAll({});
      res.status(200).json(chinhanhs);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async create(req, res) {
    try {
        const {TenChiNhanh,DiaChi} = req.body;
        const existTenChiNhanh = await ChiNhanh.findOne({where:{TenChiNhanh}});
        if(existTenChiNhanh){
            return res.status(409).json({message:"Tên chi nhánh đã tồn tại"});
        }
        const existDiaChi = await ChiNhanh.findOne({where:{DiaChi}});
        if(existDiaChi){
            return res.status(409).json({message:"Địa chỉ đã tồn tại"});
        }
      const chinhanh = await ChiNhanh.create(req.body);
      res.status(201).json(chinhanh);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async update(req,res){
    try {
      const {MaCN} = req.params;
      const chinhanh = await ChiNhanh.findByPk(MaCN);
      if(!chinhanh){
        return res.status(404).json({message:"Chi Nhánh không tồn tại"});
      }
      const {TenChiNhanh,DiaChi} = req.body;
        const existTenChiNhanh = await ChiNhanh.findOne({where:{TenChiNhanh,MaCN:{[Op.ne]:MaCN} }});
        if(existTenChiNhanh){
            return res.status(409).json({message:"Tên chi nhánh đã tồn tại"});
        }
        const existDiaChi = await ChiNhanh.findOne({where:{DiaChi,MaCN:{[Op.ne]:MaCN}}});
        if(existDiaChi){
            return res.status(409).json({message:"Địa chỉ đã tồn tại"});
        }
    await chinhanh.update(req.body);
      res.status(200).json(chinhanh);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async delete(req, res) {
    try {
      const {MaCN} = req.params;
      const chinhanh = await ChiNhanh.findByPk(MaCN);
      if(!chinhanh){
        return res.status(404).json({message:"Chi Nhánh không tồn tại"});
      }
      const nhanVien = await db.TaiKhoan.findOne({
        where:{MaCN}
      });
      if(nhanVien){
        return res.status(400).json({message:"Chi nhánh này đang có nhân viên, không thể xóa"});
      }
      await chinhanh.destroy();
      res.status(200).json({message:"Xóa thành công"});
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
module.exports = new ChiNhanhController();
