# S4DS Website

TCET S4DS website featuring an interactive 3D hero, scroll-driven archive,
and animated contact experience.

The project is structured into independent Home, Team, Events, and Gallery
pages for collaborative development.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis
- Three.js
- ESLint + Prettier

## Development

```bash
npm install
npm run dev
```

The development server runs on port `3001`.

## Build

```bash
npm run build
npm run preview
```

## Checks

```bash
npm run lint
npm run format:check
npm test
```

Format the source with:

```bash
npm run format
```

## Structure

```text
src/
  App.tsx
  main.tsx
  config.ts

  components/
    Shared navigation, modal, cursor and page transition

  pages/
    Home/
      Hero/       Hero UI, Three.js scene and freeze effects
      Archive/    Archive UI, cards and interactions
      Footer/     Contact UI and Three.js scene
      text/       Home text effects

    Team/
    Events/
    Gallery/

  lib/
    Shared animation dependencies, lifecycle utilities and runtime types

  styles/
    Global styles and design tokens

public/
  Images, fonts, audio and static graphics

tests/
  DOM, lifecycle, navigation and scroll-math checks
```

## Collaboration

Keep page-specific components, styles and data inside the relevant page folder.

- Home: `src/pages/Home/`
- Team: `src/pages/Team/`
- Events: `src/pages/Events/`
- Gallery: `src/pages/Gallery/`

Shared navigation lives in `src/components/navigation.ts`.

Home archive and contact content lives in `src/pages/Home/homeData.ts`.

`HomeSequence` keeps Hero and Archive within the same scroll composition.
`homeAnimations.ts` manages the Home animation lifecycle, while
`initAnimations.js` defines initialization order.

React UI is written in TypeScript. Complex animation and rendering modules
remain in JavaScript where appropriate.

The Join form currently validates locally and displays a confirmation; it does
not submit data to a server.
