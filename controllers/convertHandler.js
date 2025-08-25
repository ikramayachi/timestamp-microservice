function ConvertHandler() {
  
  this.getNum = function(input) {
    let result;
    const numRegex = /^[\d.\/]+/;
    const numStr = input.match(numRegex) ? input.match(numRegex)[0] : '';
    
    if (numStr === '') return 1; // défaut à 1

    if ((numStr.match(/\//g) || []).length > 1) return 'invalid number';

    if (numStr.includes('/')) {
      const numbers = numStr.split('/');
      result = parseFloat(numbers[0]) / parseFloat(numbers[1]);
    } else {
      result = parseFloat(numStr);
    }

    return result;
  };
  
  this.getUnit = function(input) {
    const unitRegex = /[a-zA-Z]+$/;
    let unit = input.match(unitRegex) ? input.match(unitRegex)[0] : '';
    const validUnits = ['gal','l','L','mi','km','lbs','kg'];

    if (!validUnits.includes(unit.toLowerCase()) && unit !== 'L') return 'invalid unit';
    if (unit.toLowerCase() === 'l') return 'L';
    return unit.toLowerCase();
  };
  
  this.getReturnUnit = function(initUnit) {
    const map = { gal: 'L', L: 'gal', lbs: 'kg', kg: 'lbs', mi: 'km', km: 'mi' };
    return map[initUnit];
  };

  this.spellOutUnit = function(unit) {
    const spellMap = { gal: 'gallons', L: 'liters', lbs: 'pounds', kg: 'kilograms', mi: 'miles', km: 'kilometers' };
    return spellMap[unit];
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;

    switch (initUnit) {
      case 'gal': result = initNum * galToL; break;
      case 'L': result = initNum / galToL; break;
      case 'lbs': result = initNum * lbsToKg; break;
      case 'kg': result = initNum / lbsToKg; break;
      case 'mi': result = initNum * miToKm; break;
      case 'km': result = initNum / miToKm; break;
      default: result = null;
    }

    return parseFloat(result.toFixed(5));
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    const initUnitString = this.spellOutUnit(initUnit);
    const returnUnitString = this.spellOutUnit(returnUnit);
    return `${initNum} ${initUnitString} converts to ${returnNum} ${returnUnitString}`;
  };
}

module.exports = ConvertHandler;
