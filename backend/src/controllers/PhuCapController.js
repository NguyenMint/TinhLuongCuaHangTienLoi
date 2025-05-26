const db = require('../models');
const PhuCap = db.PhuCap;
class PhuCapController {
    async getAll (req,res){
        try {
            const PhuCaps = await PhuCap.findAll({});
            res.status(200).json(PhuCaps);
        } catch (error) {
            console.log("ERROR: "+ error);
        }
    }
}
module.exports = new PhuCapController();