const cache = {};

// Optimization: Lazy load countries to improve module require time.
// Reading large JSON files at module load blocks the event loop.
let countries;
const getCountriesData = () => {
  if (!countries) countries = require('./countries.json');
  return countries;
};

// Optimization: Pre-compute lookup maps for O(1) retrieval instead of O(n) array searches
// Plain objects with null prototype are used for faster lookups in V8 engine
// Maps are populated lazily to improve module require time
let mapByAlpha2;
let mapByAlpha3;
let mapByName;

const initMaps = () => {
  if (mapByAlpha2) return;
  const data = getCountriesData();
  mapByAlpha2 = Object.create(null);
  mapByAlpha3 = Object.create(null);
  mapByName = Object.create(null);

  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    if (c.alpha2Code) mapByAlpha2[c.alpha2Code.toLowerCase()] = c;
    if (c.alpha3Code) mapByAlpha3[c.alpha3Code.toLowerCase()] = c;
    if (c.name) mapByName[c.name.toLowerCase()] = c;
  }
};

const getCountries = () => {
  return getCountriesData();
};

const getCountry = (code) => {
  if (typeof code !== 'string' || (code.length !== 2 && code.length !== 3)) {
    console.log('Invalid code format');
    return null;
  }
  initMaps();
  const country = code.length === 2
    ? mapByAlpha2[code.toLowerCase()]
    : mapByAlpha3[code.toLowerCase()];

  return country || null;
};

const getNames = () => {
  if (!cache.names) {
    cache.names = getCountriesData().map(country => country.name);
  }
  return cache.names;
};

const getCodes = (codeType = 2) => {
  if (codeType !== 2 && codeType !== 3) {
    codeType = 2;
    console.log('Invalid code type provided defaulting to 2 character codes');
  }
  switch (codeType) {
    case 2:
      if (!cache.twoCodes) {
        cache.twoCodes = getCountriesData().map(country => country.alpha2Code);
      }
      return cache.twoCodes;
    case 3:
      if (!cache.threeCodes) {
        cache.threeCodes = getCountriesData().map(country => country.alpha3Code);
      }
      return cache.threeCodes;
    default:
      return [];
  }
};

const getCode = (name, codeType = 2) => {
  initMaps();
  const key = codeType === 3 ? 'alpha3Code' : 'alpha2Code';
  const country = mapByName[name.toLowerCase()];
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
