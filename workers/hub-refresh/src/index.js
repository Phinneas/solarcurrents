// Solar Currents data hub refresh worker.
// Runs weekly. Re-pulls PVWatts output for rows older than one year,
// a batch at a time to stay under the per-invocation subrequest limit.
// Secrets: PVWATTS_API_KEY (required). LegiScan tracking will be added here
// once a LEGISCAN_API_KEY is issued.

const PVWATTS_URL = "https://developer.nlr.gov/api/pvwatts/v8.json";
const MAX_AGE_DAYS = 365;
const BATCH_SIZE = 40;

async function refreshPvwatts(env) {
  const cutoff = new Date(Date.now() - MAX_AGE_DAYS * 86400000).toISOString().slice(0, 10);
  const { results: stale } = await env.DB.prepare(
    `SELECT state_fips, config, lat, lon, tilt, azimuth, losses_pct
       FROM hub_pvwatts_state WHERE pulled_at < ?1
      ORDER BY pulled_at LIMIT ?2`
  ).bind(cutoff, BATCH_SIZE).all();

  const today = new Date().toISOString().slice(0, 10);
  let updated = 0;
  const errors = [];

  for (const row of stale) {
    const params = new URLSearchParams({
      lat: row.lat, lon: row.lon, system_capacity: "1",
      azimuth: row.azimuth, tilt: row.tilt, array_type: "0",
      module_type: "0", losses: row.losses_pct,
      dataset: "nsrdb", timeframe: "monthly",
    });
    try {
      const res = await fetch(`${PVWATTS_URL}?${params}`, {
        headers: { "X-Api-Key": env.PVWATTS_API_KEY },
      });
      const d = await res.json();
      if (!res.ok || d.errors?.length) throw new Error(JSON.stringify(d.errors || res.status));
      const o = d.outputs;
      await env.DB.prepare(
        `UPDATE hub_pvwatts_state SET kwh_per_kw_year = ?1, kwh_per_kw_monthly = ?2,
           solrad_annual = ?3, pvwatts_version = ?4, weather_source = ?5, pulled_at = ?6
         WHERE state_fips = ?7 AND config = ?8`
      ).bind(
        Math.round(o.ac_annual * 10) / 10,
        JSON.stringify(o.ac_monthly.map((x) => Math.round(x * 10) / 10)),
        Math.round(o.solrad_annual * 100) / 100,
        d.version ?? null,
        d.station_info?.weather_data_source ?? null,
        today, row.state_fips, row.config
      ).run();
      updated++;
    } catch (e) {
      errors.push(`${row.state_fips}/${row.config}: ${e.message}`);
    }
  }
  return { checked: stale.length, updated, errors };
}

export default {
  async scheduled(_event, env, ctx) {
    if (!env.PVWATTS_API_KEY) {
      console.error("PVWATTS_API_KEY secret is not set");
      return;
    }
    ctx.waitUntil(refreshPvwatts(env).then((r) => console.log("pvwatts refresh", JSON.stringify(r))));
  },
};
