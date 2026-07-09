---
title: "NEC Article 705 in Plain English: Portable and Grid-Tied Solar Interconnection"
description: "What NEC 705 actually requires for solar and battery interconnection — load-side vs. supply-side connections, the 120% rule, the AHJ sign-off process, and what inspectors look for."
publishDate: "6 July 2026"
updatedDate: "6 July 2026"
---

> Informational only. Always confirm details with your local Authority Having Jurisdiction (AHJ) and the current NEC edition they enforce.

## What Article 705 Actually Covers

Article 705 is the rulebook for any power source that runs in parallel with the utility — grid-tied solar inverters, solar-plus-storage systems that can export to the grid, wind and fuel cells, and microgrids that connect and disconnect from the utility.

When you interconnect solar or storage to a building that already has utility service, 705 sits on top of:

  * **Article 690** — PV wiring, overcurrent protection, disconnects, rapid shutdown
  * **Article 706** — energy storage systems (batteries)
  * **Article 230** — services and service conductors
  * **IEEE 1547 and UL 1741** — how inverters behave with the grid

The intent: don't overload buses or conductors when you add a new source, use listed equipment, provide clear disconnects and labeling, and coordinate with the utility whenever you're exporting power.

* * *

## Portable vs. Building-Connected Solar

Most small portable systems — camping "solar generators," an RV system that isn't hard-wired into the building — are **not** normally under NEC 705. Standalone or plug-in setups that don't alter building wiring generally fall outside its scope. The moment you hard-wire a portable system into a building's wiring, or backfeed a panel or receptacle, you're in 705/690/706 territory.

* * *

## Load-Side vs. Supply-Side Interconnection

Article 705 recognizes two grid-tie points.

**Load-side connections (705.12)** land the inverter output on a breaker in a panelboard, subject to busbar and feeder ampacity rules. This is the most common approach for residential (7–15 kW) systems — lower cost, often no service rework, but limited by busbar ampacity.

**Supply-side connections (705.11)** tap in between the meter and the main service disconnect, treated similarly to service conductors under Article 230. These are typically chosen when the main panel bus is too small for 705.12, the system is large, or multiple sources are involved. Supply-side taps require properly sized conductors, overcurrent protection and disconnects, grounding and bonding per Article 250, and almost always utility approval.

* * *

## The 120% Rule and Other 705.12 Capacity Rules

All of 705.12 comes down to one idea: don't overload the bus or feeder when you backfeed it.

**Standard "100% rule" — 705.12(B)(3)(1):** busbar ampacity must be ≥ main OCPD rating + 125% of the power source's output circuit current. Satisfy this and the source breaker can go anywhere on the bus.

**The 120% rule — 705.12(B)(3)(2):** a permissive exception when the main and source breakers sit at opposite ends of the busbar — `[main OCPD + 125% of source output] ≤ 120% of busbar ampacity`. For a common residential example: a 200A bus with a 200A main allows 240A total (120%), leaving 40A for backfeed at 125%, or roughly 32A continuous inverter output (about 7.6 kW at 240V) — provided the solar breaker sits at the opposite end from the main and carries the required "do not relocate" label.

If the 120% rule doesn't work, typical options are derating the main breaker, a supply-side interconnection under 705.11, a listed Power Control System (PCS) under 705.13 that dynamically limits bus current, or a service upgrade.

* * *

## AHJ Sign-Off Process

Your AHJ — building department, fire marshal, utility inspector, or some combination — signs off in stages:

1. **Design & plan review.** A one-line diagram showing the 705.11 vs. 705.12 connection and all disconnects, busbar calculations, conductor/OCPD sizing, and equipment listings (UL 1741 for inverters, UL 9540 for storage).
2. **Installation.** Equipment installed per plans and manufacturer instructions, correct breaker sizes and locations, required directories and placards.
3. **Inspection.** The inspector checks the connection type against the approved method, verifies busbar and feeder calculations match the field installation, confirms labels and placards (including the power source directory and any "do not relocate" label), checks equipment listings, and confirms disconnects and grounding.
4. **Utility permission to operate (PTO).** Even after AHJ sign-off, the utility may review the as-built documentation before the system can run in grid-parallel mode.

For the full pre-inspection walkthrough — permits, wiring, battery clearances, and what to ask your AHJ before they show up — see the [AHJ Inspection Checklist](/notes/ahj-inspection-checklist/).

* * *

