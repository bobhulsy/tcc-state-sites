const fs = require('fs');
const path = require('path');

const states = [
  { abbr: 'AL', name: 'Alabama' }, { abbr: 'AK', name: 'Alaska' }, { abbr: 'AZ', name: 'Arizona' },
  { abbr: 'AR', name: 'Arkansas' }, { abbr: 'CA', name: 'California' }, { abbr: 'CO', name: 'Colorado' },
  { abbr: 'CT', name: 'Connecticut' }, { abbr: 'DE', name: 'Delaware' }, { abbr: 'FL', name: 'Florida' },
  { abbr: 'GA', name: 'Georgia' }, { abbr: 'HI', name: 'Hawaii' }, { abbr: 'ID', name: 'Idaho' },
  { abbr: 'IL', name: 'Illinois' }, { abbr: 'IN', name: 'Indiana' }, { abbr: 'IA', name: 'Iowa' },
  { abbr: 'KS', name: 'Kansas' }, { abbr: 'KY', name: 'Kentucky' }, { abbr: 'LA', name: 'Louisiana' },
  { abbr: 'ME', name: 'Maine' }, { abbr: 'MD', name: 'Maryland' }, { abbr: 'MA', name: 'Massachusetts' },
  { abbr: 'MI', name: 'Michigan' }, { abbr: 'MN', name: 'Minnesota' }, { abbr: 'MS', name: 'Mississippi' },
  { abbr: 'MO', name: 'Missouri' }, { abbr: 'MT', name: 'Montana' }, { abbr: 'NE', name: 'Nebraska' },
  { abbr: 'NV', name: 'Nevada' }, { abbr: 'NH', name: 'New Hampshire' }, { abbr: 'NJ', name: 'New Jersey' },
  { abbr: 'NM', name: 'New Mexico' }, { abbr: 'NY', name: 'New York' }, { abbr: 'NC', name: 'North Carolina' },
  { abbr: 'ND', name: 'North Dakota' }, { abbr: 'OH', name: 'Ohio' }, { abbr: 'OK', name: 'Oklahoma' },
  { abbr: 'OR', name: 'Oregon' }, { abbr: 'PA', name: 'Pennsylvania' }, { abbr: 'RI', name: 'Rhode Island' },
  { abbr: 'SC', name: 'South Carolina' }, { abbr: 'SD', name: 'South Dakota' }, { abbr: 'TN', name: 'Tennessee' },
  { abbr: 'TX', name: 'Texas' }, { abbr: 'UT', name: 'Utah' }, { abbr: 'VT', name: 'Vermont' },
  { abbr: 'VA', name: 'Virginia' }, { abbr: 'WA', name: 'Washington' }, { abbr: 'WV', name: 'West Virginia' },
  { abbr: 'WI', name: 'Wisconsin' }, { abbr: 'WY', name: 'Wyoming' }
];

const surveyPlaceholder = "https://survey.zohopublic.com/zs/PLACEHOLDER?state=";
const directorPlaceholder = (state) => `
<h1>${state.name} State Director</h1>
<img src="/assets/directors/placeholder.jpg" alt="${state.name} Director" style="max-width:200px;">
<p>
  [Director Name] leads The Conservative Caucus in ${state.name}.<br>
  📍 [City, State]<br>
  📞 [Phone]<br>
  📧 <a href="mailto:[email]">[email]</a>
</p>
`;

const indexTemplate = (state) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TCC ${state.name} | Congressional Map</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/src/css/styles.css">
</head>
<body>
  <header>
    <a href="https://theconservativecaucus.org"><img src="/assets/logo.png" alt="TCC Logo" style="height:60px;"></a>
    <h2>The Conservative Caucus – ${state.name}</h2>
    <nav>
      <a href="/${state.abbr.toLowerCase()}/index.html">Home</a>
      <a href="/${state.abbr.toLowerCase()}/survey.html">Survey</a>
      <a href="/${state.abbr.toLowerCase()}/about.html">About</a>
    </nav>
  </header>
  <main>
    <h1>${state.name} Congressional Districts</h1>
    <div class="map-container">
      <iframe src="/src/maps/${state.abbr.toLowerCase()}-map.html" width="100%" height="600" style="border:none;"></iframe>
    </div>
    <p style="text-align:center; margin-top:20px;">
      <a href="/${state.abbr.toLowerCase()}/survey.html">Click here to take the ${state.name} survey</a>
    </p>
  </main>
  <footer>
    <p>© 2024 The Conservative Caucus | <a href="https://theconservativecaucus.org">Main Site</a></p>
  </footer>
