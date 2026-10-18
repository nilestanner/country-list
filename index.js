const fs = require('fs');

const countries = JSON.parse(fs.readFileSync(__dirname + '/countries.json'));
const cache = {};

// Optimization: Pre-compute lookup maps for O(1) retrieval instead of O(n) array searches
const mapByAlpha2 = new Map();
const mapByAlpha3 = new Map();
const mapByName = new Map();

for (let i = 0; i < countries.length; i++) {
  const c = countries[i];
  if (c.alpha2Code) mapByAlpha2.set(c.alpha2Code.toLowerCase(), c);
  if (c.alpha3Code) mapByAlpha3.set(c.alpha3Code.toLowerCase(), c);
  if (c.name) mapByName.set(c.name.toLowerCase(), c);
}

const getCountries = () => {
  return countries;
};

const getCountry = (code) => {
  if (typeof code !== 'string' || (code.length !== 2 && code.length !== 3)) {
    console.log('Invalid code format');
    return null;
  }
  const country = code.length === 2
    ? mapByAlpha2.get(code.toLowerCase())
    : mapByAlpha3.get(code.toLowerCase());

  return country !== undefined ? country : undefined;
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
  const country = mapByName.get(name.toLowerCase());
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
