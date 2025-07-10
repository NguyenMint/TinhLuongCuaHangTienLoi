const express = require('express');
const route = express.Router();
const ThangLuongController = require('../controllers/ThangLuongController');
const { authMiddleware} = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authMiddleware');
route.get('/fulltime',authMiddleware, ThangLuongController.getAllThangLuongFullTime);
route.get('/parttime',authMiddleware, ThangLuongController.getAllMauLuongPartTime);
route.get('/',authMiddleware, ThangLuongController.getAll);
route.post('/',authMiddleware,authorizeRoles(3), ThangLuongController.create);
route.put('/:id',authMiddleware,authorizeRoles(3), ThangLuongController.update);
route.delete('/:id',authMiddleware,authorizeRoles(3), ThangLuongController.delete);

module.exports = route; 