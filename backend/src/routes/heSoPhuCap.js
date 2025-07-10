const express = require('express');
const route = express.Router();
const HeSoPhuCapController = require('../controllers/HeSoPhuCapController');
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authMiddleware");
route.get('/',authMiddleware, HeSoPhuCapController.getAll);
route.post('/',authMiddleware,authorizeRoles(3), HeSoPhuCapController.create);
route.put('/',authMiddleware,authorizeRoles(3), HeSoPhuCapController.update);
route.delete('/',authMiddleware,authorizeRoles(3), HeSoPhuCapController.delete);

module.exports = route; 