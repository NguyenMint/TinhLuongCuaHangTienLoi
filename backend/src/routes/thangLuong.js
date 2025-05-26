const express = require('express');
const route = express.Router();
const ThangLuongController = require('../controllers/ThangLuongController');

route.get('/', ThangLuongController.getAll);
route.get('/:id', ThangLuongController.getById);
route.post('/', ThangLuongController.create);
route.put('/:id', ThangLuongController.update);
route.delete('/:id', ThangLuongController.delete);

module.exports = route; 