const db = require('../models');
const ThangLuong = db.ThangLuong;

class ThangLuongController {
    async getAll(req, res) {
        try {
            const thangLuongs = await ThangLuong.findAll({});
            res.status(200).json(thangLuongs);
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getById(req, res) {
        try {
            const thangLuong = await ThangLuong.findByPk(req.params.id);
            if (!thangLuong) {
                return res.status(404).json({ message: "Thang lương không tồn tại" });
            }
            res.status(200).json(thangLuong);
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async create(req, res) {
        try {
            const thangLuong = await ThangLuong.create(req.body);
            res.status(201).json(thangLuong);
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async update(req, res) {
        try {
            const thangLuong = await ThangLuong.findByPk(req.params.id);
            if (!thangLuong) {
                return res.status(404).json({ message: "Thang lương không tồn tại" });
            }
            await thangLuong.update(req.body);
            res.status(200).json(thangLuong);
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async delete(req, res) {
        try {
            const thangLuong = await ThangLuong.findByPk(req.params.id);
            if (!thangLuong) {
                return res.status(404).json({ message: "Thang lương không tồn tại" });
            }
            await thangLuong.destroy();
            res.status(200).json({ message: "Xóa thang lương thành công" });
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new ThangLuongController(); 