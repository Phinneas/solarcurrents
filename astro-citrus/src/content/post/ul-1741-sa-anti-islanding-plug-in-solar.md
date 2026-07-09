---
title: "UL 1741 SA: What Anti-Islanding Actually Means for Plug-In Solar"
description: "Anti-islanding isn't in the SA supplement, and it doesn't make plug-in solar legal. What UL 1741 actually covers, what SA adds, and what neither one solves."
publishDate: "6 July 2026"
updatedDate: "6 July 2026"
coverImage:
  src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000"
  alt: "Grid-tied solar panels connected through an inverter"
tags: ["plug-in solar", "balcony solar", "UL 1741", "anti-islanding", "safety standards"]
---


If you're shopping for a plug-in solar kit right now, you've seen "UL 1741 SA certified" on a spec sheet, usually right next to a paragraph about anti-islanding protection keeping utility workers safe. Both claims are true. But they're stapled together in a way that's misleading, because anti-islanding isn't what the SA supplement is about — and neither one makes the product legal to plug in where you live.

Here's what each piece actually does, and the three problems no UL certification solves.

## Anti-islanding lives in base UL 1741, not in SA

UL 1741 is the base safety standard for grid-interactive inverters, and it has required anti-islanding since long before anyone put "SA" on a box. The requirement is specific: when the grid goes down, the inverter must detect that it's suddenly feeding a dead "island" of wiring and stop exporting power within 2 seconds. That's the default under IEEE 1547-2018, the grid-interconnection standard UL 1741 tests against. (A 5-second window exists in the standard, but only if the utility explicitly agrees to it — it doesn't apply to anything you'd plug into a wall.)

The certification test isn't a formality. The inverter is connected to matched resistive, inductive, and capacitive load banks tuned to create the worst-case scenario — a local load that absorbs almost exactly what the inverter produces, so voltage and frequency barely twitch when the grid drops. The test runs at 33%, 66%, and 100% of rated output. If the inverter can detect the island and shut down within 2 seconds even then, it passes. In practice, microinverters typically disconnect well under the 2-second ceiling.

So the anti-islanding story is real, and it addresses a real hazard: a lineworker repairing a downed wire expects it to be dead, and a backfeeding inverter can make it live. What it is not is a feature of the SA supplement.

## What SA actually is — and why it's already dated

Supplement A (SA) was added to UL 1741 in 2016 to test "smart inverter" grid-support functions — voltage and frequency ride-through, volt-var response, power factor control, ramp rates. It was built around California's Rule 21 interconnection requirements. In plain terms: instead of an inverter that drops offline the instant the grid wobbles, SA-certified inverters ride through minor sags and swells and actively help stabilize the grid.

Useful, but here's the part spec sheets skip: SA has largely been superseded. Supplement B (SB), published in 2021, aligns UL 1741 with the full IEEE 1547-2018 standard and its 2020 test procedures, including communication interoperability (SunSpec Modbus, IEEE 2030.5, or DNP3). California — the state SA was written for — now requires SB certification for new interconnection applications under CPUC resolutions E-5000 series. Most other states that have adopted IEEE 1547-2018 recognize SB.

If a plug-in solar product advertises SA in 2026, that tells you the microinverter's grid-support design dates from the Rule 21 era. It's not a red flag — most name-brand microinverters made since 2020 carry both SA and SB — but "SA certified" is a weaker claim than it sounds, and it says nothing extra about anti-islanding, which the base standard already covered.

## What anti-islanding doesn't do: three gaps

**It doesn't make the product legal.** This is the big one. Anti-islanding solves the utility's safety objection, not the regulatory one. In most states, any device that exports power into your home's wiring legally requires an interconnection agreement with your utility — and plugging a solar kit into an outlet without one violates your tariff, whatever the inverter's certifications say. Utah changed this with HB 340 (signed March 2025), which exempts portable solar devices up to 1,200 watts from interconnection requirements, provided they have anti-islanding protection and certification from a nationally recognized testing lab. Maine and Virginia have passed similar laws, and roughly 31 states had plug-in solar bills in play in 2026. But if your state isn't on that short list, a UL 1741 sticker doesn't change your legal position.

**It doesn't protect your wiring.** Branch circuits are designed for one-way power flow. When a plug-in inverter backfeeds a circuit that also has loads on it, the circuit breaker can't see the combined current — the breaker only measures what flows through the panel, not what the inverter adds downstream. A 15-amp circuit can carry more than 15 amps of combined load without ever tripping. This is exactly the condition NEC Article 705's 120% rule exists to prevent in permanent installs, and it's the strongest technical argument skeptics of plug-in solar have. A 1,200-watt kit adds about 10 amps at 120 volts; on a circuit already feeding a space heater or a window AC, the math gets uncomfortable. Anti-islanding is irrelevant to this — the grid is up the whole time.

**It doesn't give you backup power.** Anti-islanding does the opposite of what many buyers assume: when the grid goes down, your plug-in solar goes down with it, within 2 seconds, by design. If you want power during an outage, you need a battery-based system that disconnects from the grid and forms its own island intentionally. A grid-tied plug-in kit will produce exactly zero watts during a blackout.

## The standard that actually matters next: UL 3700

Because UL 1741 was written for professionally installed inverters, not consumer appliances plugged into outlets, UL launched UL 3700 in January 2026 — a product-level safety standard specifically for plug-in solar systems. It covers the whole kit as an appliance: the inverter (still tested to UL 1741 underneath), plus cord-and-plug safety, shock protection at the plug prongs, and installation-free use. Utah's HB 340 was written to be compatible with it, and the first UL 3700-certified products are expected around mid-2026.

That's the certification to watch for. UL 1741 tells you the inverter behaves correctly toward the grid. UL 3700 is designed to tell you the whole product is safe in the hands of someone who has never opened an electrical panel.

## The honest bottom line

Anti-islanding works, the 2-second disconnect is real and tested under adversarial conditions, and the lineworker-safety objection to plug-in solar is largely solved at the hardware level. But "UL 1741 SA certified" on a product page is answering a question you probably weren't asking. It doesn't mean the product is legal in your state (check whether your legislature has passed a Utah-style exemption), it doesn't mean your circuit can safely absorb the backfeed (keep kits small relative to the circuit, and don't share the circuit with heavy loads), and it doesn't mean you'll have power in an outage (you won't). If a vendor leads with the certification and skips those three caveats, that tells you something about the vendor.
