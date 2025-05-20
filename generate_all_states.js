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

const surveyBase = 'https://survey.zohopublic.com/zs/FdD9PM?state=';
const aboutTemplate = (state) => `
{% extends "../base.html" %}
{% block title %}${state.name} Director Bio | The Conservative Caucus{% endblock %}
{% block description %}Meet our ${state.name} State Director and learn how to get involved.{% endblock %}
{% block body %}
<h1>State Director – ${state.name}</h1>
<p>
  [Director bio and contact for ${state.name} goes here.]
</p>
{% endblock %}
`;
const surveyTemplate = (state) => `
{% extends "../base.html" %}
{% block title %}${state.name} Survey | The Conservative Caucus{% endblock %}
{% block description %}Share your opinion with The Conservative Caucus.{% endblock %}
{% block body %}
<h1>${state.name} Survey</h1>
<iframe src="${surveyBase}${state.name.toLowerCase()}" width="100%" height="800" frameborder="0" style="border:none;"></iframe>
{% endblock %}
`;
const indexTemplate = (state) => `
{% extends "../base.html" %}
{% block title %}TCC ${state.name} | Congressional Map{% endblock %}
{% block description %}Explore ${state.name}'s districts and take action with The Conservative Caucus.{% endblock %}
{% block body %}
<h1>${state.name} Congressional Districts</h1>
<div class="map-container">
  <iframe src="/maps/${state.name.toLowerCase()}-map.html" width="100%" height="600" style="border:none;"></iframe>
</div>
<p style="text-align:center; margin-top:20px;">
  <a href="/survey.html">Click here to take the ${state.name} survey</a>
</p>
{% endblock %}
`;

states.forEach((state) => {
  const dir = path.join(__dirname, 'src', state.abbr.toLowerCase());
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'index.html'), indexTemplate(state));
  fs.writeFileSync(path.join(dir, 'survey.html'), surveyTemplate(state));
  fs.writeFileSync(path.join(dir, 'about.html'), aboutTemplate(state));
});
console.log('All state folders and HTML files generated.');
