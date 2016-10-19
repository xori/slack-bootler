/***
  Example Usage:
    let bank = engine.brain('bank');
    bank['evan'] += 1000.00;
    engine.brain('bank', bank);

  Todo:
    - File saving
***/
const path = require('path');
const fs = require('fs-extra');
const pack = require('../package.json');
const config = require('./ConfigLoader')
const dbLocation = path.resolve(config.brain, 'brain.json');

fs.ensureFileSync(dbLocation);
let database = fs.readJsonSync(dbLocation, {throws: false}) || {};

module.exports = function(keyword, data) {
  database = fs.readJsonSync(dbLocation, {throws: false}) || {};
  if(data === undefined) {
    return database[keyword];
  }

  database[keyword] = data;
  fs.writeJsonSync(dbLocation, database);
  return data;
}
