// Converts a restcountries.com v3.1 record into the restcountries.eu v2 shape that
// countries.json (and therefore this package's public API) has always used.
//
// Fields v3.1 cannot supply are filled with the closest neutral value:
//   - languages[].iso639_1 is null (v3.1 only has ISO 639-3 codes) and nativeName repeats name
//   - regionalBlocs is []
// Callers should compare output against the existing countries.json before publishing.

const TRANSLATION_KEYS = {
  de: 'deu', es: 'spa', fr: 'fra', ja: 'jpn', it: 'ita',
  br: 'por', pt: 'por', nl: 'nld', hr: 'hrv', fa: 'per'
};

const callingCodes = (idd) => {
  if (!idd || !idd.root) return [];
  const root = idd.root.replace('+', '');
  const suffixes = idd.suffixes || [];
  // Countries that share a root across many area codes (e.g. +1) keep just the root, as v2 did.
  return suffixes.length === 1 ? [root + suffixes[0]] : [root];
};

const latestGini = (gini) => {
  if (!gini) return null;
  const years = Object.keys(gini).sort();
  return years.length ? gini[years[years.length - 1]] : null;
};

const first = (obj) => {
  const keys = Object.keys(obj || {});
  return keys.length ? obj[keys[0]] : undefined;
};

const convert = (c) => {
  const native = first(c.name.nativeName);
  const translations = {};
  Object.keys(TRANSLATION_KEYS).forEach((key) => {
    const t = c.translations && c.translations[TRANSLATION_KEYS[key]];
    if (t) translations[key] = t.common;
  });
  return {
    name: c.name.common,
    topLevelDomain: c.tld || [],
    alpha2Code: c.cca2,
    alpha3Code: c.cca3,
    callingCodes: callingCodes(c.idd),
    capital: (c.capital && c.capital[0]) || '',
    altSpellings: c.altSpellings || [],
    region: c.region === 'Antarctic' ? 'Polar' : (c.region || ''),
    subregion: c.subregion || '',
    population: c.population,
    latlng: c.latlng || [],
    demonym: (c.demonyms && c.demonyms.eng && c.demonyms.eng.m) || '',
    area: c.area,
    gini: latestGini(c.gini),
    timezones: c.timezones || [],
    borders: c.borders || [],
    nativeName: native ? native.common : c.name.common,
    numericCode: c.ccn3 || null,
    currencies: Object.keys(c.currencies || {}).map((code) => ({
      code,
      name: c.currencies[code].name,
      symbol: c.currencies[code].symbol
    })),
    languages: Object.keys(c.languages || {}).map((code) => ({
      iso639_1: null,
      iso639_2: code,
      name: c.languages[code],
      nativeName: c.languages[code]
    })),
    translations,
    flag: (c.flags && c.flags.svg) || '',
    regionalBlocs: [],
    cioc: c.cioc || ''
  };
};

// v3.1's /all endpoint requires a `fields` filter (capped at 10 fields per request), so the
// builder requests the fields in groups and merges the records by cca3.
const FIELDS = [
  'name', 'tld', 'cca2', 'idd', 'capital', 'altSpellings', 'region', 'subregion', 'population',
  'latlng', 'demonyms', 'area', 'gini', 'timezones', 'borders', 'ccn3', 'currencies',
  'languages', 'translations', 'flags', 'cioc'
];
const FIELD_GROUPS = [];
for (let i = 0; i < FIELDS.length; i += 9) {
  FIELD_GROUPS.push(['cca3'].concat(FIELDS.slice(i, i + 9)));
}

const mergeByCode = (responses) => {
  const merged = {};
  responses.forEach((list) => list.forEach((rec) => {
    merged[rec.cca3] = Object.assign(merged[rec.cca3] || {}, rec);
  }));
  return Object.keys(merged).map((k) => merged[k]);
};

module.exports = { convert, mergeByCode, FIELD_GROUPS };
