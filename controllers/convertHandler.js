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
  gal: 3.78541,   // gal -> L
  l: 1 / 3.78541, // L -> gal (inverse)
  lbs: 0.453592,  // lbs -> kg
  kg: 1 / 0.453592,
  mi: 1.60934,    // mi -> km
  km: 1 / 1.60934
};

function parseNumber(input) {
  if (input === undefined || input === null) return { error: 'invalid number' };
  // find index of first alpha char -> unit start
  const m = input.match(/[a-zA-Z]/);
  const idx = m ? m.index : input.length;
  let numStr = input.slice(0, idx).trim();

  if (numStr === '') return { value: 1 }; // default 1 when no number

  // More than one slash -> invalid
  const slashes = (numStr.match(/\//g) || []).length;
  if (slashes > 1) return { error: 'invalid number' };

  try {
    if (slashes === 1) {
      const [num, den] = numStr.split('/');
      if (num === '' || den === '') return { error: 'invalid number' };
      const n = parseFloat(num);
      const d = parseFloat(den);
      if (isNaN(n) || isNaN(d)) return { error: 'invalid number' };
      return { value: n / d };
    } else {
      const v = parseFloat(numStr);
      if (isNaN(v)) return { error: 'invalid number' };
      return { value: v };
    }
  } catch (e) {
    return { error: 'invalid number' };
  }
}

function parseUnit(input) {
  if (input === undefined || input === null) return { error: 'invalid unit' };
  const m = input.match(/[a-zA-Z]/);
  const idx = m ? m.index : input.length;
  let unitStr = input.slice(idx).trim();
  if (!unitStr) return { error: 'invalid unit' };

  const lower = unitStr.toLowerCase();

  // Accept either 'l' or 'L' but normalize to 'l' internally
  if (VALID_UNITS.includes(lower)) return { value: lower };
  return { error: 'invalid unit' };
}

function getReturnUnit(initUnit) {
  const key = initUnit.toLowerCase();
  if (key === 'gal') return 'L';
  if (key === 'l') return 'gal';
  if (key === 'mi') return 'km';
  if (key === 'km') return 'mi';
  if (key === 'lbs') return 'kg';
  if (key === 'kg') return 'lbs';
  return null;
}

function spellOutUnit(unit) {
  const key = unit.toLowerCase();
  return SPELL_OUT[key] || null;
}

function convertNumber(initNum, initUnit) {
  const key = initUnit.toLowerCase();
  const factor = CONV_FACTORS[key];
  if (factor === undefined) return null;
  return toFixed5(initNum * factor);
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
