const express = require('express');
const router = express.Router();
const bangLuongController = require('../controllers/bangLuongController');
// Create a new salary sheet
router.post('/', bangLuongController.create);

// Get all salary sheets
router.get('/', bangLuongController.findAll);

// Get salary sheet by ID
router.get('/:id', bangLuongController.findOne);

// Update salary sheet
router.put('/:id', bangLuongController.update);

// Delete salary sheet
router.delete('/:id', bangLuongController.delete);

// Calculate salary
router.post('/calculate', bangLuongController.calculateSalary);

router.post('/calculateV2', bangLuongController.calculateSalaryV2);

module.exports = router; 