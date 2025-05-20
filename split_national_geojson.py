import json
import os

# Map FIPS codes to two-letter state abbreviations
fips_to_abbr = {
    "01": "al", "02": "ak", "04": "az", "05": "ar", "06": "ca", "08": "co", "09": "ct", "10": "de",
    "11": "dc", "12": "fl", "13": "ga", "15": "hi", "16": "id", "17": "il", "18": "in", "19": "ia",
    "20": "ks", "21": "ky", "22": "la", "23": "me", "24": "md", "25": "ma", "26": "mi", "27": "mn",
    "28": "ms", "29": "mo", "30": "mt", "31": "ne", "32": "nv", "33": "nh", "34": "nj", "35": "nm",
    "36": "ny", "37": "nc", "38": "nd", "39": "oh", "40": "ok", "41": "or", "42": "pa", "44": "ri",
    "45": "sc", "46": "sd", "47": "tn", "48": "tx", "49": "ut", "50": "vt", "51": "va", "53": "wa",
    "54": "wv", "55": "wi", "56": "wy"
}

# Adjusted input path to your provided file
input_path = '/Users/roberthulsy/Downloads/NTAD_Congressional_Districts_1928759543695387395 (1).geojson'

# Remove old .geojson files in the data directory
data_dir = 'data'
os.makedirs(data_dir, exist_ok=True)
for filename in os.listdir(data_dir):
    if filename.endswith('.geojson'):
        os.remove(os.path.join(data_dir, filename))

# Load the national geojson (must be a FeatureCollection with STATEFP in properties)
with open(input_path) as f:
    data = json.load(f)

state_features = {}
for feat in data['features']:
    fips = feat['properties']['STATEFP']
    abbr = fips_to_abbr.get(fips)
    if abbr:
        state_features.setdefault(abbr, []).append(feat)

for abbr, feats in state_features.items():
    with open(f'data/{abbr}.geojson', 'w') as f:
        json.dump({"type": "FeatureCollection", "features": feats}, f)
    print(f'Saved: data/{abbr}.geojson')