## What Inspectors Commonly Look For (and Fail)

  * **Wrong 705 method chosen** — a load-side connection that violates busbar limits when supply-side or a PCS was needed
  * **Missing or incorrect busbar/OCPD calculations**, especially misapplied 120%-rule math
  * **Breaker placement** — for the 120% rule, the PV/ESS breaker must be genuinely at the opposite end from the main, and it must stay there
  * **Equipment listing and labeling** — UL 1741 on inverters, listed transfer equipment, any PCS/EMS configured per its listing
  * **Missing labels** — the power source directory at the service entrance, the "do not relocate" label, rapid-shutdown and ESS warnings
  * **Conductor sizing and protection** — ampacity per 705.28 and Article 310, correct overcurrent protection and terminations

* * *

## How Article 706 (Batteries) Fits In

Article 706 covers energy storage systems — batteries, flywheels, capacitors with at least 1 kWh capacity. When a battery can feed the premises wiring, it becomes another "power production source" under 705: its AC export capacity has to be included in the 705.12 bus and breaker calculations, and its interconnection point must comply with 705.11/705.12 just like solar. Adding a battery turns a simple PV interconnection into a multi-source system that still has to satisfy the same bus and conductor limits — see the [solar battery buyer's guide](/posts/solar-battery-buyers-guide/) for the sizing and installation side of that math.

* * *

## Plug-and-Play and UL 1741 SA

UL 1741 is the core inverter and interconnection safety standard for North America. Traditional UL 1741-certified inverters handle basic anti-islanding and shut down on over/under voltage or frequency; **UL 1741 SA and SB** add smart-inverter functions — frequency-watt and volt-var response, ride-through, tighter grid coordination (e.g., California Rule 21).

This is the standard behind the growing plug-in/plug-and-play micro-inverter category. But NEC 705 and 690 still apply the moment these systems backfeed premises wiring, and many AHJs and utilities are cautious about receptacle-backfed plug-in PV — it's easy to exceed branch-circuit and bus capacities, and hard to enforce proper labeling and breaker placement. Where it's allowed, expect limits on total capacity and a requirement that the interconnection stay non-permanent (no modifications to service equipment). See the [plug-and-play solar panels guide](/posts/plug-and-play-solar-panels/) for the honest take on what these systems can and can't do.

* * *

## Practical Takeaways

  * Decide early whether you're going load-side or supply-side — don't force a 705.12 fit where a 705.11 tap or a PCS would be cleaner
  * Run the busbar math for every panel you backfeed, including the 120% check where it applies
  * Don't assume "120% always works" — it's conditional and often fails on small busbars
  * Treat a battery as another source: add its AC export to PV when doing 705 calculations
  * Document everything for your AHJ — busbar calcs, UL listings, interconnection method, PCS details
  * A portable power station feeding loads directly is usually outside Article 705; the moment it backfeeds building wiring, it's a 705 interconnection like any other

This framework should hold across current and near-future NEC cycles (2023–2026), with the details continuing to evolve around power control systems, storage classification, and newer UL standards.

* * *

### References

1. [NEC 705 Explained: Interconnecting Power Production Sources](https://expertce.com/learn-articles/nec-article-705-interconnection-explained/)
2. [Code Corner: 2020 NEC 705.12(B)(3)(1) and (2)](https://www.mayfield.energy/technical-articles/code-corner-2020-nec-705-12b31-and-2/)
3. [Solar Interconnection Methods: Supply-Side And Load-Side](https://www.solarpermitsolutions.com/blog/solar-interconnection-supply-side-load-side)
4. [NEC 705.12(B)(3)(1) & (2) Load-Side Source Connections – Interpretation](https://www.solarbuildermag.com/news/nec-2020-705-11-load-and-supply-side-connections/)
5. [NEC Solar and Storage Regulations Explained](https://avilasolar.com/nec-solar-and-storage-regulations-explained/)
6. [Energy storage systems – NEC Article 706, IAEI Magazine](https://iaeimagazine.org/2019/2019march/energy-storage-systems-nec-article-706/)
7. [2026 NEC Updates for Solar and Energy Storage Systems](https://www.mayfield.energy/technical-articles/2026-nec-updates-for-solar-and-energy-storage-systems/)
8. [2023 NEC Solar Code Guide for Installers](https://www.greenlancer.com/post/2023-nec-solar)
9. [What You Should Know About Solar Power and Electrical Code Compliance](https://www.ecoflow.com/us/blog/solar-power-electrical-code-compliance)

---

Related: [NEC Codes for Solar and Energy Systems](/notes/nec-codes-explained/) · [AHJ Inspection Checklist](/notes/ahj-inspection-checklist/) · [Solar Battery Buyer's Guide](/posts/solar-battery-buyers-guide/) · [Plug-and-Play Solar Panels](/posts/plug-and-play-solar-panels/)
