const db = require("../models");
const TaiKhoan = db.TaiKhoan;
class TaiKhoanController {
  async getAll(req, res) {
    try {
      const taikhoans = await TaiKhoan.findAll({});
      res.status(200).json(taikhoans);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getById(req,res){
    try {
        const {MaTK} = req.params;
      const taikhoan = await TaiKhoan.findByPk(MaTK);
      res.status(200).json(taikhoan);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
module.exports = new TaiKhoanController();
