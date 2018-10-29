const fs = require('fs');

const countries = JSON.parse(fs.readFileSync('countries.json'));
const cache = {};

const getCountries = () => {
  return countries;
};

const getCountry = (code) => {
  if (typeof code !== 'string' || (code.length !== 2 && code.length !== 3)) {
    console.log('Invalid code format');
    return null;
  }
  const key = code.length === 2 ? 'alpha2Code' : 'alpha3Code';
  return countries.find(country => country[key].toLowerCase() === code.toLowerCase());
};

const getNames = () => {
  if (!cache.names) {
    cache.names = countries.map(country => country.name);
  }
  return cache.names;
};

const getCodes = (codeType) => {
  if (codeType !== 2 && codeType !== 3) {
    codeType = 2;
    console.log('Invalid code type provided defaulting to 2 character codes');
  }
  switch (codeType) {
    case 2:
      if (!cache.twoCodes) {
        cache.twoCodes = countries.map(country => country.alpha2Code);
      }
      return cache.twoCodes;
    case 3:
      if (!cache.threeCodes) {
        cache.threeCodes = countries.map(country => country.alpha3Code);
      }
      return cache.threeCodes;
    default:
      return [];
  }
};

const getCode = (name, codeType = 2) => {
  const key = codeType === 3 ? 'alpha3Code' : 'alpha2Code';
  const country = countries.find(country => country.name.toLowerCase() === name.toLowerCase());
  if (country) {
    return country[key];
  } else {
    return null;
  }
};

module.exports = {
  getCountries,
  getCountry,
  getCodes,
  getCode,
  getNames
};
