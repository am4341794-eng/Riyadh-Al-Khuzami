# رياض الخزامى — Scroll-driven landing experience

A long-form, scroll-narrated landing page for **شركة رياض الخزامى المحدودة**
(Riyadh Al Khozamah Co.), a Saudi contracting and hospital-fit-out firm.

The page tells one story from the ground up: a globe, a warehouse, a truck on
the highway, a transformation into colour, an aircraft at altitude, the numbers
behind it, and an invitation to talk.

---

## Stack

| Concern            | Choice                                              |
| ------------------ | --------------------------------------------------- |
| Framework          | Next.js 16 (App Router), React 19, TypeScript       |
| Styling            | Tailwind CSS v4 (`@theme` tokens, no config file)   |
| Scroll             | Lenis                                                |
| Animation          | GSAP 3 + ScrollTrigger, MorphSVG, DrawSVG, SplitText |
| 3D                 | React Three Fiber (hero globe only)                  |
| UI transitions     | Framer Motion (`motion`) — preloader only            |

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

---

## How the motion works

### One scroll, one ticker

`SmoothScrollProvider` owns the single Lenis instance and drives it from
`gsap.ticker` rather than its own `requestAnimationFrame` loop. Scroll easing,
`ScrollTrigger.update()` and every tween therefore share one rAF callback and
stay in lockstep. `gsap.ticker.lagSmoothing(0)` is off so the page never
"catches up" after a stall.

### Scrubbed 1:1, deliberately

Every scene uses `scrub: true` (`SCRUB` in `lib/constants.ts`). The playhead is
bound to scroll position exactly, so **motion stops the moment scrolling
stops**. The smoothness comes from Lenis easing the scroll position upstream,
not from scrub lag.

### Sticky stages, not ScrollTrigger pinning

Long scenes are a tall `<section>` containing a `position: sticky` stage. This
avoids pin-spacer drift under smooth scroll and keeps the DOM honest — the
section's height *is* the scene's scroll budget.

### `useScene` — the one hook every section uses

```ts
const ref = useScene<HTMLElement>(createLogisticsTimeline);
```

It wraps `gsap.matchMedia`, so each breakpoint and the reduced-motion case gets
its own timeline, reverted automatically when the query stops matching. Builders
receive a `SceneApi`: scoped selectors, a pre-configured `timeline()`, viewport
flags, and `onCleanup()` for anything GSAP cannot revert itself (listeners,
timers, paused timelines).

> `gsap.Context#add(fn)` *executes* `fn` immediately — it does not register a
> teardown. `onCleanup` exists so scenes never make that mistake.

### Timelines live in their own files

```
animations/
  heroTimeline.ts
  logisticsTimeline.ts
  statsTimeline.ts
  ctaTimeline.ts
  disciplinesTimeline.ts
  journeyTimeline.ts        # composes the three below onto one timeline
  journey/
    timings.ts              # chapter boundaries, deliberately overlapping
    truckChapter.ts
    morphChapter.ts
    skyChapter.ts
```

---

## The scenes

**Hero — WebGL globe.** A Fibonacci dot shell, great-circle route arcs from
Riyadh, a back-side fresnel limb glow and a particle field. The canvas runs
`frameloop="demand"`: not one frame is rendered unless the scroll scrub, the
intro tween or a pointer move asks for it, so an idle page leaves the GPU quiet.
It is dynamically imported after idle and falls back to an SVG globe when WebGL
is unavailable. GSAP talks to it through `lib/sceneState.ts`, a mutable object
read inside `useFrame` — passing scroll progress as React state would re-render
the tree on every tick.

**Logistics — warehouse.** A forklift drives in, slides its forks under a
pallet, lifts and carries it out. Wheel rotation is derived from travel distance
and rounded to whole turns. The cargo and the fork carriage share identical
tween windows and easings, so the load stays locked to the forks at any playhead
position — including scrubbing backwards through the pick-up.

**Journey — truck → ribbons → aircraft.** One section, one sticky stage, one
timeline. Six `<path>` elements are re-shaped twice with `MorphSVGPlugin`, their
fills tweened on the same windows. At any scroll position the screen shows one
set of shapes mid-interpolation — there is never a frame where two illustrations
coexist, which is what removes the cut. Truck detailing fades out before the
morph and aircraft detailing fades in after, so the silhouette that morphs is
always clean. Navigation still sees three chapters via zero-height anchors.

