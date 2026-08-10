# AGENTS-frontend.md — Frontend Structure Order

Read `AGENTS.md` first for the cross-cutting rules. This file is the canon for **UI /
component / page** work: where things go and how a component file is shaped. Goal: no
more "one file with an `interface`, a `fetch`, some data, and JSX" mush.

## Directory tree (canon)

```
src/
  app/ (or pages/)               routes — THIN: composition + data-load only
    <feature>/
      page.tsx                   assembles the feature, little logic
      _components/               private subcomponents of this feature
      hooks/                     useXxx — feature logic (state, effects, fetch)
      utils/                     pure helpers (1 function = 1 file, no JSX)
      types/                     <feature>.types.ts (+ index.ts barrel)
      data/                      static data / form config for this feature
      styles.ts                 long class-string constants (optional)
  components/
    ui/                          primitives: button, input, container, modal
    shared/                      reusable app components: Card, Pagination, StarRating
    layout/                      header/ footer/ nav
  hooks/                         GLOBAL hooks (used by 2+ features)
  utils/                         GLOBAL pure helpers
  types/                         GLOBAL domain types (product, order, cart …)
  lib/                           infra clients (db, auth, http, cn/utils)
  store/ (or contexts/)          global state
  data/ constants/               global static data / constants
```

Start **local** (inside the feature). Promote to `components/shared`, `hooks/`, `utils/`,
or `types/` only when a **2nd feature** needs it. Do not pre-globalize.

## Component anatomy (fixed section order in the file)

Every component file follows this order — top to bottom:

1. **Imports**
2. **Props type** — tiny/one-off → inline `type Props = { … }`; reused → import from
   `types/`
3. **Hooks + derived data** — call hooks, compute derived values here
4. **Handlers** — event handlers (`handleClick`, `onSubmit`)
5. **`return` JSX** — thin, declarative, reads like a template

Computation, `fetch`, and business logic do **not** live in the render body — push them
into a hook or a util.

## Thick hook, thin JSX

The reference pattern: a card/page component delegates all logic to hooks and only
assembles subcomponents.

```tsx
// GOOD — OrderCard.tsx
export default function OrderCard({ order }: OrderCardProps) {
  const delivery = useDeliveryData(order)
  const pricing  = useOrderPricing(order)
  return (
    <article>
      <OrderHeader order={order} />
      <DeliveryInfo {...delivery} />
      <PriceSummary {...pricing} />
    </article>
  )
}
```

If a component grows a `useEffect` + `fetch` + reduce + 200 lines of JSX, that logic
belongs in `hooks/useX.ts` and the markup in `_components/`.

## Types

- Props, state shapes, and API-response shapes go in `types/` — co-located
  `<feature>.types.ts`, or global `src/types/name.ts` for shared domain types.
- **Never declare the same shape in two components.** Define once, import everywhere.
- Small one-off props types may stay inline at the top of the component.

## Data & constants

- Long class lists, option maps, form field configs, lookup tables → `data/`,
  `constants/`, or `styles.ts`. Do **not** inline big literals inside a component.

## State

- Local UI state → `useState`.
- Shared within a feature → a store/context slice.
- Server cache → **one** data layer (RTK Query / react-query), not scattered `fetch`.
- Don't mix three approaches in one feature without a reason.

## Styling

- Utility-first classes + the `cn()` helper for conditional classes.
- Long/variant-heavy class sets → `styles.ts` constants or `cva`.
- Use existing theme tokens and existing icon set before adding new ones.

## Anti-patterns (do NOT do)

- ❌ `interface` + `fetch` + data array + JSX all in one file
- ❌ business logic / data-fetch inside the JSX render body
- ❌ the same type declared in two components
- ❌ a helper copy-pasted into a second feature (lift it to global `utils/`)
- ❌ a 300-line component with no `_components/` split
