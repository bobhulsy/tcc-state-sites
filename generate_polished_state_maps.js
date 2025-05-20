// This script generates a polished map HTML for each state in /src/maps/ that:
// - Loads the correct GeoJSON from /data/{state}.geojson
// - Loads the correct Google Civic API data from /data/{state}_reps.json
// - Shows a styled tooltip with rep info and next election on district hover
// - Uses a state-appropriate D3 projection (Albers USA for all, but can be customized)

const fs = require('fs');
const path = require('path');

const states = [
  { abbr: 'AL', name: 'alabama' }, { abbr: 'AK', name: 'alaska' }, { abbr: 'AZ', name: 'arizona' },
  { abbr: 'AR', name: 'arkansas' }, { abbr: 'CA', name: 'california' }, { abbr: 'CO', name: 'colorado' },
  { abbr: 'CT', name: 'connecticut' }, { abbr: 'DE', name: 'delaware' }, { abbr: 'FL', name: 'florida' },
  { abbr: 'GA', name: 'georgia' }, { abbr: 'HI', name: 'hawaii' }, { abbr: 'ID', name: 'idaho' },
  { abbr: 'IL', name: 'illinois' }, { abbr: 'IN', name: 'indiana' }, { abbr: 'IA', name: 'iowa' },
  { abbr: 'KS', name: 'kansas' }, { abbr: 'KY', name: 'kentucky' }, { abbr: 'LA', name: 'louisiana' },
  { abbr: 'ME', name: 'maine' }, { abbr: 'MD', name: 'maryland' }, { abbr: 'MA', name: 'massachusetts' },
  { abbr: 'MI', name: 'michigan' }, { abbr: 'MN', name: 'minnesota' }, { abbr: 'MS', name: 'mississippi' },
  { abbr: 'MO', name: 'missouri' }, { abbr: 'MT', name: 'montana' }, { abbr: 'NE', name: 'nebraska' },
  { abbr: 'NV', name: 'nevada' }, { abbr: 'NH', name: 'new-hampshire' }, { abbr: 'NJ', name: 'new-jersey' },
  { abbr: 'NM', name: 'new-mexico' }, { abbr: 'NY', name: 'new-york' }, { abbr: 'NC', name: 'north-carolina' },
  { abbr: 'ND', name: 'north-dakota' }, { abbr: 'OH', name: 'ohio' }, { abbr: 'OK', name: 'oklahoma' },
  { abbr: 'OR', name: 'oregon' }, { abbr: 'PA', name: 'pennsylvania' }, { abbr: 'RI', name: 'rhode-island' },
  { abbr: 'SC', name: 'south-carolina' }, { abbr: 'SD', name: 'south-dakota' }, { abbr: 'TN', name: 'tennessee' },
  { abbr: 'TX', name: 'texas' }, { abbr: 'UT', name: 'utah' }, { abbr: 'VT', name: 'vermont' },
  { abbr: 'VA', name: 'virginia' }, { abbr: 'WA', name: 'washington' }, { abbr: 'WV', name: 'west-virginia' },
  { abbr: 'WI', name: 'wisconsin' }, { abbr: 'WY', name: 'wyoming' }
];

const mapsDir = path.join(__dirname, 'src', 'maps');
if (!fs.existsSync(mapsDir)) fs.mkdirSync(mapsDir);

states.forEach((state) => {
  const file = path.join(mapsDir, `${state.name}-map.html`);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${state.name.charAt(0).toUpperCase() + state.name.slice(1)} Congressional District Map</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>body{margin:0;padding:0;font-family:sans-serif;background:#f8fafc;}#map{width:100vw;height:100vh;} .map-tooltip { position: absolute; background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 8px; pointer-events: none; box-shadow: 0 2px 8px #0001; font-size: 1rem; color: #222; z-index: 10; }</style>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <div id="map" style="width:100vw;height:100vh;"></div>
  <script>
    const width = window.innerWidth;
    const height = window.innerHeight;
    const svg = d3.select("#map").append("svg")
      .attr("width", width)
      .attr("height", height);
    const projection = d3.geoAlbersUsa().fitSize([width, height], {type: "FeatureCollection", features: []});
    const path = d3.geoPath().projection(projection);
    d3.json("/data/${state.name}.geojson").then(function(geojson) {
      projection.fitSize([width, height], geojson);
      svg.append("g")
        .selectAll("path")
        .data(geojson.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "#3182ce")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .on("mouseover", function(event, d) {
          const districtNum = d.properties.CD116FP || d.properties.DISTRICT || d.properties.district || '';
          let repInfo = null;
          if (window.repsData && window.repsData.officials && window.repsData.offices) {
            const office = window.repsData.offices.find(o => {
              return o.name.includes("United States House of Representatives") &&
                o.divisionId && o.divisionId.match(/cd:(\\d+)/) &&
                (o.divisionId.split(":cd:")[1] === districtNum.padStart(2, '0'));
            });
            if (office && office.officialIndices && office.officialIndices.length > 0) {
              repInfo = window.repsData.officials[office.officialIndices[0]];
            }
          }
          let tooltipHtml = `<strong>District ${districtNum}</strong><br/>`;
          if (repInfo) {
            tooltipHtml += `<div><strong>${repInfo.name}</strong><br/>`;
            if (repInfo.party) tooltipHtml += `${repInfo.party}<br/>`;
            if (repInfo.phones) tooltipHtml += `Phone: ${repInfo.phones[0]}<br/>`;
            if (repInfo.emails) tooltipHtml += `Email: ${repInfo.emails[0]}<br/>`;
            if (repInfo.urls) tooltipHtml += `<a href='${repInfo.urls[0]}' target='_blank'>Website</a><br/>`;
            if (repInfo.nextElection) tooltipHtml += `<em>Next election: ${repInfo.nextElection}</em><br/>`;
            tooltipHtml += `</div>`;
          } else {
            tooltipHtml += 'No representative data.';
          }
          let tooltip = d3.select("body").append("div")
            .attr("class", "map-tooltip")
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 20) + "px")
            .html(tooltipHtml);
          d3.select(this).attr("fill", "#2b6cb0");
          d3.select("body").on("mousemove.maptooltip", function(event) {
            tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 20) + "px");
          });
        })
        .on("mouseout", function(event, d) {
          d3.select(this).attr("fill", "#3182ce");
          d3.selectAll(".map-tooltip").remove();
          d3.select("body").on("mousemove.maptooltip", null);
        });
    });
    d3.json("/data/${state.name}_reps.json").then(function(data) {
      window.repsData = data;
    });
  </script>
</body>
</html>
`;
  fs.writeFileSync(file, html);
});
console.log('Polished map HTML files generated for all states in /src/maps/.');
