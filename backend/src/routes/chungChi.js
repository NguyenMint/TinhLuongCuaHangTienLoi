const express = require('express');
const route = express.Router();
const ChungChiController = require('../controllers/ChungChiController');
const { uploadChungChi } = require('../middleware/upload');
const {authMiddleware} = require('../middleware/authMiddleware');
const {authorizeRoles} = require('../middleware/authMiddleware');
route.get('/getbymatk/:matk',authMiddleware, ChungChiController.getByMaTK);
route.post('/',authMiddleware,authorizeRoles(1,3), uploadChungChi.single('chungchi'), ChungChiController.create);
route.put('/:id',authMiddleware,authorizeRoles(1,3), uploadChungChi.single('chungchi'), ChungChiController.update);
route.delete('/:id',authMiddleware,authorizeRoles(1,3), ChungChiController.delete);

module.exports = route; 