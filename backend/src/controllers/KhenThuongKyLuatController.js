const db = require('../models');
const KhenThuongKyLuat = db.KhenThuongKyLuat;
class KhenThuongKyLuatController{
    async getAll(req, res) {
    try {
        const khenthuongkyluat = await KhenThuongKyLuat.findAll({});
        res.status(200).json(khenthuongkyluat);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async create(req,res){
    try {
        const khenthuongkyluat = await KhenThuongKyLuat.create(req.body);
        res.status(201).json(khenthuongkyluat);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async update(req,res){
    try {
        const {MaKTKL} = req.params;
        const khenthuongkyluat = await KhenThuongKyLuat.findByPk(MaKTKL);
        if(!khenthuongkyluat){
          return res.status(404).json({message:"Không tồn tại khen thưởng kỷ luật này"});
        }
        await khenthuongkyluat.update(req.body);
        res.status(200).json(khenthuongkyluat);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async delete(req,res){
    try {
        const {MaKTKL} = req.params;
        const khenthuongkyluat = await KhenThuongKyLuat.findByPk(MaKTKL);
        if(!khenthuongkyluat){
          return res.status(404).json({message:"Không tồn tại khen thưởng kỷ luật này"});
        }
        await khenthuongkyluat.destroy();
        res.status(200).json({message:"Xóa thành công"});
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
module.exports = new KhenThuongKyLuatController();