const express = require('express');
const route = express.Router();
const HeSoPhuCapController = require('../controllers/HeSoPhuCapController');

route.get('/', HeSoPhuCapController.getAll);
route.get('/:id', HeSoPhuCapController.getById);
route.post('/', HeSoPhuCapController.create);
route.put('/:id', HeSoPhuCapController.update);
route.delete('/:id', HeSoPhuCapController.delete);

module.exports = route; 