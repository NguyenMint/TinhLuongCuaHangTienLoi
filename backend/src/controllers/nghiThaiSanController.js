const db = require("../models");
const path = require("path");
const fs = require("fs");

class NghiThaiSanController {
  async createNghiThaiSan(req, res) {
    try {
      const { MaTK, LuongNghiPhep } = req.body;

      const phuCapThaiSan = {
        MaTK,
        LoaiPhuCap: "Phụ cấp Thai sản",
        GiaTriPhuCap: LuongNghiPhep,
        TrangThai: 1,
        DuocMienThue: 1,
      };
      const phucap = await db.PhuCap.create(phuCapThaiSan);

      req.body.MaPhuCap = phucap.MaPhuCap;

      const nts = await db.NghiThaiSan.create(req.body);

      res.status(201).json(nts);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAllNghiThaiSan(req, res) {
    try {
      const list = await db.NghiThaiSan.findAll({ include: db.TaiKhoan });

      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getNghiThaiSanByMaTK(req, res) {
    try {
      const list = await db.NghiThaiSan.findAll({
        where: { MaTK: req.params.MaTK },
        include: [{ model: db.PhuCap, as: "MaPhuCap_phu_cap" }],
      });
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateNghiThaiSan(req, res) {
    try {
      const { id } = req.params;

      const nts = await db.NghiThaiSan.findOne({ where: { MaNTS: id } });
      if (!nts) {
        return res.status(404).json({ message: "Nghỉ thai sản không tồn tại" });
      }
      let updateData = { ...req.body };

      if (req.FileGiayThaiSan !== nts.FileGiayThaiSan) {
        if (nts.FileGiayThaiSan) {
          const oldFilePath = path.join(
            __dirname,
            "../../",
            nts.FileGiayThaiSan
          );

          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }

      await db.NghiThaiSan.update(updateData, { where: { MaNTS: id } });

      // Cập nhật phụ cấp thai sản nếu có
      if (req.body.MaPhuCap) {
        await db.PhuCap.update(
          { GiaTriPhuCap: req.body.LuongNghiPhep },
          {
            where: { MaPhuCap: req.body.MaPhuCap },
          }
        );
      }

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteNghiThaiSan(req, res) {
    try {
      const nts = await db.NghiThaiSan.findOne({
        where: { MaNTS: req.params.id },
      });

      await db.NghiThaiSan.destroy({ where: { MaNTS: req.params.id } });

      if (nts.MaPhuCap) {
        await db.PhuCap.destroy({ where: { MaPhuCap: nts.MaPhuCap } });
      }

      const oldNTSPath = path.join(__dirname, "../../", nts.FileGiayThaiSan);
      fs.unlink(oldNTSPath, (err) => {
        if (err) console.error("Không thể xóa giấy tờ cũ:", err);
      });

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async uploadGiayThaiSan(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const filePath = path.join("uploads/giaythaisan", req.file.filename);
      res.json({ filePath });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new NghiThaiSanController();
