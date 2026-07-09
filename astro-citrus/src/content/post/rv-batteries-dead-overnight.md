---
title: "My RV Batteries Are Dead by Morning — What's Actually Happening"
description: "Your RV batteries keep dying overnight. Here's the actual math on what's draining them — fridge, furnace, phantom loads, and the AGM capacity trap most people fall into."
publishDate: "29 June 2026"
updatedDate: "29 June 2026"
coverImage:
  src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=2000"
  alt: "RV parked at a campsite at night under stars"
tags: ["rv", "batteries", "boondocking", "off-grid", "agm", "lifepo4"]
---


If you're waking up to a dead RV battery, you probably already know the obvious culprits: lights left on, AC running all night, something you forgot to turn off. But most overnight battery failures aren't caused by one big mistake. They're caused by the interaction of several moderate loads that each seem fine on their own — combined with a battery bank that has less usable capacity than the label says.

Here's a realistic accounting of where your amps actually go between 10 PM and 7 AM, and why the math goes wrong faster than most RV guides admit.

## You Probably Have Half the Battery You Think You Have

This is the part most RV manuals bury in fine print. AGM batteries — the sealed lead-acid type that came with most RVs built in the last decade — should not be routinely discharged below 50% state of charge. Push them below that regularly and you're shortening their cycle life from a possible 500-1,000 cycles down toward the low end, or worse. So a pair of 100Ah AGM batteries gives you roughly 100Ah of usable capacity, not 200Ah.

That changes the math immediately. If you're camping in a modern travel trailer with a "200Ah battery bank," you're starting each night with 100Ah of real headroom. Everything after that is a choice between loads.

LiFePO4 (lithium iron phosphate) batteries don't have this problem — they can be discharged to 20% or below without the same damage, which means a 100Ah LFP battery delivers around 80Ah usable versus ~50Ah for AGM. That's 60% more real capacity per rated amp-hour. The comparison matters, but the upgrade isn't free: quality LFP batteries run $700–$1,200 per 100Ah compared to $150–$250 for AGM, and your existing converter or charger may not support LFP charging profiles without modification.

## Your 12V Refrigerator Is the Biggest Single Draw

A modern 12V compressor fridge — the kind replacing the old absorption fridges in newer RVs — is more efficient than people expect on a per-hour basis, but it runs for a long time. A typical 40-60 liter unit draws between 1.5 and 6 amps when the compressor is on, but the compressor doesn't run continuously. In moderate ambient temperatures, it cycles to around 50% duty, meaning it's running roughly half the time.

Real-world data: in one documented overnight test, a 12V fridge in an RV with a 460Ah lithium battery accounted for a 12% SOC drop overnight — about 56 amp-hours — when the only other load was a CO detector. Older AGM tests with Dometic and GE absorption-style fridges pulled 65–80 Ah overnight, which is worse. On a 100Ah usable AGM bank, a refrigerator alone can consume more than half your available capacity by morning.

The one honest caveat here: a cold, pre-loaded fridge in cool ambient temperatures uses significantly less power than a warm, empty fridge in summer heat. Filling the fridge and pre-cooling it before you kill shore power is not just advice-column fluff — it's a meaningful load reduction.

## The Furnace Is the Most Underestimated Draw

Propane furnaces get a bad reputation in the solar community because they're frequently listed under the wrong mental category. People think of them as "burning propane," which is true, but the blower motor that circulates heat is electric — and it draws between 7 and 10 amps at 12V the entire time it's running.

If your furnace cycles on for 30 minutes of an 8-hour night (a conservative estimate in mild weather), that's 3.5–5 Ah. If the temperature drops overnight and the furnace cycles on for 2 cumulative hours, you're looking at 14–20 Ah from the blower alone, not counting anything else.

Cold weather compounds this in a second way: battery capacity itself drops in freezing temperatures. A 100Ah AGM battery might deliver only 60–70Ah at temperatures below 32°F. You're losing headroom on both ends simultaneously — higher heating loads, lower available capacity. LFP batteries have a different cold-weather problem: they shouldn't be charged when below freezing without a heated cell or built-in BMS protection, though they can still discharge in the cold.

## Phantom Loads and Inverter Idle Are Death by a Thousand Cuts

The loads that are genuinely hard to track are the ones you never consciously turn on. CO detectors, propane detectors, control panel displays, stereo memory, and slide-out motor electronics collectively draw somewhere between 2 and 5 amps around the clock. At 3 amps over an 8-hour night, that's 24 Ah before you've turned on a single light.

The inverter is often the worst offender. A typical 2,000-watt inverter left on in standby mode idles at around 20–30 watts even with no devices connected. At 25W over 8 hours, that's 200 watt-hours — roughly 16–17 Ah at 12V — consumed entirely as heat. If you have a 1,500W inverter and a phone charger, a fan, or a TV on standby plugged into it, the inverter's idle consumption can eclipse the draw of those devices. The fix is simple: turn the inverter off at night unless something actually needs AC power.

## The Overnight Math, Worked Out

Take a realistic boondocking scenario: two 100Ah AGM batteries (100Ah usable), nighttime temperatures around 50°F, a 50-liter compressor fridge, a propane furnace cycling occasionally, and normal phantom loads.

The 12V fridge running at 50% duty with a 4A running draw uses about 32Ah overnight. The furnace blower cycling for 90 cumulative minutes at 8A uses about 12Ah. Phantom loads at 3A continuous use 24Ah. Total: 68Ah. That's 68% of your usable capacity by morning — and this scenario assumes moderate temperatures, no inverter left on, no lights on, and a reasonably efficient fridge.

Add a warm night with a fridge struggling to hold temperature (50Ah instead of 32), or a cold front that runs the furnace for 3 hours instead of 1.5, or someone who left the inverter on and charged a laptop, and you've exceeded 100Ah easily. That's why you're waking up to a dead battery.

## What AGM Users Can Actually Do Without Replacing the Bank

The highest-leverage interventions, in order of impact: turn off the inverter when not in use; install a battery disconnect switch to kill stereo and control-panel phantom loads at night; add a temperature-controlled catalytic heater or electric blanket as a furnace supplement on cold nights (though verify your battery can support it); and pre-cool the fridge to operating temperature before disconnecting from shore power.

If you're boondocking regularly and not connected to solar during the day, you also need to examine your recharge window. AGM batteries accept charge slower than LFP, and a 200W solar panel on a partly cloudy afternoon may not fully restore 100Ah of draw before the next night. Chronic partial charging shortens AGM life faster than deep discharge does.

## AGM vs. LiFePO4: When the Upgrade Actually Makes Sense

The honest breakeven analysis on LFP versus AGM isn't about upfront cost — it's about how often you're actually draining the batteries and whether you have the recharge resources to support LFP charging profiles. For a full-timer or frequent boondocker who cycles the battery daily, LFP's 2,000–6,000 cycle rating versus AGM's 300–1,000 cycles is genuinely significant. You're replacing the AGM bank two to four times over a period when the LFP bank is still going.

For a seasonal camper who makes six trips a year and spends most nights at hookup sites, the math inverts. You might run the AGM bank for 10 years without approaching its cycle-life limits. Spending $2,000–$4,000 on LFP to save $400 in AGM replacements over a decade isn't a deal.

The real trigger for upgrading is when overnight draws reliably exceed what AGM can safely provide — when 100Ah usable isn't enough for how you're camping, and adding more AGM weight isn't practical. At that point, the LFP switch buys you real capacity in a smaller, lighter package and removes the 50% discharge anxiety that makes overnight battery math so tight.

Until then, turning off the inverter and accepting that you have 100Ah — not 200Ah — is most of what you need to know.
