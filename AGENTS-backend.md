# AGENTS-backend.md — Backend Structure Order

Read `AGENTS.md` first for the cross-cutting rules. This file is the canon for **API /
server / data** work. Goal: no more fat handlers where types, validation, business logic,
DB access, and docs all pile into one `route.ts`.

## Directory tree (canon)

```
src/
  api/ (or routes/)
    <resource>/
      route.ts (or handler)      THIN: parse → validate → call logic → respond
  <feature>/
    service/ (or logic/)         business logic (NO HTTP objects inside)
    validation/                  input validators for this feature
    types/                       DTO / entity interfaces (name.types.ts + index.ts)
    utils/                       pure helpers for this feature
  lib/                           infra: db client, auth, email, swagger
  utils/                         GLOBAL helpers (getUserId, calcPrices)
    validation/                  GLOBAL shared validators
  types/                         GLOBAL domain / entity types
  config/                        CONFIG object of app constants (under src, @/ alias)
```

There is no ORM-style `models/`/`entities/` requirement — entity shapes are TS
`interface`s in `types/` (plus API doc schemas). Keep them there, not inline in handlers.

## Handler layers (fixed order, one job each)

Every handler runs these steps in order and stays thin — heavy work is delegated:

1. **Auth / guard** — resolve the user; enforce role/permission **server-side**
2. **Parse input** — read body / query / params
3. **Validate** — via a validator, not ad-hoc `if`s scattered around
4. **Business logic** — delegate to `service/` or `utils/`
5. **Data access** — via the shared client from `lib/`
6. **Respond** — shape and return the response

If a handler holds parsing + a 60-line reduce + three DB calls + a Swagger block, extract
the logic into `service/`/`utils/` and keep `route.ts` as orchestration only.

## Validation

- Use **one** functional validation style returning a discriminated result:

```ts
type ApiValidationResult<T> =
  | { ok: true;  value: T }
  | { ok: false; message: string }
```

- Reference helpers: `utils/apiValidation.ts` (`getRequiredString`, `getOptionalNumber`,
  `getStringArray`, …). Do not sprinkle ad-hoc type coercion through the handler.
- Always validate incoming form/API data so bad types can't crash the app.

## Types / DTOs

- Entity shapes and request/response types → `types/` (co-located `name.types.ts` or
  global `src/types/name.ts`). **Never** declare them inline in a handler.
- Do not mix component/UI types and server types in the same file.

## Data layer

- Access the DB through **one** shared client from `lib/` (e.g. `getDB`). Do **not** spin
  up a second client per feature.
- Don't scatter raw collection/table name strings across many files — centralize them.
- Don't change a stored data format without checking every read path first.

## Auth

- **One** auth system per project. (Two parallel schemes = an anti-example — avoid it in
  new projects.)
- Resolve the current user through a single helper (e.g. `getServerUserId`); don't
  re-implement session checks per route.
- Enforce role/permission checks **inside the handler on the server**, not only in an
  edge/middleware path guard. A path guard alone leaves admin APIs unprotected.

## Docs / OpenAPI

- Add a Swagger JSDoc block above each handler; reuse shared schemas/tags.
- Ensure the spec generator scans **all** API folders (including nested admin/CMS routes),
  so no endpoints silently drop out of the spec.

## Config / env

- Centralize env access — don't scatter `process.env.X!` non-null assertions across the
  codebase. Read/validate env in one place.
- App constants (pagination, discounts, limits, OTP) live in `config/` under the `@/`
  alias — never hardcode them in handlers.

## Anti-patterns (do NOT do)

- ❌ one fat handler = parse + validate + business logic + DB access + Swagger, no layers
- ❌ entity/DTO types declared inline inside `route.ts`
- ❌ a second DB client created per feature
- ❌ two auth systems resolved differently per route
- ❌ role checks only in edge middleware, not in the handler
- ❌ dead dependencies / helpers duplicated across routes
