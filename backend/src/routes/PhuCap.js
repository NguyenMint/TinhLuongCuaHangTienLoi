const express = require('express');
const route = express.Router();
const PhuCapController = require('../controllers/PhuCapController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authMiddleware');
route.get('/:MaTK',authMiddleware,PhuCapController.getAllByTK);
route.post('/',authMiddleware,authorizeRoles(1,3),PhuCapController.create);
route.delete('/:MaPhuCap',authMiddleware, authorizeRoles(1,3),PhuCapController.delete);
route.put('/:MaPhuCap',authMiddleware,authorizeRoles(1,3),PhuCapController.update);

module.exports = route;