const express = require("express");
const route = express.Router();
const CaLamController = require("../controllers/CaLamController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authMiddleware");
route.get("/", authMiddleware, CaLamController.getAll);
route.post("/", authMiddleware, authorizeRoles(3), CaLamController.create);
route.put("/:id", authMiddleware, authorizeRoles(3), CaLamController.update);
route.delete("/:id", authMiddleware, authorizeRoles(3), CaLamController.delete);

module.exports = route;
