const { NghiThaiSan, TaiKhoan } = require("../models/init-models")(require("../config/connectionDB"));
const path = require("path");

exports.createNghiThaiSan = async (req, res) => {
  try {
    const nts = await NghiThaiSan.create(req.body);
    res.status(201).json(nts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllNghiThaiSan = async (req, res) => {
  try {
    const list = await NghiThaiSan.findAll({ include: TaiKhoan });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNghiThaiSanByMaTK = async (req, res) => {
  try {
    const list = await NghiThaiSan.findAll({ where: { MaTK: req.params.MaTK } });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNghiThaiSan = async (req, res) => {
  try {
    const { id } = req.params;
    await NghiThaiSan.update(req.body, { where: { MaNTS: id } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteNghiThaiSan = async (req, res) => {
  try {
    await NghiThaiSan.destroy({ where: { MaNTS: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.uploadGiayThaiSan = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const filePath = path.join("uploads/giaythaisan", req.file.filename);
  res.json({ filePath });
}; 