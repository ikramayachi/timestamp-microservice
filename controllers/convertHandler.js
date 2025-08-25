function ConvertHandler() {

  // Lire le nombre
  this.getNum = function(input) {
    const numRegex = /^[\d.\/]+/; 
    const numStr = input.match(numRegex) ? input.match(numRegex)[0] : '';
    
    if(numStr === '') return 1; // défaut 1

    if ((numStr.match(/\//g) || []).length > 1) return 'invalid number'; // double fraction

    if (numStr.includes('/')) {
      const numbers = numStr.split('/');
      if(numbers.length !== 2) return 'invalid number';
      return parseFloat(numbers[0]) / parseFloat(numbers[1]);
    } 
    return parseFloat(numStr);
  };

  // Lire l'unité
  this.getUnit = function(input) {
    const unitRegex = /[a-zA-Z]+$/;
    let unit = input.match(unitRegex) ? input.match(unitRegex)[0] : '';
    const validUnits = ['gal','l','L','mi','km','lbs','kg'];

    if (!validUnits.includes(unit.toLowerCase()) && unit !== 'L') return 'invalid unit';
    return (unit.toLowerCase() === 'l') ? 'L' : unit.toLowerCase();
  };

  // Retourner l'unité de conversion
  this.getReturnUnit = function(initUnit) {
    const map = { gal:'L', L:'gal', lbs:'kg', kg:'lbs', mi:'km', km:'mi' };
    return map[initUnit];
  };

  // Nom complet de l'unité
  this.spellOutUnit = function(unit) {
    const spellMap = { gal:'gallons', L:'liters', lbs:'pounds', kg:'kilograms', mi:'miles', km:'kilometers' };
    return spellMap[unit];
  };

  // Conversion
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

  // Construire la chaîne de conversion
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;
