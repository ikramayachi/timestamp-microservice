// routes/api.js
'use strict';

const express = require('express');
const router = express.Router();
const convert = require('../controllers/convertHandler');

router.get('/convert', (req, res) => {
  const input = typeof req.query.input === 'string' ? req.query.input.trim() : '';

  const numRes = convert.parseNumber(input);
  const unitRes = convert.parseUnit(input);

  const numError = numRes && numRes.error;
  const unitError = unitRes && unitRes.error;

  if (numError && unitError) {
    return res.send('invalid number and unit');
  } else if (numError) {
    return res.send('invalid number');
  } else if (unitError) {
    return res.send('invalid unit');
  }

  const initNum = numRes.value;
  const initUnitKey = unitRes.value; // normalized lower-case like 'l' or 'kg'
  const initUnitOut = initUnitKey === 'l' ? 'L' : initUnitKey; // show 'L' uppercase
  const returnUnit = convert.getReturnUnit(initUnitKey);
  const returnNum = convert.convertNumber(initNum, initUnitKey);

  const responseString = convert.buildString(initNum, initUnitKey, returnNum, returnUnit);

  return res.json({
    initNum: initNum,
    initUnit: initUnitOut,
    returnNum: returnNum,
    returnUnit: returnUnit,
    string: responseString
  });
});

module.exports = router;
