const db = require('../models');
const ChungChi = db.ChungChi;

class ChungChiController {
    async getAll(req, res) {
        try {
            const chungChis = await ChungChi.findAll({});
            res.status(200).json(chungChis);
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getById(req, res) {
        try {
            const chungChi = await ChungChi.findByPk(req.params.id);
            if (!chungChi) {
                return res.status(404).json({ message: "Chứng chỉ không tồn tại" });
            }
            res.status(200).json(chungChi);
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async create(req, res) {
        try {
            const chungChi = await ChungChi.create(req.body);
            res.status(201).json(chungChi);
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async update(req, res) {
        try {
            const chungChi = await ChungChi.findByPk(req.params.id);
            if (!chungChi) {
                return res.status(404).json({ message: "Chứng chỉ không tồn tại" });
            }
            await chungChi.update(req.body);
            res.status(200).json(chungChi);
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async delete(req, res) {
        try {
            const chungChi = await ChungChi.findByPk(req.params.id);
            if (!chungChi) {
                return res.status(404).json({ message: "Chứng chỉ không tồn tại" });
            }
            await chungChi.destroy();
            res.status(200).json({ message: "Xóa chứng chỉ thành công" });
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new ChungChiController(); 