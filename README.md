# Avantos Journey Builder

## React Coding Challenge by Amanda Hinton

### To run the mock API server

```
git clone https://github.com/mosaic-avantos/frontendchallengeserver
cd frontendchallengeserver
npm start
```

Check http://localhost:3000/api/v1/1/actions/blueprints/1/graph

### To run the app

```
git clone https://github.com/amandahinton/avantos-journey-builder
cd avantos-journey-builder
npm install
npm run dev
```

Check http://localhost:5173/

### To run tests and lint

```
npm test
npm run lint
```

### Tech Stack

- React 19 with TypeScript
- Vite 8 for build and dev server
- Vitest and React Testing Library for tests
- Oxlint and Prettier for linting and formatting

### Architecture

- `src/api` — `getBlueprintGraph` fetches the blueprint graph from the mock
  server, and the `useBlueprintGraph` hook owns loading and error state so
  components just render.
- `src/graph` — pure lookup and traversal logic: direct dependencies come
  straight from a node's `prerequisites`, and transitive dependencies come from
  walking those ids upstream with a visited set, so a node reached by two paths
  is listed once.
- `src/prefill` — the `PrefillDataSource` interface, the four sources,
  `dataSourcesRegistry` (array order is display order), mapping state
  (`nodeId → fieldKey → SourceRef`) in a reducer behind a provider, and
  `deriveSourceRefLabel`, which resolves a stored ref back to display text
  through the sources.
- `src/components` — `FormList`, `PrefillPanel`, `FieldRow`, and
  `DataElementModal`; the modal renders whatever sources it is given and knows
  nothing about which ones exist.
- `App` composes the layers: it fetches the graph, holds the selected node, and
  passes `dataSourcesRegistry` to the panel — components never name the
  registry; they take sources as props.

Reference notes on the payload — how nodes, forms, and ids relate — live in
`docs/data-model.md`.

### Adding a data source

A data source is one object implementing `PrefillDataSource`: an `id`, plus
`getDataGroups` returning labeled groups of selectable elements. Every source
is offered `{ graph, nodeId }` and destructures only what it needs.

```ts
// src/prefill/sources/clientOrganisationSource.ts
import type { DataGroup, PrefillDataSource } from "../types"

export const clientOrganisationSource: PrefillDataSource = {
  getDataGroups(): DataGroup[] {
    return [
      {
        dataElements: [
          { id: "organisation_address", label: "organisation_address" },
          { id: "support_email", label: "support_email" },
        ],
        id: "client-organisation",
        label: "Client Organisation",
      },
    ]
  },
  id: "client-organisation",
}
```

Register it in `src/prefill/dataSourcesRegistry.ts` — array order is display
order:

```ts
export const dataSourcesRegistry: PrefillDataSource[] = [
  actionPropertiesSource,
  clientOrganisationSource,
  directDependenciesSource,
  transitiveDependenciesSource,
  globalDataSource,
]
```

No component, state, or derivation code is touched,
and the new elements are immediately searchable and pickable in the modal.
Commit
[`7a0c0c4`](https://github.com/amandahinton/avantos-journey-builder/commit/7a0c0c4)
is a worked example.
