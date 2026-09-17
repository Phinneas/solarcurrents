---
title: "NEC 690 and UL 1741: What Home Solar Code Compliance Actually Requires"
description: "NEC Article 690 and UL 1741 are the two codes every home solar or battery-backup system must clear. What each actually requires, what an inspector checks, and how battery retrofits change the math."
publishDate: "17 September 2026"
updatedDate: "17 September 2026"
coverImage:
  src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000"
  width: 2000
  height: 1331
  alt: "Electrician inspecting a home solar disconnect and wiring panel"
tags: ["NEC 690", "UL 1741", "code compliance", "permitting", "battery backup"]
---

> Informational only. Always confirm current requirements with your local Authority Having Jurisdiction (AHJ) and the NEC edition they've adopted — adoption lags the national code by a cycle or more in many states.

Every home solar or battery-backup system in the US has to clear two separate hurdles before an inspector signs off: **NEC Article 690**, the wiring and installation code, and **UL 1741**, the product-safety standard the inverter itself has to be certified against. Under 690.12, the array's conductors have to drop to 30 volts (outside the array boundary) or 80 volts (inside it) within 30 seconds of rapid-shutdown activation — a specific, testable number, not a vague safety gesture. That single spec is the clearest illustration of what these two codes are actually for: 690 governs how the system is built and labeled on-site; UL 1741 governs whether the inverter itself is allowed to be part of that system at all.

## What NEC Article 690 covers

Article 690 is the installation chapter of the National Electrical Code (NFPA 70) for solar PV systems, standalone or grid-interactive. It defines circuit sizing and overcurrent protection, grounding and bonding, disconnect placement, labeling, and — since 2014, expanded every cycle since — rapid shutdown.

**Rapid shutdown (690.12).** The requirement exists so firefighters don't get shocked by a live rooftop array while cutting a hole in a roof. Two compliance paths satisfy it: module-level power electronics (MLPE, i.e., microinverters or DC power optimizers on every panel) or a listed PV hazard control system. The 2023 NEC cycle added an exception for PV on non-enclosed, detached structures — a carport or a freestanding solar trellis no longer needs rapid shutdown, since there's no roof for a firefighter to cut into.

**Disconnects and labeling.** 690 requires a readily accessible PV system disconnecting means, and every disconnect has to carry a permanent, weather-rated label — "SOLAR AC DISCONNECT" or "SOLAR DC DISCONNECT," with voltage and current ratings. Conduit runs need labels at regular intervals identifying DC, AC, and grounding conductors separately. This sounds like paperwork; in practice it's one of the most common reasons an inspection fails. Hand-written or taped labels fade and peel, and most AHJs will reject them outright — the label has to be engraved or printed with UV-resistant ink.

**Grounding, bonding, and conductor sizing.** 690 also sets the rules for how array frames and equipment are bonded to ground and how DC and AC conductors are sized and protected — details that matter for inspection but that a homeowner mostly needs to know exist, since they're the installer's responsibility to get right.

## What UL 1741 covers — and what it doesn't

UL 1741 is a product certification, not an installation code. It tests the inverter itself, before it ever reaches a job site, for anti-islanding protection, voltage and frequency trip limits, DC injection limits, and waveform quality. The anti-islanding requirement is specific and testable: when the grid goes down, the inverter has to detect that it's suddenly powering an isolated "island" of wiring and stop exporting within 2 seconds. Without a UL 1741 listing, an inverter simply isn't allowed to interconnect with US grid power — it's the credential 690's disconnect and labeling rules assume is already in place.

Two supplements build on the base standard: **SA**, added in 2016 for smart-inverter grid-support functions (voltage/frequency ride-through, volt-var response) tied to California's Rule 21; and **SB**, published in 2021, which aligns the standard with the full IEEE 1547-2018 grid-interconnection standard and is now the version California and most IEEE-1547-adopting states require for new interconnection applications. If a spec sheet only claims SA in 2026, that's not a red flag by itself, but it does mean the inverter's grid-support design predates the current baseline most utilities ask for. The anti-islanding and inverter-certification details — including where SA/SB claims get misleading on plug-in solar spec sheets — are covered in more depth in [UL 1741 SA: What Anti-Islanding Actually Means for Plug-In Solar](/posts/ul-1741-sa-anti-islanding-plug-in-solar/).

## What a permitting inspector actually checks

