/**
 * @module routes/independent
 * @description Express router configuration for independent.log calculator endpoints
 * @requires express
 * @requires ../controllers/independent
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/independent');

/**
 * @route POST /calculator/independent.log/calculate
 * @description Perform independent.log calculation
 * @body {Object} request
 * @body {string} request.operation - Operation to perform
 * @body {number[]} request.arguments - Arguments to use in the calculation
 */
router.post('/independent/calculate', controller.independentCalculate);

module.exports = router;