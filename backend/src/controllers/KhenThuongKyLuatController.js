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
}
module.exports = new KhenThuongKyLuatController();