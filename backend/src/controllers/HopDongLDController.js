const db = require("../models");
const HopDong = db.HopDongLd;
class HopDongController{
    async getAll(req, res) {
    try {
      const hopdongs = await HopDong.findAll({});
      res.status(200).json(hopdongs);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
module.exports = new HopDongController();