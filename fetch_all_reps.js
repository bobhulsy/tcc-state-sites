// Script to fetch congressional representatives for all 50 states using Google Civic API
// Usage: node fetch_all_reps.js

const fs = require('fs');
const https = require('https');

const apiKey = 'AIzaSyAltlBdAPtkxXMTFozICmN0OCGNAlOPTiU';
const stateCapitals = {
  AL: 'Montgomery, AL', AK: 'Juneau, AK', AZ: 'Phoenix, AZ', AR: 'Little Rock, AR', CA: 'Sacramento, CA',
  CO: 'Denver, CO', CT: 'Hartford, CT', DE: 'Dover, DE', FL: 'Tallahassee, FL', GA: 'Atlanta, GA',
  HI: 'Honolulu, HI', ID: 'Boise, ID', IL: 'Springfield, IL', IN: 'Indianapolis, IN', IA: 'Des Moines, IA',
  KS: 'Topeka, KS', KY: 'Frankfort, KY', LA: 'Baton Rouge, LA', ME: 'Augusta, ME', MD: 'Annapolis, MD',
  MA: 'Boston, MA', MI: 'Lansing, MI', MN: 'Saint Paul, MN', MS: 'Jackson, MS', MO: 'Jefferson City, MO',
  MT: 'Helena, MT', NE: 'Lincoln, NE', NV: 'Carson City, NV', NH: 'Concord, NH', NJ: 'Trenton, NJ',
  NM: 'Santa Fe, NM', NY: 'Albany, NY', NC: 'Raleigh, NC', ND: 'Bismarck, ND', OH: 'Columbus, OH',
  OK: 'Oklahoma City, OK', OR: 'Salem, OR', PA: 'Harrisburg, PA', RI: 'Providence, RI', SC: 'Columbia, SC',
  SD: 'Pierre, SD', TN: 'Nashville, TN', TX: 'Austin, TX', UT: 'Salt Lake City, UT', VT: 'Montpelier, VT',
  VA: 'Richmond, VA', WA: 'Olympia, WA', WV: 'Charleston, WV', WI: 'Madison, WI', WY: 'Cheyenne, WY'
};

const stateAbbrs = Object.keys(stateCapitals);

function fetchStateReps(stateAbbr, cb) {
  const address = encodeURIComponent(stateCapitals[stateAbbr]);
  const url = `https://civicinfo.googleapis.com/civicinfo/v2/representatives?address=${address}&levels=country&roles=legislatorLowerBody&key=${apiKey}`;
  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
      try {
        const json = JSON.parse(data);
        fs.writeFileSync(`src/data/${stateAbbr.toLowerCase()}_reps.json`, JSON.stringify(json, null, 2));
        console.log(`Saved representatives to src/data/${stateAbbr.toLowerCase()}_reps.json`);
        cb();
      } catch (e) {
        console.error(`Error parsing or saving data for ${stateAbbr}:`, e);
        cb();
      }
    });
  }).on('error', (err) => {
    console.error(`Error fetching data for ${stateAbbr}:`, err);
    cb();
  });
}

// Sequentially fetch to avoid API rate limits
function fetchAllStates(i = 0) {
  if (i >= stateAbbrs.length) return;
  fetchStateReps(stateAbbrs[i], () => fetchAllStates(i + 1));
}

fetchAllStates();