**Disciplines.** A horizontal gallery of the six engineering specialisations,
driven by vertical scroll. The travel distance is measured from the DOM and
re-measured on refresh, so the track always lands exactly on its last card.
Card reveals are mapped to slices of the same scroll range rather than
ScrollTrigger's `containerAnimation`, which assumes the track travels leftwards
and therefore never resolves in RTL.

**Statistics.** Unpinned, so the page breathes again after three pinned scenes.
Counters write to `textContent` — a 60fps scrub costs zero React re-renders.
Charts are revealed with DrawSVG.

**CTA.** Large type via SplitText, magnetic buttons, and a pointer-tracking glow
written to custom properties so it can never collide with a scroll transform.
The project request form composes the enquiry into a WhatsApp message and hands
off to `wa.me` — the same flow the previous site used and the one this business
answers on. There is no backend, so nothing is stored or transmitted anywhere
the visitor cannot see. Validation is client-side and announced: each field owns
an error node referenced by `aria-describedby`, and focus moves to the first
problem on a failed submit.

---

## Responsive strategy

The scenes are drawn in a fixed 1600 × 900 space with
`preserveAspectRatio="slice"`, so a portrait viewport sees only a narrow
vertical strip. Rather than re-authoring each scene per breakpoint, the moving
subjects sit in a **fit group** that CSS scales and re-centres
(`[data-vehicle-fit]`, `[data-wh-fit]` in `styles/globals.css`). Timelines keep
working in the original coordinate space — no animation value changes with the
viewport.

The hero's WebGL camera pulls back on narrow viewports for the same reason.

## Accessibility

- **`prefers-reduced-motion`** is a first-class path, not a switch that freezes
  the page. Lenis never starts, every scene renders its resolved state, and the
  tall sticky sections collapse back into ordinary document flow so a visitor is
  not scrolling past several screens of a frozen image. The journey's three
  captions stack and read as prose.
- Scenes are `role="img"` with Arabic labels; decorative layers are `aria-hidden`.
- Counters expose their final value via `aria-label`.
- Skip link, visible focus rings, and a header nav that reflects the active
  chapter with `aria-current`.
- Organization JSON-LD, `sitemap.xml` and `robots.txt` — a canvas-and-SVG page
  is otherwise invisible to crawlers.

## Performance notes

- WebGL is dynamically imported, gated on an actual WebGL context test, and
  rendered on demand only.
- Only transform/opacity/filter are animated; layout is never touched during a
  scrub. Measured cumulative layout shift is ≈ 0.004.
- The ribbon bloom uses **one** SVG filter on the group rather than one per
  path, and its shapes do not morph — they are blurred past recognition, so six
  extra path interpolations a frame would buy nothing.
- Verified in a headless software renderer: the SVG-heaviest chapters (morph,
  sky) hold 60fps when not rasterization-bound, so the animation work itself is
  not the limiting factor.

## Assets

Illustrations are generated SVG, built from primitives in `lib/shapes.ts`
(circles, rounded rects, Catmull-Rom ribbons). They are placeholders in the
sense that real artwork can replace them: every animated element is addressed by
a `data-*` hook, never by a class chain or DOM position, so swapping the drawing
does not touch a line of animation code.

The company profile PDF and photography live in `public/brand/`. The previous
single-file site is preserved at `legacy/index.html`.

## Structure

```
app/            layout, page
components/
  layout/       header, footer, chapter rail, preloader, cursor
  scenes/       globe (R3F), warehouse (SVG), journey (SVG)
  sections/     one file per chapter
  ui/           SplitHeading, RevealBlock, MagneticButton, Counter, charts
animations/     one timeline per chapter
hooks/          useScene, useMediaQuery, useChapterTrigger, usePointerParallax
lib/            gsap setup, easings, constants, content, shapes, geometry
providers/      SmoothScrollProvider, ChapterProvider
styles/         globals.css — tokens, utilities, responsive fit, reduced motion
```
