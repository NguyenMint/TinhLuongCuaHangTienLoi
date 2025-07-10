const { where } = require('sequelize');
const db = require('../models');
const CaLam = db.CaLam;
const {Op} = db.Sequelize;
class CaLamController {
    async getAll(req, res) {
        try {
            const caLams = await CaLam.findAll({});
            res.status(200).json(caLams);
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async create(req, res) {
        try {
            const {TenCa} = req.body;
            const existTenCaLam = await CaLam.findOne({where:{TenCa}});
            if(existTenCaLam){
                return res.status(409).json({message:"Tên ca làm đã tồn tại"});
            }
            const caLam = await CaLam.create(req.body);
            res.status(201).json(caLam);
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async update(req, res) {
        try {
            const caLam = await CaLam.findByPk(req.params.id);
            if (!caLam) {
                return res.status(404).json({ message: "Ca làm không tồn tại" });
            }
            const {TenCa} = req.body;
            const existTenCaLam = await CaLam.findOne({where:{TenCa,MaCa:{[Op.ne]:req.params.id}}});
            if(existTenCaLam){
                return res.status(409).json({message:"Tên ca làm đã tồn tại"});
            }
            await caLam.update(req.body);
            res.status(200).json(caLam);
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async delete(req, res) {
        try {
            const caLam = await CaLam.findByPk(req.params.id);
            if (!caLam) {
                return res.status(404).json({ message: "Ca làm không tồn tại" });
            }
            
            await caLam.destroy();
            res.status(200).json({ message: "Xóa ca làm thành công" });
        } catch (error) {
            console.log("ERROR: " + error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new CaLamController(); 