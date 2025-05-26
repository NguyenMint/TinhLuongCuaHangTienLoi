const db = require('../models');
const ChiNhanh = db.ChiNhanh;
class ChiNhanhController {
    async getAll (req,res){
        try {
            const chinhanhs = await ChiNhanh.findAll({});
            res.status(200).json(chinhanhs);
        } catch (error) {
            console.log("ERROR: "+ error);
        }
    }
}
module.exports = new ChiNhanhController();