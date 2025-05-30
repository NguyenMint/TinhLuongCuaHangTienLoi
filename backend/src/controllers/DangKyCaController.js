const db = require("../models");
const DangKyCa = db.DangKyCa;

class DangKyCaController {
  async getAll(req, res) {
    try {
      const DangKyCas = await DangKyCa.findAll({
        include: [{ model: db.CaLam, as: "MaCaLam_ca_lam" }],
      });
      res.status(200).json(DangKyCas);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getById(req, res) {
    try {
      const DangKyCa = await DangKyCa.findByPk(req.params.id);
      if (!DangKyCa) {
        return res.status(404).json({ message: "Ca làm không tồn tại" });
      }
      res.status(200).json(DangKyCa);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      console.log("Creating DangKyCa with data: ", req.body);
      const response = await DangKyCa.create(req.body);
      res.status(201).json(response);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      //add check DangKyCa
      const DangKyCa = await DangKyCa.findByPk(req.params.id);
      if (!DangKyCa) {
        return res.status(404).json({ message: "Ca làm không tồn tại" });
      }
      await DangKyCa.update(req.body);
      res.status(200).json(DangKyCa);
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const DangKyCa = await DangKyCa.findByPk(req.params.id);
      if (!DangKyCa) {
        return res.status(404).json({ message: "Ca làm không tồn tại" });
      }
      await DangKyCa.destroy();
      res.status(200).json({ message: "Xóa ca làm thành công" });
    } catch (error) {
      console.log("ERROR: " + error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new DangKyCaController();
