---
name: S4DS
description: Existing black-and-blue science-fiction identity with technical typography and immersive artwork.
colors:
  ink: "#000"
  paper: "#e8e8e5"
  blue: "#3e83f2"
  red: "#ff243d"
  line: "#92928e"
  muted: "#b5b5af"
  footer-white: "#f3f5f7"
typography:
  display:
    fontFamily: "Nippo, sans-serif"
    fontWeight: 500
    letterSpacing: "-.025em"
  technical:
    fontFamily: "Technor, sans-serif"
  body:
    fontFamily: "ArsenalSC, sans-serif"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.ink}"
    padding: "10px 16px"
  footer-wordmark:
    textColor: "{colors.footer-white}"
    typography: "{typography.display}"
---

# Design System: S4DS

## Overview

This is a descriptive record of the established site, extracted from `styles.css`, `index.html`, `connect-footer.css`, and `connect-footer.js`. Its visual identity combines a black canvas, electric blue accents, oversized technical lettering, thin instrument-like frames, and immersive artwork. The footer extends that identity within its own surface; its composition is documented in `docs/connect-footer-brief.md`.

## Colors

Blue is the primary accent for actions and interaction feedback. Paper is the principal text color; line and muted support frames and secondary information against ink. Red marks the existing recording indicator. Footer white provides the stronger contrast used by its heading, contacts, and wordmark. The footer's black-blue atmosphere, cyan feedback, luminous blue rings, and material highlights come intentionally from the user-supplied Desktop/footer scene. These local scene colors, including colors flagged by palette detectors, are not new global UI accents.

## Typography

Nippo Medium carries large display text and the footer wordmark. Technor carries navigation, primary action labels, and the footer heading. ArsenalSC is the body and annotation face; the source variable named `--mono` points to this family and does not establish a new monospace font.

Keep display lettering tightly tracked and large in relation to supporting text. The footer wordmark uses a desktop size of `clamp(120px,13.8vw,290px)` with a `.95` line height. Its heading uses `clamp(28px,3.65vw,76px)`, a `1.4` line height, and `.025em` tracking.

## Layout

The existing opening sequence is a viewport-led composition with asymmetric outer framing, thin rails, and absolute placement of artwork and type. Preserve that spatial character when extending the site; do not assume a conventional card grid.

The footer provides a scroll runway of 225svh on desktop and 230svh at widths at or below 700px, enclosing a sticky, clipped full-width stage of 100svh. Desktop places KEEP IN SYNC and two-line CONNECT WITH US at 27% from the bottom and the large S4DS wordmark at .6% from the bottom on the left, the installation in the center with its canvas inset 7% from the top, and officer contacts on the right. CONTACTS uses large white Nippo lettering. Mobile fits the heading, contacts, scene, and `31.7vw` wordmark into the same single pinned viewport: intro heading hidden, contacts at 19%, scene between 40% from the top and 15% from the bottom, and wordmark .8% from the bottom. The motion control sits at the lower right of the scene on mobile and the stage on desktop. Reduced motion makes the whole footer 100svh, removing the extra scroll runway.

## Elevation & Depth

Depth comes primarily from rendered artwork, layered story surfaces, and translucent black navigation. Thin borders and corner brackets define controls. The footer uses live 3D rings, floating textured panels, a stepped pedestal, fog, and bloom to establish depth; email hover uses cyan text and keyboard focus uses a clear cyan outline.

## Shapes

Frames, primary buttons, and the join form use square edges and fine borders. The footer uses unboxed typography and simple text email links around the circular rings, planar panels, and stepped pedestal of the supplied installation. Retain the existing form language rather than introducing a new radius scale.

## Components

Primary buttons use blue fill, dark text, a light border, and external corner marks. Navigation uses Technor with blue hover feedback. The join dialog is a bounded black panel with a light outline and square fields. Interactive controls retain visible keyboard focus.

The contact footer adapts the user-supplied Desktop/footer 3D installation, with a live code-rendered butterfly replacing its central stone. The same rings, floating panels, and pedestal serve desktop and mobile with responsive scene framing. The upper halo is raised and flatter, with a small oscillation and responsive tilt that keep its front edge above the butterfly. The previous hand silhouettes, rotating asterisk, and butterfly video are retired from the footer runtime.

Footer progress is derived from the actual footer and stage heights, so forward and reverse scrolling reproduce the same reveal states. The butterfly starts hidden and fades in across 8–60% progress. At the same time, the S4DS home link rises in reverse letter order: last S, D, 4, first S, completing by 84%. Other text reveals visual characters sequentially from heading through officer details while retaining the full text for assistive technology; keyboard focus exposes email characters immediately. Reduced motion shows all content and a static scene. Pause motion / Resume motion stops autonomous scene animation and footer particle updates; the scroll-controlled reveals remain tied to scrolling.

The footer reuses the existing space-particles renderer, including its density, speed, pointer response, and quality caps. The 3D scene lazy-loads within 400px of the viewport and suspends continuous rendering offscreen and in hidden tabs. Rendering is capped at 24fps for low quality or 30fps otherwise, with pixel ratio capped at 1 for low quality, 1.25 for mobile, and 1.5 for desktop. Renderer resources are disposed when leaving the page outside the back-forward cache. The footer brief records the direction contract and confirmed contacts; the implemented files and supplied scene establish the built details. Hero and archive remain unchanged.
## Do's and Don'ts

- Do reuse the established fonts, black ground, thin frames, and blue interaction language.
- Do keep decorative artwork separate from accessible HTML controls.
- Do preserve reduced-motion behavior and stop invisible animation work.
- Don't promote the supplied footer scene's local colors or installation composition into global rules.
- Don't invent social destinations or describe a local form as a delivered message.
