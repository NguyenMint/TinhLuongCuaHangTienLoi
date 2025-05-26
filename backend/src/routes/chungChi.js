const express = require('express');
const route = express.Router();
const ChungChiController = require('../controllers/ChungChiController');

route.get('/', ChungChiController.getAll);
route.get('/:id', ChungChiController.getById);
route.post('/', ChungChiController.create);
route.put('/:id', ChungChiController.update);
route.delete('/:id', ChungChiController.delete);

module.exports = route; 