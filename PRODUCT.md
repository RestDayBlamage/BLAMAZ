# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
A mix, with no single primary audience (confirmed by the owner):
- friends and family following the trips,
- cyclists who might want to ride along or get in touch,
- brands or partners sizing the crew up.

The site has to work for all three without pushing any of them through a funnel.

## Product Purpose
A one-page showcase for BLaMaZ, a bikepacking crew that rides one long summer trip across Europe every year (2022–2026 so far). It shows the trips (routes, distances, countries), the nights (wild camps and campsites), and the attitude behind them. Success means a visitor understands what the crew does, explores a trip, and can reach the crew by email, Instagram, Strava or Komoot.

## Positioning
"Blamage means failure. BLaMaZ doesn't mean defeat." The crew celebrates the wrong turns, storms, broken spokes and improvised camps, and does not present a polished performance. No other crew has its exact routes, camp spots and stories. The real GPX traces and camp coordinates are the proof.

## Operating Context
- Trips are recorded on Strava/Garmin. Simplified GPX files (no time or heart rate) are published in `public/data/<year>/`, and raw files stay private in `gpx-src/`.
- Camp spots are hand-collected coordinates in `src/data/camps.js`.
- Photos and video are the crew's own. Originals are in `media-src/` and web versions in `src/assets/images` and `public/media`.
- Hosted on GitHub Pages at `/BLAMAZ/`. Cloudflare Pages and an own domain are being considered for later.

## Capabilities and Constraints
- React 19 + Vite single page with Leaflet maps, a three.js footer logo and GSAP menu.
- Copy is in English.
- **Crew members stay anonymous**: no names, headcount or home town on the site (owner's decision).
- Trip stories must come from real data: GPX traces, Strava, camp list, or facts the owner states. Never invent incidents.
- Open: `camps.js` labels many Italian 2025 spots "Calcinaia" (probably a copy error), so place names there are unreliable.

## Brand Commitments
- The name is written **BLaMaZ**. The trip names are written as given ("Rest Day Blamage", "Labubu Macharelli", "Schnell wie Niki Lauda", "Italo Disco", "Pogi Team").
- The footer line "Blamaż.vc © … All rights reserved" is intentional and stays.
- Voice: self-deprecating, chaos-friendly, short sentences. Examples: "the night we accidentally camped on a military training ground", "Laughing at mistakes, and riding anyway".

## Evidence on Hand
- 5 trips with km, days, elevation, average speed and countries (`src/data/trips.js`). 49 camp spots, including the "Military Base Chur" night.
- Facts derived from the GPX traces:
  - 2024 Italo Disco crossed the Splügen Pass between Thusis and Chiavenna in September. The simplified trace shows about 1 982 m; the pass itself is over 2 000 m. The crew says the climb took all day and it was snowing at the top.
  - 2023 Rest Day Blamage climbed to about 1 347 m on Učka above the Adriatic, near Opatija.
  - 2026 Pogi Team rode the Vršič Pass (1 604 m), Slap Peričnik and Dražgoše on 22–24 July 2026.
- There are no testimonials, press, sponsors or member bios, and none may be fabricated.

## Product Principles
1. Real traces over claims: every number and place on the page comes from the GPX, camp or trip data.
2. Failure is the brand: wrong turns and mishaps get the spotlight, not hidden.
3. Explore, don't funnel: maps, trips and stories invite wandering; contact stays one clear step away.
4. The crew stays a crew: show the group and the rides, not individuals.

## Accessibility & Inclusion
WCAG AA contrast, keyboard-operable menu, modal and maps, respect for `prefers-reduced-motion`, and touch targets of at least 44 px.
