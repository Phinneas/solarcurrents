-- Applied to solar-currents-cms-db on 2026-10-28.
-- Modeled PVWatts v8 output per 1 kW of panel, per state, for two mounts:
--   railing = vertical (tilt 90), south-facing
--   tilted  = tilt equal to latitude, south-facing
-- Location: Census 2020 state center of population. Scale linearly to a watt cap
-- (an 800 W cap is 0.8 x kwh_per_kw_year).
CREATE TABLE IF NOT EXISTS hub_pvwatts_state (
  state_fips TEXT NOT NULL,
  state_name TEXT NOT NULL,
  config TEXT NOT NULL CHECK (config IN ('railing','tilted')),
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  tilt REAL NOT NULL,
  azimuth REAL NOT NULL DEFAULT 180,
  losses_pct REAL NOT NULL DEFAULT 14,
  kwh_per_kw_year REAL NOT NULL,
  kwh_per_kw_monthly TEXT NOT NULL,
  solrad_annual REAL,
  pvwatts_version TEXT,
  weather_source TEXT,
  location_basis TEXT NOT NULL DEFAULT 'Census 2020 state center of population',
  pulled_at TEXT NOT NULL,
  PRIMARY KEY (state_fips, config)
);
