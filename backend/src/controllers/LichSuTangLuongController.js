const db = require('../models');

exports.getByMaTK = async (req, res) => {
  try {
    const { MaTK } = req.params;
    const lichSu = await db.LichSuTangLuong.findAll({
      where: { MaTK },
      order: [['NgayApDung', 'DESC']]
    });
    res.status(200).json(lichSu);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
}; 