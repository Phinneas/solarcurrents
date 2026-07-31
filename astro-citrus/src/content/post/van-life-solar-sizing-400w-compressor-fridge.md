---
title: "Van Life Solar Sizing: Why 400W Isn't Enough If You're Running a Compressor Fridge"
description: "400W solar works for some van builds and fails for others. The difference is duty cycle, mounting angle, and latitude — here's the actual math."
publishDate: "30 July 2026"
updatedDate: "30 July 2026"
coverImage:
  src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000"
  alt: "Solar panels mounted flat on a van roof under an overcast sky"
tags: ["van life", "solar sizing", "compressor fridge", "battery"]
---

Search "how much solar for a van fridge" and you'll get the same answer from a dozen sites: 300–400W is enough. That number isn't wrong, exactly. It's an average dressed up as a rule. It comes from someone's build, in their climate, with their panel angle, running their fridge. Change any one of those variables and 400W stops covering the load — and nobody selling panels wants to walk you through why.

Here's the actual math, broken into the three places a 400W system quietly falls short: what the panels really produce, what the fridge really draws, and what happens when both move against you at once.

## What 400W Actually Produces (Not What's on the Label)

A 400W array doesn't deliver 400 watts for the hours the sun is up. It delivers close to rated output for a handful of "peak sun hours" — the equivalent of full-strength, panel-perpendicular sunlight — and then real-world losses eat 20–25% of even that. Heat, wiring resistance, dust, and a flat, unadjustable roof angle are the main culprits.

Peak sun hours vary enormously by season and latitude:

- Southwest US, summer: 6.5+ hours
- Southern US, winter: 4–5 hours
- Northern US and Canada, summer: 4–6 hours
- Northern US and Canada, winter: 2–3 hours
- Pacific Northwest, most of the year: 3–5 hours

Run the numbers on a flat-mounted 400W array with a realistic 78% system efficiency: 400W × 5 peak sun hours × 0.78 ≈ 1,560Wh on a good summer day. Same array in December at 40°N latitude, with only 2.5 peak sun hours: 400W × 2.5 × 0.78 ≈ 780Wh — half the output, from the same hardware. Several vanlife solar guides now publish this exact seasonal swing directly: a 400W setup producing roughly 2,000Wh on a clear June day can drop to 400–600Wh on a grey December one. That's not a system failure. That's the sun.

## What Your Compressor Fridge Actually Draws

The other half of the equation gets fuzzier, because fridge power draw isn't a fixed number — it's a duty cycle, and duty cycle moves with ambient temperature.

Real measured data on common 12V compressor fridges (Dometic, ARB, and similar):

- Compressor running: 30–75W depending on model, with a brief startup spike (5–6A) each cycle
- Mild weather (20–25°C ambient): 30–40% duty cycle, landing around 15–20Ah/day
- Hot weather (30–35°C ambient): 50–60% duty cycle
- Extreme heat (35°C+): 70–80% duty cycle, and daily draw can climb past 30Ah

One owner's logged ARB data put daily consumption anywhere from 17Ah to 55Ah depending on whether it was running as a fridge or a freezer in hot conditions — a 3x spread from the same unit. Manufacturer spec sheets tend to quote the low end. Your actual climate decides which end you land on.

## Where the Math Actually Breaks

400W isn't inherently wrong for a fridge-only load. It breaks in three specific, predictable situations:

**Hot climate plus a cloudy stretch.** Heat pushes your fridge into its 50–80% duty cycle right as clouds cut your solar input by half or more. This is the worst-case pairing, and it's common — summer thunderstorm systems in the Southeast and Gulf Coast do exactly this.

**Flat, unadjustable roof mounting in winter or at higher latitude.** A flat panel loses efficiency to the sun's low winter angle in a way a tilted or adjustable panel doesn't. Combined with shorter winter peak-sun-hour windows, output can fall 60–75% below summer numbers on the identical hardware.

**Added loads beyond "just a fridge."** Most vanlife power budgets that fit inside 400W assume 80–150Ah/day total consumption. Add Starlink, a CPAP, or a laptop running most of the day, and you can push past 180Ah/day — a load class every solar sizing guide puts in a different, higher wattage bracket.

None of these are edge cases. They're the normal conditions of actually living in a van somewhere other than the Arizona desert in July.

## The Battery Bank Does the Work Solar Can't

The honest fix isn't always "buy more panels." A 400W array paired with an undersized battery bank fails during any multi-day cloudy stretch, full stop — no amount of panel wattage changes that if the battery can't hold a buffer. The standard rule of thumb pairs roughly 100Ah of lithium battery per 200W of solar, sized for 2–3 days of autonomy: enough stored capacity to run the fridge and everything else through a stretch of bad weather without any solar input at all. A 400W system backed by only 100Ah of lithium is undersized regardless of panel wattage; the same 400W backed by 300–400Ah of lithium can absorb the bad days that would otherwise drain a smaller bank.

If you're running an older PWM charge controller instead of MPPT, that's worth fixing before you touch the panels — PWM tops out around 70–80% efficiency versus MPPT's 95–99%, meaning a PWM system can lose 15–30% of what your panels are already producing before it ever reaches the battery.

## The Verdict

400W is genuinely enough for a compressor-fridge-only setup if you're mostly in the Sun Belt, your panels tilt or you can angle the van, your total daily draw stays under about 150Ah, and your battery bank is sized for at least 2 days of autonomy. It is not enough — and no amount of "just add a panel" fixes it on its own — if you're running flat-mounted panels through a northern winter, stacking on a Starlink or CPAP, or relying on a battery bank too small to bridge a cloudy week. Match the system to where you actually park, not to the average build featured in someone else's YouTube video.
