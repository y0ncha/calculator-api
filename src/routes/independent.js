/**
 * @module routes/independent
 * @description Independent calculator endpoint definitions
 * @requires express
 * @requires ../controllers/independent
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/independent');

/**
 * @route POST /calculator/independent/calculate
 * @description Perform calculation with provided arguments
 */
router.post('/independent/calculate', controller.independentCalculate);

module.exports = router;