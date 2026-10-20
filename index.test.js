const test = require('node:test');
const assert = require('node:assert');
const { getCountries, getCountry, getNames, getCodes, getCode } = require('./index.js');

test('getCountries returns all countries', () => {
  const countries = getCountries();
  assert.ok(Array.isArray(countries));
  assert.ok(countries.length > 0);
  assert.strictEqual(countries[0].name, 'Afghanistan');
});

test('getCountry returns correct country for valid code', () => {
  const country2 = getCountry('AF');
  assert.ok(country2);
  assert.strictEqual(country2.name, 'Afghanistan');

  const country3 = getCountry('AFG');
  assert.ok(country3);
  assert.strictEqual(country3.name, 'Afghanistan');
});

test('getCountry is case insensitive', () => {
  const countryLower2 = getCountry('af');
  assert.ok(countryLower2);
  assert.strictEqual(countryLower2.name, 'Afghanistan');

  const countryLower3 = getCountry('afg');
  assert.ok(countryLower3);
  assert.strictEqual(countryLower3.name, 'Afghanistan');
});

test('getCountry returns undefined for not found code', () => {
  const result = getCountry('ZZ');
  assert.strictEqual(result, undefined);
});

test('getCountry handles invalid formats', () => {
  // Save original console.log
  const originalLog = console.log;
  let logCalled = false;
  console.log = (msg) => { logCalled = true; };

  try {
    const res1 = getCountry(null);
    assert.strictEqual(res1, null);
    assert.ok(logCalled);

    logCalled = false;
    const res2 = getCountry('A');
    assert.strictEqual(res2, null);
    assert.ok(logCalled);

    logCalled = false;
    const res3 = getCountry('AAAA');
    assert.strictEqual(res3, null);
    assert.ok(logCalled);
  } finally {
    // Restore console.log
    console.log = originalLog;
  }
});

test('getNames returns a list of names and caches result', () => {
  const names = getNames();
  assert.ok(Array.isArray(names));
  assert.ok(names.length > 0);
  assert.ok(names.includes('Afghanistan'));

  // Calling again should return the cached array
  const namesAgain = getNames();
  assert.strictEqual(names, namesAgain);
});

test('getCodes returns correct codes and caches result', () => {
  const codes2 = getCodes(2);
  assert.ok(Array.isArray(codes2));
  assert.ok(codes2.includes('AF'));

  const codes2Again = getCodes(2);
  assert.strictEqual(codes2, codes2Again);

  const codes3 = getCodes(3);
  assert.ok(Array.isArray(codes3));
  assert.ok(codes3.includes('AFG'));

  const codes3Again = getCodes(3);
  assert.strictEqual(codes3, codes3Again);
});

test('getCodes handles invalid code types and defaults to 2', () => {
  const originalLog = console.log;
  let logCalled = false;
  console.log = (msg) => { logCalled = true; };

  try {
    const invalidCodes = getCodes(4);
    assert.ok(logCalled);
    assert.ok(Array.isArray(invalidCodes));
    assert.ok(invalidCodes.includes('AF'));
  } finally {
    console.log = originalLog;
  }
});

test('getCode returns correct code for country name', () => {
  const code2 = getCode('Afghanistan');
  assert.strictEqual(code2, 'AF');

  const code3 = getCode('Afghanistan', 3);
  assert.strictEqual(code3, 'AFG');
});

test('getCode is case insensitive', () => {
  const codeLower = getCode('afghanistan');
  assert.strictEqual(codeLower, 'AF');
});

test('getCode returns null for unknown country', () => {
  const code = getCode('UnknownCountry');
  assert.strictEqual(code, null);
});

test('getCode handles invalid name types gracefully', { todo: 'getCode missing type validation' }, () => {
  assert.strictEqual(getCode(null), null);
  assert.strictEqual(getCode(undefined), null);
  assert.strictEqual(getCode(123), null);
});
