const NodeGeocoder = require('node-geocoder');

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};


// for the address , most accurate format to get best result of the real location
// House Number, Street Direction, Street Name, Street Suffix, City, State, Zip, Country
// source : https://stackoverflow.com/questions/7764244/correct-address-format-to-get-the-most-accurate-results-from-google-geocoding-ap
const geocoder = NodeGeocoder(options);

module.exports = geocoder;
