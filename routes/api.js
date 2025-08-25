// routes/api.js
'use strict';

const express = require('express');
const router = express.Router();
const convert = require('../controllers/convertHandler');

router.get('/convert', (req, res) => {
  const input = req.query.input ? req.query.input.trim() : '';

  const numRes = convert.parseNumber(input);
  const unitRes = convert.parseUnit(input);

  const numError = numRes.error;
  const unitError = unitRes.error;

  if (numError && unitError) return res.send('invalid number and unit');
  if (numError) return res.send('invalid number');
  if (unitError) return res.send('invalid unit');

  const initNum = numRes.value;
  const initUnit = unitRes.value;
  const returnUnit = convert.getReturnUnit(initUnit);
  const returnNum = convert.convertNumber(initNum, initUnit);

  const initUnitOut = initUnit === 'l' ? 'L' : initUnit;
  const responseString = convert.buildString(initNum, initUnit, returnNum, returnUnit);

  res.json({
    initNum: initNum,
    initUnit: initUnitOut,
    returnNum: returnNum,
    returnUnit: returnUnit,
    string: responseString
  });
});

module.exports = router;
