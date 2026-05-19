# Animation Guide

How to add entry animations in this codebase using Chakra UI and `libs/chakraKeyframes`.

---

## Core Pattern

Animations are applied via Chakra UI's `sx` prop using CSS keyframes from `libs/chakraKeyframes`. Never use raw CSS classes or `style` attributes for entry animations.

```tsx
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";

<Flex
	sx={{
		animation: `${fadeSlideInBottom12} 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both`,
		animationDelay: "0.06s",
	}}
>
	{/* content */}
</Flex>
```

The `both` fill-mode is always required — it holds the element in its pre-animation state during any delay, and in its final state after completion.

---

## Available Keyframes (`libs/chakraKeyframes`)

Import only what you need. All keyframes fade opacity from `0 → 1` and translate from the named direction/distance.

| Export | From | Direction | Use case |
|---|---|---|---|
| `fadeIn` | `opacity: 0` | none | Pure fade, no movement |
| `fadeSlideInBottom12` | `translateY(12px)` | up | **Default for step/form content** |
| `fadeSlideInBottom50` | `translateY(50%)` | up | Large bottom-sheet entrances |
| `fadeSlideInBottom100` | `translateY(100%)` | up | Full-screen slide-up sheets |
| `fadeSlideInTop12` | `translateY(-12px)` | down | **Default for top-anchored cards (e.g. WalletCard)** |
| `fadeSlideInTop50` | `translateY(-50%)` | down | Mid-displacement top entrances |
| `fadeSlideInTop100` | `translateY(-100%)` | down | Full-height top entrances |
| `fadeSlideInLeft50` | `translateX(-50%)` | right | Sidebar / left-to-right panels |
| `fadeSlideInRight50` | `translateX(50%)` | left | Right-to-left panels |
| `rotateClockwise` | `rotate(0deg)` | — | Spinner / loading indicator |
| `rotateAntiClockwise` | `rotate(0deg)` | — | Reverse spinner |

> **Rule of thumb:** Prefer the `12` variants (`fadeSlideInBottom12`, `fadeSlideInTop12`) for content within a page. The `50` / `100` variants are reserved for large structural transitions (full-screen sheets, modals).

---

## Standard Timing Values

Centralise all timing in a feature-level `constants.ts` `ANIMATION` object rather than scattering raw strings across components. This makes systematic tuning trivial.

```ts
// features/<feature>/constants.ts
export const ANIMATION = {
	/** Top-anchored hero element (e.g. summary card at top of page) */
	HERO_IN: "0.22s",
	/** Step / form container */
	STEP_IN: "0.2s",
	/** Delay before step container starts animating in */
	STEP_IN_DELAY: "0.06s",
	/** Delay for the primary CTA button within a step */
	CTA_DELAY: "0.1s",
	/** Recommended easing — snappy ease-out that resolves quickly */
	EASING: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
} as const;
```

### Why this easing?

`cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out-quad) exits its starting position fast and decelerates sharply near the end. This gives tight, confident visual feedback compared to the browser's default `ease-out`, which lingers. Avoid spring/bounce easings for content transitions — reserve those for micro-interactions like button press states.

---

## Usage Patterns

### Step / form container (enters from bottom)

```tsx
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { ANIMATION } from "../../constants";

<Flex
	direction="column"
	gap={5}
	sx={{
		animation: `${fadeSlideInBottom12} ${ANIMATION.STEP_IN} ${ANIMATION.EASING} both`,
		animationDelay: ANIMATION.STEP_IN_DELAY,
	}}
>
	{/* form fields */}
</Flex>
```

### Hero / summary card (enters from top)

```tsx
import { fadeSlideInTop12 } from "libs/chakraKeyframes";
import { ANIMATION } from "../../constants";

<Box
	sx={{
		animation: `${fadeSlideInTop12} ${ANIMATION.HERO_IN} ${ANIMATION.EASING} both`,
	}}
>
	<WalletCard />
</Box>
```

### CTA button (staggered after container)

```tsx
<Button
	sx={{
		animation: `${fadeSlideInBottom12} 0.18s ${ANIMATION.EASING} both`,
		animationDelay: ANIMATION.CTA_DELAY,
	}}
>
	Proceed
</Button>
```

### List items / action cards (progressive stagger)

Pass an `animationDelay` prop and derive it at the call site:

```tsx
// Component definition
interface ActionCardProps {
	animationDelay?: string;
}
export const ActionCard = ({ animationDelay = "0s" }: ActionCardProps) => (
	<Box
		sx={{
			animation: `${fadeSlideInBottom12} 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both`,
			animationDelay,
		}}
	>
		{/* ... */}
	</Box>
);

// Call site — stagger each item by 0.05s
{items.map((item, idx) => (
	<ActionCard key={item.id} animationDelay={`${idx * 0.05}s`} />
))}
```

---

## Stagger Guidelines

| Scenario | Recommended stagger |
|---|---|
| 2–3 action cards | `0.05s` per item |
| 4–6 list rows | `0.04s` per item |
| 7+ rows | Skip stagger — animate container only |

Never stagger more than 4–5 items deliberately; beyond that, later items feel sluggish.

---

## Adding a New Keyframe

1. Open `libs/chakraKeyframes.js`.
2. Export a new named `keyframes` block following the naming convention: `fade[Direction][Distance]`.
3. Use pixel offsets (`12px`, `20px`) for subtle UI-level transitions; use percentage offsets (`50%`, `100%`) only for structural/layout transitions.

```js
// libs/chakraKeyframes.js
export const fadeSlideInBottom20 = keyframes`
	from { opacity: 0; transform: translateY(20px); }
	to   { opacity: 1; transform: translateY(0); }
`;
```

4. Import and use in your component — do **not** inline `keyframes(...)` inside a component file.

---

## What Not To Do

```tsx
// ❌ Inline keyframe definition inside a component
const myAnim = keyframes`from { opacity: 0; } to { opacity: 1; }`;

// ❌ Raw style attribute
<Box style={{ animation: "fadeIn 0.3s ease" }} />

// ❌ Hardcoded timing strings scattered across files instead of ANIMATION constants
animation: `${fadeSlideInBottom12} 0.35s ease-out both`

// ❌ Over-staggering — 8 items × 0.1s = last item waits 0.8s before appearing
{items.map((item, idx) => <Row animationDelay={`${idx * 0.1}s`} />)}
```
