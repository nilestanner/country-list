# Country info list

Data is sourced from: https://restcountries.eu/rest/v2/all
Data is refreshed each night. If there are differences, a new package will be built.

*Build at compile time, not at run time*

## Installation
Install via NPM
```
npm install country-info-list --save
```

Include in your project
```
const countryList = require('country-info-list');
// or
import * as countryList from 'country-info-list';
```

## Usage

### getCountries()

Returns all countries with all their data.

### getCountry(code)

Returns a country with that code. `code` can be a 2 or 3 character code.

### getNames()

Returns a list of the country names only.

### getCodes(?codeType)

Returns a list of the country codes only. `codeType` is a optional parameter. Valid values: [2, 3]. The number indicates how many characters the country code will have. Defaults to 2.

### getCode(name, ?codeType)

Returns a country code for a given country name. `codeType` is a optional parameter. Valid values: [2, 3]. The number indicates how many characters the country code will have. Defaults to 2.
