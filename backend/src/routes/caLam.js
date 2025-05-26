const express = require('express');
const route = express.Router();
const CaLamController = require('../controllers/CaLamController');

route.get('/', CaLamController.getAll);
route.get('/:id', CaLamController.getById);
route.post('/', CaLamController.create);
route.put('/:id', CaLamController.update);
route.delete('/:id', CaLamController.delete);

module.exports = route; 