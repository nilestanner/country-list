const request = require('request');
const fs = require('fs');
const equal = require('deep-equal');

request('https://restcountries.eu/rest/v2/all', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  const currentJson = JSON.parse(fs.readFileSync('countries.json'));
  if (equal(body, currentJson)) {
    console.log('No changes, not rebuilding JSON');
  } else {
    console.log('Changes found rebuilding JSON')
    fs.writeFileSync('countries.json',JSON.stringify(body, null, 2));
  }
});
