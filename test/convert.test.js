const { describe, it } = require('node:test');
const assert = require('node:assert');
const { convert, mergeByCode, FIELD_GROUPS } = require('../lib/convert');
const existing = require('../countries.json');

// Hand-written restcountries.com v3.1 record (from the documented schema, NOT fetched live).
const canadaV3 = {
  name: { common: 'Canada', official: 'Canada', nativeName: { eng: { official: 'Canada', common: 'Canada' }, fra: { official: 'Canada', common: 'Canada' } } },
  tld: ['.ca'], cca2: 'CA', ccn3: '124', cca3: 'CAN', cioc: 'CAN',
  currencies: { CAD: { name: 'Canadian dollar', symbol: '$' } },
  idd: { root: '+1', suffixes: ['204', '226'] },
  capital: ['Ottawa'], altSpellings: ['CA'], region: 'Americas', subregion: 'North America',
  languages: { eng: 'English', fra: 'French' }, latlng: [60, -95],
  borders: ['USA'], area: 9984670, demonyms: { eng: { f: 'Canadian', m: 'Canadian' } },
  translations: { deu: { official: 'Kanada', common: 'Kanada' }, per: { official: 'x', common: 'کانادا' } },
  gini: { 2000: 33.1, 2017: 33.3 }, timezones: ['UTC-08:00'], population: 38005238,
  flags: { png: 'x.png', svg: 'https://flagcdn.com/ca.svg' }
};

describe('convert (v3.1 -> countries.json shape)', () => {
  const out = convert(canadaV3);

  it('produces exactly the keys used by countries.json, in the same order', () => {
    assert.deepStrictEqual(Object.keys(out), Object.keys(existing[0]));
  });

  it('maps scalar fields', () => {
    assert.strictEqual(out.name, 'Canada');
    assert.strictEqual(out.alpha2Code, 'CA');
    assert.strictEqual(out.alpha3Code, 'CAN');
    assert.strictEqual(out.numericCode, '124');
    assert.strictEqual(out.capital, 'Ottawa');
    assert.strictEqual(out.demonym, 'Canadian');
    assert.strictEqual(out.flag, 'https://flagcdn.com/ca.svg');
    assert.strictEqual(out.gini, 33.3, 'uses the most recent year');
    assert.deepStrictEqual(out.topLevelDomain, ['.ca']);
  });

  it('uses the bare root for shared calling codes and root+suffix for single-suffix ones', () => {
    assert.deepStrictEqual(out.callingCodes, ['1']);
    assert.deepStrictEqual(convert({ ...canadaV3, idd: { root: '+3', suffixes: ['51'] } }).callingCodes, ['351']);
    assert.deepStrictEqual(convert({ ...canadaV3, idd: {} }).callingCodes, []);
  });

  it('maps currencies and languages to arrays of objects', () => {
    assert.deepStrictEqual(out.currencies, [{ code: 'CAD', name: 'Canadian dollar', symbol: '$' }]);
    assert.deepStrictEqual(out.languages[0], { iso639_1: null, iso639_2: 'eng', name: 'English', nativeName: 'English' });
  });

  it('maps translations to the legacy two-letter keys', () => {
    assert.strictEqual(out.translations.de, 'Kanada');
    assert.strictEqual(out.translations.fa, 'کانادا');
  });

  it('fills neutral values for missing data', () => {
    const bare = convert({ name: { common: 'Nowhere' }, cca2: 'NW', cca3: 'NWH' });
    assert.strictEqual(bare.capital, '');
    assert.strictEqual(bare.gini, null);
    assert.deepStrictEqual(bare.currencies, []);
    assert.deepStrictEqual(bare.regionalBlocs, []);
    assert.strictEqual(bare.nativeName, 'Nowhere');
  });

  it('maps the Antarctic region to Polar as v2 did', () => {
    assert.strictEqual(convert({ ...canadaV3, region: 'Antarctic' }).region, 'Polar');
  });
});

describe('field grouping', () => {
  it('keeps every request under the 10-field limit and always includes cca3', () => {
    for (const g of FIELD_GROUPS) {
      assert.ok(g.length <= 10);
      assert.strictEqual(g[0], 'cca3');
    }
  });

  it('mergeByCode combines partial records for the same country', () => {
    const merged = mergeByCode([[{ cca3: 'CAN', cca2: 'CA' }], [{ cca3: 'CAN', region: 'Americas' }]]);
    assert.deepStrictEqual(merged, [{ cca3: 'CAN', cca2: 'CA', region: 'Americas' }]);
  });
});
