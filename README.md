# S4DS Website

TCET S4DS's website features an interactive 3D hero, a scroll-driven memory
archive, and an animated contact footer. Team, Events, and Gallery are separate
blank pages ready for their collaborators.

## Stack

- React, TypeScript, Vite, and Tailwind CSS
- GSAP 3.15.0 with ScrollTrigger and Lenis 1.3.26
- Three.js 0.180.0
- ESLint and Prettier

## Development

```sh
npm install
npm run dev
```

The development server uses port 3001 and accepts connections from devices on
the same local network.

## Build and Preview

```sh
npm run build
npm run preview
```

## Checks

```sh
npm run lint
npm run format:check
npm test
```

Use `npm run format` to format the source.

## Structure

```text
src/
  App.tsx, main.tsx, config.ts
  components/       Shared navigation, modal, cursor, and page transition
  pages/
    Home/
      Hero/         Hero UI, scene, and freeze effects
      Archive/      Archive UI, cards, and glare
      Footer/       Contact UI, butterfly, and scene
      text/         Home text effects
      Home.tsx, HomeSequence.tsx, HomeBackgrounds.tsx
      homeAnimations.ts, initAnimations.js, homeData.ts
    Team/           Team.tsx
    Events/         Events.tsx
    Gallery/        Gallery.tsx
  lib/              Shared animation dependencies, lifecycle, and runtime types
  styles/           Global styles and design tokens
public/             Images, fonts, audio, and static graphics
tests/             DOM, lifecycle, navigation, and scroll math checks
```

## Collaboration

Work inside the folder for your page. Home's archive and contact content lives
in `homeData.ts`; shared navigation links live in `components/navigation.ts`.
Fonts and brand colors are defined in `styles/site.css` and `styles/tokens.css`.

`HomeSequence` keeps Hero and Archive in one scroll composition.
`homeAnimations.ts` owns Home's animation lifecycle, and `initAnimations.js`
lists its initialization order. Scene and shader files remain beside the
feature that uses them. React UI uses TypeScript; animation and rendering
modules also use JavaScript.

The Join form validates locally and displays a confirmation. It does not
submit requests to a server.
