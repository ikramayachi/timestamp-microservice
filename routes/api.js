// routes/api.js

'use strict';

const express = require('express');
const router = express.Router();
const convertHandler = require('../controllers/convertHandler');

router.get('/convert', (req, res) => {
  const input = req.query.input;
  // If input is undefined, treat as empty string (will error)
  const inputValue = typeof input === 'string' ? input.trim() : '';

  const numResult = convertHandler.getNum(inputValue);
  const unitResult = convertHandler.getUnit(inputValue);

  const numError = numResult && numResult.error;
  const unitError = unitResult && unitResult.error;

  if (numError && unitError) {
    return res.send('invalid number and unit');
  } else if (numError) {
    return res.send('invalid number');
  } else if (unitError) {
    return res.send('invalid unit');
  }

  const initNum = convertHandler.getNum(inputValue).value;
  const initUnitKey = convertHandler.getUnit(inputValue).value; // normalized like 'l' or 'kg'
  // Format initUnit for output: 'L' uppercase for liters, others lowercase
  const initUnit = initUnitKey.toLowerCase() === 'l' ? 'L' : initUnitKey.toLowerCase();

  const returnUnit = convertHandler.getReturnUnit(initUnitKey);
  const returnNum = convertHandler.convert(initNum, initUnitKey);

  const resultString = convertHandler.buildString(initNum, initUnitKey, returnNum, returnUnit);

  res.json({
    initNum: initNum,
    initUnit: initUnit,
    returnNum: returnNum,
    returnUnit: returnUnit,
    string: resultString
  });
});

module.exports = router;
