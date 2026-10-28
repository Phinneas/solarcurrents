"""Pull PVWatts v8 modeled output per 1 kW for each state's 2020 population center.

Two configurations per state:
  railing = vertical (tilt 90), south-facing, typical balcony railing mount
  tilted  = tilt equal to latitude, south-facing, best-case fixed mount

Key is read from the PVWATTS_API_KEY environment variable and sent as a header.
"""
import csv, json, os, sys, time, urllib.parse, urllib.request

centers_csv, out_json = sys.argv[1], sys.argv[2]
key = os.environ["PVWATTS_API_KEY"]
BASE = "https://developer.nlr.gov/api/pvwatts/v8.json"

configs = {
    "railing": lambda lat: {"tilt": 90},
    "tilted": lambda lat: {"tilt": round(abs(lat), 1)},
}

rows = []
with open(centers_csv) as f:
    for r in csv.DictReader(f):
        lat, lon = float(r["LATITUDE"]), float(r["LONGITUDE"])
        for name, extra in configs.items():
            params = {
                "lat": lat, "lon": lon, "system_capacity": 1,
                "azimuth": 180, "array_type": 0, "module_type": 0, "losses": 14,
                "dataset": "nsrdb", "timeframe": "monthly", **extra(lat),
            }
            req = urllib.request.Request(BASE + "?" + urllib.parse.urlencode(params),
                                         headers={"X-Api-Key": key})
            for attempt in range(3):
                try:
                    d = json.load(urllib.request.urlopen(req, timeout=30))
                    break
                except Exception as e:
                    if attempt == 2:
                        raise
                    time.sleep(3)
            if d.get("errors"):
                print("ERR", r["STNAME"], name, d["errors"], file=sys.stderr)
                continue
            o = d["outputs"]
            rows.append({
                "state_fips": r["STATEFP"], "state_name": r["STNAME"],
                "lat": lat, "lon": lon, "config": name, "tilt": params["tilt"],
                "kwh_per_kw_year": round(o["ac_annual"], 1),
                "kwh_per_kw_monthly": [round(x, 1) for x in o["ac_monthly"]],
                "solrad_annual": round(o["solrad_annual"], 2),
                "pvwatts_version": d.get("version"),
                "weather_source": (d.get("station_info") or {}).get("weather_data_source"),
            })
            time.sleep(0.3)

json.dump(rows, open(out_json, "w"), indent=1)
print(len(rows), "rows written")
