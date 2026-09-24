---
title: "Why Your Foldable Solar Panel Charges Slower Than the Box Says"
description: "A 100W foldable panel realistically delivers ~78W at best and ~50W laid flat on hot ground. The loss stack behind that, and real charge times."
faqs:
  - question: "How many watts should a 100 watt solar panel actually produce?"
    answer: "In clear midday sun with the panel angled at the sun and an MPPT charge controller, expect about 70-80W. Laid flat on hot ground and paired with a PWM controller, 45-55W is typical. Under overcast skies, 10-25W."
  - question: "Why am I not getting full wattage from my solar panel?"
    answer: "The rated wattage is measured at 1,000 W/m² of light with the cells at 25°C. In the field, panels run 20-35°C hotter than the air, which costs roughly 7-14% at a typical temperature coefficient. Other losses come from sun angle, charge controller type, cable length and partial shade. Each factor is modest, but they multiply together."
  - question: "Does a 400W solar panel produce 400W?"
    answer: "Almost never for more than a moment. Rated power is a lab number under Standard Test Conditions. Real-world peak output of 75-85% of rating in cool, clear, well-angled conditions is normal and doesn't mean the panel is defective."
publishDate: "24 September 2026"
updatedDate: "24 September 2026"
tags: ["foldable solar panels", "portable solar", "camping", "solar panels"]
---

A 100W foldable solar panel realistically delivers about **78 watts** at its best: clear midday sun, propped facing the sun, into an MPPT controller. Laid flat on warm ground and feeding a PWM controller, it's closer to **50 watts**. Neither means the panel is broken. The box number is a lab measurement, and five ordinary field losses multiply together to eat 20–50% of it before any energy reaches your battery.

**The metric: delivered watts.** This is the power that actually reaches the battery or device at a given moment, after every loss between the sun and the charge port. It's the figure that sets your charge time. The rated watts on the box come from Standard Test Conditions (STC): 1,000 W/m² of light hitting the panel head-on, with the cells held at 25°C.

## Methodology

> **Model:** Delivered watts = rated watts × heat factor × light/angle factor × controller efficiency × cable factor. The multipliers are taken from published ranges, not from our own panel tests.
> **Heat:** Cells run 20–35°C above air temperature in sun. At a typical −0.35%/°C coefficient, that costs 7–14% on a warm day.
> **Controller:** MPPT 95–98% efficient; PWM around 75–80% in typical use (real-world tests range from 68% to 92%).
> **Charge times:** Battery capacity ÷ (delivered watts × 0.9 charging efficiency), assuming steady midday output. Real days add morning and evening ramps, so treat these as best-case.

## The loss stack, one factor at a time

| Loss factor | Typical range | Best-case setup | Careless setup |
|---|---|---|---|
| Rated (STC) output | — | 100W | 100W |
| Heat (cells 20–35°C above air) | −7% to −14% | 88W (propped, airflow behind) | 85W (flat on hot ground) |
| Sun angle and light intensity | −5% to −30% | 84W (re-aimed every couple of hours) | 65W (flat, sun ~40° off-axis) |
| Charge controller | −2% to −25% | 80W (MPPT) | 51W (PWM) |
| Cables and connectors | −2% to −5% | **~78W** | **~49W** |

What the stack shows, biggest lever first:

1. **The controller is the single largest avoidable loss.** A PWM controller can cost a quarter of your output compared with MPPT. Most current power stations have MPPT inputs built in. Cheap standalone 12V setups and some budget panels still use PWM.
2. **Angle is the second.** A panel lying flat when the sun is about 40° off its face loses about 23% to geometry alone. Propping a foldable panel toward the sun and re-aiming it every couple of hours recovers most of that for free.
3. **Heat can't be avoided, only reduced.** Foldable panels lying directly on sand, rock or a car hood run hotter than panels with air behind them. Their thin, laminated backs have nowhere to shed heat.
4. **Clouds overwhelm everything else.** Under full overcast, output falls to 10–25% of rating. A 100W panel then delivers 10–25W no matter how carefully you set it up.
5. **Shade on a small area costs a lot.** Shading even a few cells, with a tent guyline, a branch or a folded flap, can cut output far more than the shaded area suggests. That depends on how the panel's cells and bypass diodes are wired.

## Realistic charge times vs. what the box implies

| Charging… | Box math | Realistic (best-case setup) | Careless setup |
|---|---|---|---|
| Phone (~15Wh) from a 28W panel's USB port | ~30 min | 2–3 hr | 3–4+ hr, or stalls in passing cloud |
| 10,000mAh power bank (~37Wh) from a 28W panel | ~1.3 hr | ~3.5 hr | 5+ hr |
| 288Wh power station from 100W | ~2.9 hr | ~4.1 hr | ~6.5 hr |
| 1,024Wh power station from 200W | ~5.1 hr | ~7.3 hr (more than a day's peak sun in spring/fall) | ~11.6 hr (two days) |

The phone row misleads most, for a reason unrelated to the panel: **USB ports cap the output.** A standard USB-A port delivers 5V at 2.4–3A, so 12–15W at most, whatever the panel's rating. Phones also negotiate lower rates when voltage wobbles. When a cloud passes, many phones stop charging and don't restart on their own when the sun comes back. Charging a power bank from the panel, then the phone from the power bank, is slower on paper but more reliable in practice.

## Is my panel defective?

Probably not, if clear midday sun gives you 70–85% of rating with the panel aimed at the sun and connected to an MPPT input. Be suspicious if you get under about 50% in those conditions. Check for a PWM controller, a damaged cable or connector, a cracked cell (common on panels that have been folded thousands of times), or partial shading you missed. Output that falls off sharply as the panel warms, beyond the 7–14% expected, can also point to a failing cell or a failing bypass diode.

## What to do about it

- **Size for the delivered watts, not the rated watts.** Plan on about 0.75× the rated watts at midday in good conditions and about 3.5 Wh per rated watt per clear summer day. Our [camping solar power breakdown](/posts/solar-power-for-camping-what-it-runs/) turns that into daily watt-hours by weather and season.
- **Prop it, aim it, shade-check it.** Tilting toward the sun, re-aiming every couple of hours and keeping airflow behind the panel is the cheapest 15–30% you'll ever recover.
- **Use an MPPT input.** If your battery's solar input is PWM, that's the upgrade that matters.
- **Charge batteries, not phones.** Put the panel's output into a power bank or power station and charge devices from that.

For how specific foldable models compare, see our [foldable solar panels guide](/posts/foldable-solar-panels/) and [best foldable solar panels for camping](/posts/best-foldable-solar-panels-for-camping/). If you're choosing what to charge, our [small solar generator weight-to-runtime comparison](/posts/best-small-solar-generator/) shows how much stored energy each size carries per pound.
