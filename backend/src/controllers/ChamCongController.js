const db = require("../models");
const ChamCong = db.ChamCong;
class ChamCongController {
  async create(req, res) {
    try {
      const chamCong = await ChamCong.create(req.body);
      return res.status(201).json(chamCong);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
module.exports = new ChamCongController();
