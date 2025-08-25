const chai = require('chai');
const assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler');

suite('Unit Tests', function() {
  test('Whole number input', function() {
    const input = '32L';
    const { value } = ConvertHandler.getNum(input);
    assert.equal(value, 32);
  });

  test('Decimal input', function() {
    const input = '3.1mi';
    const { value } = ConvertHandler.getNum(input);
    assert.equal(value, 3.1);
  });

  test('Fractional input', function() {
    const input = '1/2kg';
    const { value } = ConvertHandler.getNum(input);
    assert.equal(value, 0.5);
  });

  test('Fractional input with decimal', function() {
    const input = '4.5/1.5lbs';
    const { value } = ConvertHandler.getNum(input);
    assert.equal(value, 3);
  });

  test('Double-fraction should return error', function() {
    const input = '3/2/3kg';
    const result = ConvertHandler.getNum(input);
    assert.property(result, 'error');
    assert.equal(result.error, 'invalid number');
  });

  test('No numerical input defaults to 1', function() {
    const input = 'kg';
    const result = ConvertHandler.getNum(input);
    assert.equal(result.value, 1);
  });

  test('Valid input units', function() {
    const units = ['gal','l','mi','km','lbs','kg','GAL','L','Mi','KM','LBS','Kg'];
    units.forEach(u => {
      const result = ConvertHandler.getUnit('10' + u);
      assert.property(result, 'value');
    });
  });

  test('Invalid input unit', function() {
    const result = ConvertHandler.getUnit('32g');
    assert.property(result, 'error');
    assert.equal(result.error, 'invalid unit');
  });

  test('Return unit for each valid input', function() {
    assert.equal(ConvertHandler.getReturnUnit('gal'), 'L');
    assert.equal(ConvertHandler.getReturnUnit('l'), 'gal');
    assert.equal(ConvertHandler.getReturnUnit('mi'), 'km');
    assert.equal(ConvertHandler.getReturnUnit('km'), 'mi');
    assert.equal(ConvertHandler.getReturnUnit('lbs'), 'kg');
    assert.equal(ConvertHandler.getReturnUnit('kg'), 'lbs');
  });

  test('Spell out unit', function() {
    assert.equal(ConvertHandler.spellOutUnit('gal'), 'gallons');
    assert.equal(ConvertHandler.spellOutUnit('l'), 'liters');
    assert.equal(ConvertHandler.spellOutUnit('mi'), 'miles');
    assert.equal(ConvertHandler.spellOutUnit('km'), 'kilometers');
    assert.equal(ConvertHandler.spellOutUnit('lbs'), 'pounds');
    assert.equal(ConvertHandler.spellOutUnit('kg'), 'kilograms');
  });

  test('Convert gal to L', function() {
    const result = ConvertHandler.convert(1, 'gal');
    assert.approximately(result, 3.78541, 0.00001);
  });

  test('Convert L to gal', function() {
    const result = ConvertHandler.convert(3.78541, 'l');
    assert.approximately(result, 1, 0.00001);
  });

  test('Convert mi to km', function() {
    const result = ConvertHandler.convert(1, 'mi');
    assert.approximately(result, 1.60934, 0.00001);
  });

  test('Convert km to mi', function() {
    const result = ConvertHandler.convert(1.60934, 'km');
    assert.approximately(result, 1, 0.00001);
  });

  test('Convert lbs to kg', function() {
    const result = ConvertHandler.convert(1, 'lbs');
    assert.approximately(result, 0.453592, 0.00001);
  });

  test('Convert kg to lbs', function() {
    const result = ConvertHandler.convert(0.453592, 'kg');
    assert.approximately(result, 1, 0.00001);
  });
});
