const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function(app) {
  const convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get((req, res) => {
      let input = req.query.input;

      // Si aucun input fourni, on renvoie "invalid number and unit"
      if (!input) return res.send('invalid number and unit');

      // Récupération du nombre et de l’unité
      let initNum = convertHandler.getNum(input);
      let initUnit = convertHandler.getUnit(input);

      // Gestion des erreurs
      if (initNum === 'invalid number' && initUnit === 'invalid unit')
        return res.send('invalid number and unit');
      if (initNum === 'invalid number') return res.send('invalid number');
      if (initUnit === 'invalid unit') return res.send('invalid unit');

      // Conversion
      let returnNum = convertHandler.convert(initNum, initUnit);
      let returnUnit = convertHandler.getReturnUnit(initUnit);

      // Génération de la string finale
      let string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

      // Retour JSON
      res.json({
        initNum,
        initUnit,
        returnNum,
        returnUnit,
        string
      });
    });
};
