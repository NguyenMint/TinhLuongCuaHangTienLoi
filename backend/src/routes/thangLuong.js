const express = require('express');
const route = express.Router();
const ThangLuongController = require('../controllers/ThangLuongController');
const { authMiddleware} = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authMiddleware');
route.get('/fulltime', ThangLuongController.getAllThangLuongFullTime);
route.get('/', ThangLuongController.getAll);
route.get('/:id', ThangLuongController.getById);
route.post('/',authMiddleware,authorizeRoles(3), ThangLuongController.create);
route.put('/:id',authMiddleware,authorizeRoles(3), ThangLuongController.update);
route.delete('/:id',authMiddleware,authorizeRoles(3), ThangLuongController.delete);

module.exports = route; 