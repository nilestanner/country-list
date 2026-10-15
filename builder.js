const request = require('request');
const fs = require('fs');
const equal = require('deep-equal');
const { convert, mergeByCode, FIELD_GROUPS } = require('./lib/convert');

const BASE_URL = 'https://restcountries.com/v3.1/all';
// Refuse to overwrite countries.json with a partial download.
const MIN_COUNTRIES = 200;

const get = (fields) => new Promise((resolve, reject) => {
  request(`${BASE_URL}?fields=${fields.join(',')}`, { json: true }, (err, res, body) => {
    if (err) return reject(err);
    if (res.statusCode !== 200 || !Array.isArray(body)) {
      return reject(new Error(`Unexpected response ${res.statusCode} for fields ${fields.join(',')}`));
    }
    resolve(body);
  });
});

Promise.all(FIELD_GROUPS.map(get)).then((responses) => {
  const body = mergeByCode(responses)
    .map(convert)
    .sort((a, b) => a.name.localeCompare(b.name));
  if (body.length < MIN_COUNTRIES) {
    throw new Error(`Only ${body.length} countries returned, not rebuilding JSON`);
  }
  const currentJson = JSON.parse(fs.readFileSync('countries.json'));
  if (equal(body, currentJson)) {
    console.log('No changes, not rebuilding JSON');
  } else {
    console.log('Changes found rebuilding JSON');
    fs.writeFileSync('countries.json', JSON.stringify(body, null, 2));
  }
}).catch((err) => {
  console.log(err);
  process.exit(1);
});
