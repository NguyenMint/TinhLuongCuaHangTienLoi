const db = require('../models');
const ChungChi = db.ChungChi;
const fs = require('fs');
const path = require('path');

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
//test
    async create(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Vui lòng tải lên file chứng chỉ" });
            }

            const filePath = `${req.file.filename}`;
            const chungChiData = {
                ...req.body,
                FileCC: filePath
            };

            const chungChi = await ChungChi.create(chungChiData);
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

            let updateData = { ...req.body };
            
            if (req.file) {
                // Delete old file if exists
                if (chungChi.FileCC) {
                    const oldFilePath = path.join(__dirname, '../../', chungChi.FileCC);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }
                updateData.FileCC = `${req.file.filename}`;
            }

            await chungChi.update(updateData);
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

            // Delete file if exists
            if (chungChi.FileCC) {
                const filePath = path.join(__dirname, '../../', chungChi.FileCC);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
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