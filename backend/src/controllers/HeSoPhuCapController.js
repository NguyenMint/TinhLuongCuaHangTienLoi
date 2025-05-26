const db = require('../models');
const HeSoPhuCap = db.HeSoPhuCap;

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
            const heSoPhuCap = await HeSoPhuCap.create(req.body);
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
            await heSoPhuCap.update(req.body);
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