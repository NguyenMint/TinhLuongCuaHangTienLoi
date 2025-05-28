const express = require('express');
const route = express.Router();
const ChungChiController = require('../controllers/ChungChiController');
const { uploadChungChi } = require('../middleware/upload');

route.get('/', ChungChiController.getAll);
route.get('/:id', ChungChiController.getById);
route.post('/', uploadChungChi.single('chungchi'), ChungChiController.create);
route.put('/:id', uploadChungChi.single('chungchi'), ChungChiController.update);
route.delete('/:id', ChungChiController.delete);

module.exports = route; 