const { describe, it, beforeEach, mock } = require('node:test');
const assert = require('node:assert');
const lib = require('../index.js');
const data = require('../countries.json');

// countries.json is regenerated nightly from a remote API, so these tests assert
// invariants and well-known stable entries rather than exact counts or full records.

describe('countries.json data sanity', () => {
  it('is a non-empty array of country records', () => {
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 200);
  });

  it('every record has a name and well-formed alpha-2 / alpha-3 codes', () => {
    for (const c of data) {
      assert.strictEqual(typeof c.name, 'string');
      assert.ok(c.name.length > 0);
      assert.match(c.alpha2Code, /^[A-Z]{2}$/, c.name);
      assert.match(c.alpha3Code, /^[A-Z]{3}$/, c.name);
    }
  });

  it('codes and names are unique', () => {
    assert.strictEqual(new Set(data.map(c => c.alpha2Code)).size, data.length);
    assert.strictEqual(new Set(data.map(c => c.alpha3Code)).size, data.length);
    assert.strictEqual(new Set(data.map(c => c.name)).size, data.length);
  });
});

describe('country-info-list', () => {
  beforeEach(() => {
    // Silence the library's console.log diagnostics.
    mock.method(console, 'log', () => {});
  });

  describe('getCountries', () => {
    it('returns the full data set', () => {
      assert.deepStrictEqual(lib.getCountries(), data);
    });
  });

  describe('getCountry', () => {
    it('looks up by 2-letter code', () => {
      const c = lib.getCountry('US');
      assert.strictEqual(c.alpha2Code, 'US');
      assert.strictEqual(c.alpha3Code, 'USA');
    });

    it('looks up by 3-letter code', () => {
      const c = lib.getCountry('CAN');
      assert.strictEqual(c.alpha2Code, 'CA');
    });

    it('is case-insensitive', () => {
      assert.strictEqual(lib.getCountry('de'), lib.getCountry('DE'));
      assert.strictEqual(lib.getCountry('deu'), lib.getCountry('DEU'));
      assert.strictEqual(lib.getCountry('de').alpha3Code, 'DEU');
    });

    it('returns null for wrong-length or non-string input', () => {
      assert.strictEqual(lib.getCountry('A'), null);
      assert.strictEqual(lib.getCountry('ABCD'), null);
      assert.strictEqual(lib.getCountry(''), null);
      assert.strictEqual(lib.getCountry(), null);
      assert.strictEqual(lib.getCountry(42), null);
      assert.strictEqual(lib.getCountry(null), null);
    });

    it('returns null for a well-formed but unknown code', () => {
      assert.strictEqual(lib.getCountry('ZZ'), null);
      assert.strictEqual(lib.getCountry('ZZZ'), null);
    });
  });

  describe('getNames', () => {
    it('returns every country name in order', () => {
      assert.deepStrictEqual(lib.getNames(), data.map(c => c.name));
    });

    it('returns the same cached array on repeated calls', () => {
      assert.strictEqual(lib.getNames(), lib.getNames());
    });
  });

  describe('getCodes', () => {
    it('returns 2-letter codes when asked for 2', () => {
      const codes = lib.getCodes(2);
      assert.deepStrictEqual(codes, data.map(c => c.alpha2Code));
      assert.ok(codes.includes('FR'));
    });

    it('returns 3-letter codes when asked for 3', () => {
      const codes = lib.getCodes(3);
      assert.deepStrictEqual(codes, data.map(c => c.alpha3Code));
      assert.ok(codes.includes('FRA'));
    });

    it('defaults to 2-letter codes with no argument', () => {
      assert.deepStrictEqual(lib.getCodes(), lib.getCodes(2));
    });

    it('falls back to 2-letter codes (and logs) for an invalid code type', () => {
      assert.deepStrictEqual(lib.getCodes(5), lib.getCodes(2));
      assert.deepStrictEqual(lib.getCodes('3'), lib.getCodes(2));
      assert.ok(console.log.mock.calls.length >= 2);
    });

    it('caches results per code type', () => {
      assert.strictEqual(lib.getCodes(2), lib.getCodes(2));
      assert.strictEqual(lib.getCodes(3), lib.getCodes(3));
      assert.notStrictEqual(lib.getCodes(2), lib.getCodes(3));
    });
  });

  describe('getCode', () => {
    it('returns the 2-letter code by default', () => {
      assert.strictEqual(lib.getCode('Canada'), 'CA');
    });

    it('returns the 3-letter code when asked', () => {
      assert.strictEqual(lib.getCode('Canada', 3), 'CAN');
    });

    it('treats any code type other than 3 as 2', () => {
      assert.strictEqual(lib.getCode('Canada', 7), 'CA');
    });

    it('matches names case-insensitively', () => {
      assert.strictEqual(lib.getCode('cAnAdA'), 'CA');
    });

    it('returns null for an unknown name', () => {
      assert.strictEqual(lib.getCode('Atlantis'), null);
    });

    it('requires an exact name (no partial match)', () => {
      assert.strictEqual(lib.getCode('Cana'), null);
    });

    it('throws a TypeError for a non-string name', () => {
      assert.throws(() => lib.getCode(undefined), TypeError);
    });

    it('round-trips with getCountry for every country', () => {
      for (const c of data) {
        assert.strictEqual(lib.getCode(c.name), c.alpha2Code, c.name);
        assert.strictEqual(lib.getCode(c.name, 3), c.alpha3Code, c.name);
        assert.strictEqual(lib.getCountry(c.alpha2Code).name, c.name);
      }
    });
  });
});