</body>
</html>
`;

const surveyTemplate = (state) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${state.name} Survey | The Conservative Caucus</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/src/css/styles.css">
</head>
<body>
  <header>
    <a href="/${state.abbr.toLowerCase()}/index.html">Home</a>
    <a href="/${state.abbr.toLowerCase()}/survey.html">Survey</a>
    <a href="/${state.abbr.toLowerCase()}/about.html">About</a>
  </header>
  <main>
    <h1>${state.name} Survey</h1>
    <iframe src="${surveyPlaceholder}${state.name.toLowerCase().replace(/ /g, '-')}"
            width="100%" height="800" frameborder="0" style="border:none;">
    </iframe>
  </main>
  <footer>
    <p>© 2024 The Conservative Caucus | <a href="https://theconservativecaucus.org">Main Site</a></p>
  </footer>
</body>
</html>
`;

const aboutTemplate = (state) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${state.name} Director Bio | The Conservative Caucus</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/src/css/styles.css">
</head>
<body>
  <header>
    <a href="/${state.abbr.toLowerCase()}/index.html">Home</a>
    <a href="/${state.abbr.toLowerCase()}/survey.html">Survey</a>
    <a href="/${state.abbr.toLowerCase()}/about.html">About</a>
  </header>
  <main>
    ${directorPlaceholder(state)}
  </main>
  <footer>
    <p>© 2024 The Conservative Caucus | <a href="https://theconservativecaucus.org">Main Site</a></p>
  </footer>
</body>
</html>
`;

const mapTemplate = (state) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${state.name} Congressional District Map</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/src/css/styles.css">
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
    const projection = d3.geoAlbersUsa()
      .fitSize([width, height], {type: "FeatureCollection", features: []});
    const path = d3.geoPath().projection(projection);
    d3.json("/data/${state.abbr.toLowerCase()}.geojson").then(function(geojson) {
      svg.append("g")
        .selectAll("path")
        .data(geojson.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "#4f8cff")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .on("click", function(event, d) {
          d3.selectAll('.map-tooltip').remove();
          d3.selectAll('path').attr('fill', '#4f8cff');
          d3.select(this).attr('fill', '#2b6cb0');
          let tooltipHtml = \`<strong>\${d.properties.NAMELSAD || 'District'}</strong><br/>\`;
          tooltipHtml += \`<div><strong>\${d.properties.REP_NAME || 'Rep Name'}</strong><br/>\`;
          if (d.properties.PARTY) tooltipHtml += \`\${d.properties.PARTY}<br/>\`;
          if (d.properties.PHONE) tooltipHtml += \`<button class='cta-btn' onclick="window.open('tel:\${d.properties.PHONE}')">Call</button> <span>\${d.properties.PHONE}</span><br/>\`;
          if (d.properties.EMAIL) tooltipHtml += \`<button class='cta-btn' onclick="window.open('mailto:\${d.properties.EMAIL}')">Email</button> <span>\${d.properties.EMAIL}</span><br/>\`;
          if (d.properties.WEBSITE) tooltipHtml += \`<button class='cta-btn' onclick="window.open('\${d.properties.WEBSITE}', '_blank')">Visit Website</button><br/>\`;
          tooltipHtml += \`<button class='cta-btn close-btn' style='float:right;margin-top:-8px;' onclick='this.parentNode.parentNode.remove()'>×</button>\`;
          tooltipHtml += \`</div>\`;
          let tooltip = d3.select('body').append('div')
            .attr('class', 'map-tooltip')
            .style('position', 'absolute')
            .style('background', '#fff')
            .style('border', '1px solid #ccc')
            .style('padding', '10px')
            .style('border-radius', '12px')
            .style('box-shadow', '0 4px 16px rgba(0,0,0,0.12)')
            .style('pointer-events', 'auto')
            .html(tooltipHtml)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 20) + 'px');
          setTimeout(() => {
            document.addEventListener('mousedown', function handler(e) {
              if (!tooltip.node().contains(e.target)) {
                tooltip.remove();
                d3.selectAll('path').attr('fill', '#4f8cff');
                document.removeEventListener('mousedown', handler);
              }
            });
          }, 0);
        });
    });
  </script>
</body>
</html>
`;

states.forEach(state => {
  const dir = path.join(__dirname, 'src', state.abbr.toLowerCase());
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), indexTemplate(state));
  fs.writeFileSync(path.join(dir, 'survey.html'), surveyTemplate(state));
  fs.writeFileSync(path.join(dir, 'about.html'), aboutTemplate(state));
  // Map HTML
  const mapPath = path.join(__dirname, 'src', 'maps');
  if (!fs.existsSync(mapPath)) fs.mkdirSync(mapPath, { recursive: true });
  fs.writeFileSync(path.join(mapPath, `${state.abbr.toLowerCase()}-map.html`), mapTemplate(state));
});

console.log("All state folders and files scaffolded! Now run your GeoJSON splitter and fill in director/survey info.");