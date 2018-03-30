const fs = require('fs');

const countries = JSON.parse(fs.readFileSync('countries.json'));

const getCountries = () => {
  return countries;
};

module.exports = {
  getCountries
};
