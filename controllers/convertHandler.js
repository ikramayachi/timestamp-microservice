// controllers/convertHandler.js

'use strict';

const toFixed5 = (num) => Number(Number(num).toFixed(5));

const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];

const unitMap = {
  gal: 'L',
  l: 'gal',
  mi: 'km',
  km: 'mi',
  lbs: 'kg',
  kg: 'lbs'
};

const spellOut = {
  gal: 'gallons',
  l: 'liters',
  mi: 'miles',
  km: 'kilometers',
  lbs: 'pounds',
  kg: 'kilograms'
};

const CONV = {
  gal: 3.78541,    // gal -> L
  l: 1 / 3.78541,  // L -> gal (inverse)
  lbs: 0.453592,   // lbs -> kg
  kg: 1 / 0.453592, // kg -> lbs
  mi: 1.60934,     // mi -> km
  km: 1 / 1.60934  // km -> mi
};

function getNum(input) {
  if (!input) return { error: 'invalid number' };

  // find first letter - unit starts there
  const match = input.match(/[a-zA-Z]/);
  const idx = match ? match.index : input.length;
  let numStr = input.slice(0, idx).trim();

  if (numStr === '') {
    // default to 1
    return { value: 1 };
  }

  // check for multiple slashes
  const slashCount = (numStr.match(/\//g) || []).length;
  if (slashCount > 1) return { error: 'invalid number' };

  let value;
  try {
    if (slashCount === 1) {
      const [num, den] = numStr.split('/');
      if (num === '' || den === '') return { error: 'invalid number' };
      const n = parseFloat(num);
      const d = parseFloat(den);
      if (isNaN(n) || isNaN(d)) return { error: 'invalid number' };
      value = n / d;
    } else {
      const v = parseFloat(numStr);
      if (isNaN(v)) return { error: 'invalid number' };
      value = v;
    }
  } catch (e) {
    return { error: 'invalid number' };
  }

  return { value };
}

function getUnit(input) {
  if (!input) return { error: 'invalid unit' };
  const match = input.match(/[a-zA-Z]/);
  const idx = match ? match.index : input.length;
  let unitStr = input.slice(idx).trim();
  if (!unitStr) return { error: 'invalid unit' };

  // accept case-insensitive, allow 'L' or 'l'
  const unitLower = unitStr.toLowerCase();

  // make normalized key: for 'l' return 'l', others as lower case
  if (unitLower === 'l' || unitLower === 'lt' || unitLower === 'liter' || unitLower === 'liters') {
    // only 'L' or 'l' expected by tests, so normalize to 'l'
    if (validUnits.includes('l')) return { value: 'l' };
  }

  if (validUnits.includes(unitLower)) return { value: unitLower };

  return { error: 'invalid unit' };
}

function getReturnUnit(initUnit) {
  const key = initUnit.toLowerCase();
  if (!unitMap[key]) return null;
  // unitMap returns 'L' for gal and 'gal' for l, etc.
  // but our internal canonical keys use lower-case 'l'
  const ret = unitMap[key];
  // make sure we return 'L' uppercase for liters, per spec
  if (ret.toLowerCase() === 'l') return 'L';
  return ret.toLowerCase();
}

function spellOutUnit(unit) {
  const key = unit.toLowerCase();
  return spellOut[key] || null;
}

function convert(initNum, initUnit) {
  const key = initUnit.toLowerCase();
  const factor = CONV[key];
  if (factor === undefined) return null;
  const result = initNum * factor;
  return toFixed5(result);
}

function buildString(initNum, initUnit, returnNum, returnUnit) {
  const initUnitString = spellOutUnit(initUnit);
  const returnUnitString = spellOutUnit(returnUnit);
  return `${initNum} ${initUnitString} converts to ${returnNum} ${returnUnitString}`;
}

module.exports = {
  getNum,
  getUnit,
  getReturnUnit,
  spellOutUnit,
  convert,
  buildString
};
