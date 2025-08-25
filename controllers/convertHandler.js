function ConvertHandler() {

  this.getNum = function(input) {
    let numStr = input.match(/^[\d/.]+/);
    numStr = numStr ? numStr[0] : '';
    if (!numStr) return 1; // Default to 1
    if ((numStr.match(/\//g) || []).length > 1) return 'invalid number';
    if (numStr.includes('/')) {
      const [numerator, denominator] = numStr.split('/');
      if (!numerator || !denominator) return 'invalid number';
      return parseFloat(numerator) / parseFloat(denominator);
    }
    return parseFloat(numStr);
  };

  this.getUnit = function(input) {
    let unitStr = input.match(/[a-zA-Z]+$/);
    if (!unitStr) return 'invalid unit';
    unitStr = unitStr[0];
    const validUnits = ['gal','l','mi','km','lbs','kg'];
    if (!validUnits.includes(unitStr.toLowerCase())) return 'invalid unit';
    return unitStr.toLowerCase() === 'l' ? 'L' : unitStr.toLowerCase();
  };

  this.getReturnUnit = function(initUnit) {
    const map = { gal:'L', L:'gal', lbs:'kg', kg:'lbs', mi:'km', km:'mi' };
    return map[initUnit];
  };

  this.spellOutUnit = function(unit) {
    const spellMap = { gal:'gallons', L:'liters', lbs:'pounds', kg:'kilograms', mi:'miles', km:'kilometers' };
    return spellMap[unit];
  };

  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;

    switch(initUnit) {
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
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;