An inspector isn't re-deriving code from scratch on-site — they're verifying the installed system matches what was already approved on paper. The checklist in practice covers:

  * The installed equipment and wiring match the approved permit plan set and one-line diagram
  * Rapid-shutdown equipment is not just present but actually wired to its initiator — "installed but not connected" is one of the most common failures
  * Disconnect labels are permanent and correctly worded, at the correct locations
  * Conduit runs and conductor labeling match the approved diagram
  * Equipment listings are visible and correct — UL 1741 for the inverter, UL 9540 for any battery
  * Grounding, bonding, and overcurrent protection are installed per the plan

Fail any one of these and the system doesn't get permission to operate, regardless of how well it generates power. For the fuller pre-inspection walkthrough — what to check before the inspector arrives — see the [AHJ Inspection Checklist](/notes/ahj-inspection-checklist/).

## How this changes when you retrofit a battery

Adding a battery to an existing solar system doesn't just bolt hardware onto a wall — it pulls in a code article that a solar-only install never had to satisfy: **NEC Article 706**, which covers energy storage systems of 1 kWh or more. Three things change once a battery enters the picture:

**The inverter often gets replaced.** Most existing grid-tied string inverters aren't rated to manage battery charge/discharge; retrofits commonly swap in a hybrid inverter, which needs its own UL 1741 listing — the old inverter's certification doesn't carry over.

**The interconnection math gets redone.** If the battery can export power back to the grid, its AC output has to be added to the same busbar and breaker calculations — including the 120% rule — that governed the original solar interconnection under Article 705. A system that comfortably cleared 705.12 with solar alone can fail it once battery export capacity is added. That interconnection math is covered in full in [NEC Article 705 in Plain English](/posts/nec-705-plain-english-solar-interconnection/).

**The battery itself needs its own listing and clearances.** UL 9540 certification, fire and ventilation clearances, and disconnect and labeling requirements under 706 apply on top of whatever 690 already required for the PV side. In practical terms: retrofitting a battery onto an existing system is closer to a second permit application than an add-on, and it's worth budgeting inspection time and fees accordingly. Sizing and installation specifics for the battery side are in the [solar battery buyer's guide](/posts/solar-battery-buyers-guide/).

## The bottom line

NEC 690 and UL 1741 answer two different questions — one about how the system is wired, labeled, and shut down on-site; the other about whether the inverter is certified to be there at all — and a home solar or battery-backup system has to clear both before it's allowed to operate. Neither code guarantees the system was designed well or priced fairly; they only guarantee it won't electrocute a firefighter or backfeed a dead line. Budget for both the paperwork and the possibility that a battery retrofit reopens interconnection math a solar-only install never had to run.

* * *

### References

1. [690.12 Rapid Shutdown of PV Systems on Buildings](https://up.codes/s/rapid-shutdown-of-pv-systems-on-buildings)
2. [Understanding the 2023 NEC Changes to Rapid Shutdown Requirements](https://www.solarpermitsolutions.com/blog/2023-nec-rapid-shutdown-requirements-690-12-exemptions)
3. [Solar PV Labeling Requirements: NEC 690 Complete Guide](https://www.solarpermitsolutions.com/blog/solar-pv-labeling-requirements)
4. [UL 1741 & Rule 21: Advanced Inverter Tests](https://www.greentechrenewables.com/article/ul-1741-rule-21-advanced-inverter-tests)
5. [UL 1741 SA vs. UL 1741 SB: Inverter Certification Guide for Solar Installers](https://www.surgepv.com/solar-compliance/usa/guides/ul-1741-sa-sb)
6. [Energy Storage Systems – NEC Article 706, IAEI Magazine](https://iaeimagazine.org/2019/2019march/energy-storage-systems-nec-article-706/)
7. [2023 NEC Solar Code Guide for Installers](https://www.greenlancer.com/post/2023-nec-solar)

---

Related: [NEC Article 705 in Plain English](/posts/nec-705-plain-english-solar-interconnection/) · [UL 1741 SA: Anti-Islanding for Plug-In Solar](/posts/ul-1741-sa-anti-islanding-plug-in-solar/) · [Solar Battery Buyer's Guide](/posts/solar-battery-buyers-guide/) · [AHJ Inspection Checklist](/notes/ahj-inspection-checklist/) · [NEC Codes for Solar and Energy Systems](/notes/nec-codes-explained/)
