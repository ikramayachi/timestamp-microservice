// controllers/convertHandler.js
'use strict';

const toFixed5 = (num) => Number(Number(num).toFixed(5));

const VALID_UNITS = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];

const SPELL_OUT = {
  gal: 'gallons',
  l: 'liters',
  mi: 'miles',
  km: 'kilometers',
  lbs: 'pounds',
  kg: 'kilograms'
};

const CONV_FACTORS = {
  gal: 3.78541,
  l: 1 / 3.78541,
  lbs: 0.453592,
  kg: 1 / 0.453592,
  mi: 1.60934,
  km: 1 / 1.60934
};

function parseNumber(input) {
  if (!input) return { value: 1 };

  const idx = input.search(/[a-zA-Z]/);
  const numStr = idx === -1 ? input : input.slice(0, idx);

  if (numStr === '') return { value: 1 };

  if ((numStr.match(/\//g) || []).length > 1) return { error: 'invalid number' };

  if (numStr.includes('/')) {
    const [num, den] = numStr.split('/');
    const n = parseFloat(num);
    const d = parseFloat(den);
    if (isNaN(n) || isNaN(d)) return { error: 'invalid number' };
    return { value: n / d };
  } else {
    const v = parseFloat(numStr);
    if (isNaN(v)) return { error: 'invalid number' };
    return { value: v };
  }
}

function parseUnit(input) {
  const idx = input.search(/[a-zA-Z]/);
  const unitStr = idx === -1 ? '' : input.slice(idx).toLowerCase();

  if (!unitStr || !VALID_UNITS.includes(unitStr)) return { error: 'invalid unit' };
  return { value: unitStr };
}

function getReturnUnit(initUnit) {
  const map = { gal: 'L', l: 'gal', mi: 'km', km: 'mi', lbs: 'kg', kg: 'lbs' };
  return map[initUnit.toLowerCase()];
}

function spellOutUnit(unit) {
  return SPELL_OUT[unit.toLowerCase()];
}

function convertNumber(initNum, initUnit) {
  return toFixed5(initNum * CONV_FACTORS[initUnit.toLowerCase()]);
}

function buildString(initNum, initUnit, returnNum, returnUnit) {
  const initUnitStr = spellOutUnit(initUnit);
  const returnUnitStr = spellOutUnit(returnUnit);
  return `${initNum} ${initUnitStr} converts to ${returnNum} ${returnUnitStr}`;
}

module.exports = {
  parseNumber,
  parseUnit,
  getReturnUnit,
  spellOutUnit,
  convertNumber,
  buildString
};
