# S4DS Website

## Overview

The TCET S4DS website, with an interactive hero, a scroll-driven memory archive,
and an animated contact footer. Team, Events, and Gallery currently open separate
blank pages with their own background colors.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis
- Three.js
- ESLint and Prettier

## Getting Started

```sh
npm install
npm run dev
```

The development server listens on port 3001 and accepts connections from other
devices on the same local network.

## Build

```sh
npm run build
```

## Preview

```sh
npm run preview
```

## Code Quality

```sh
npm run lint
npm run format
npm test
```

## Project Structure

- `src/App.tsx` and `src/main.tsx`: application entry and page navigation.
- `src/components/`: shared navbar, join form, cursor, and page transition.
- `src/pages/Home/Hero/`: hero UI, scene, opening motion, and freeze effects.
- `src/pages/Home/Archive/`: archive UI, cards, title motion, and glare.
- `src/pages/Home/Footer/`: contact UI, typing, butterfly, and Three.js scene.
- `src/pages/Home/`: shared Hero–Archive scroll composition, ambient effects,
  text effects, and `homeData.ts` for archive memories and contact information.
- `src/pages/Team/`, `Events/`, and `Gallery/`: independent blank page components
  ready for their respective collaborators.
- `src/lib/`: shared animation dependencies, lifecycle ownership, and runtime types.
- `src/config.ts`: shared device and rendering quality detection.
- `src/styles/`: stylesheet entry, shared tokens, and existing cross-feature styles.
- `public/`: photographs, fonts, audio, and static graphics.

Update Home content in `src/pages/Home/homeData.ts`. Shared navigation links live
in `src/components/navigation.ts`.
React UI and shared contracts use TypeScript. The existing mathematical animation
and shader engines remain JavaScript modules with typed lifecycle boundaries;
their motion equations, timings, and rendering settings are kept intact.

`Home.tsx` owns mounting and cleanup. `StoryExperience.tsx` preserves the coupled
Hero–Archive DOM, and `engineMounts.js` preserves the effects' initialization order.
Scene and shader modules stay separate beside the feature that owns them.
The shared stylesheet cascade is retained in `src/styles/globals.css`.

The join form currently validates locally and shows a success message. It does
not submit requests to a server.
