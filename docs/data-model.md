# Data model: the blueprint graph payload

Reference notes on the JSON returned by the mock server at
`GET /api/v1/{tenant_id}/actions/blueprints/{blueprint_id}/graph`, saved verbatim
as `src/fixtures/graph.json` and typed in `src/types/graph.ts`.

## The payload is one journey ("Onboard Customer 0") described as a graph

The top-level keys typed for this app are `id`, `name`, `nodes[]`, `forms[]`, and `edges[]`. Others, including `branches`, `triggers`, `$schema`, `tenant_id`, `category`, `description`, are not used.

Blueprint Graph

- `nodes` of type `GraphNode`
  - a box on the canvas
  - `nodes[].id` looks like `form-0f58384c-…`
  - `data` is a component
    - `NodeComponent`
      - what is placed in the canvas box
      - the `data` of a node
      - `nodes[].data.id` looks like `bp_c_01jka1e…`
      - `nodes[].data.component_id` references a form template by its `forms[].id`
      - `nodes[].data.name` carries the human name like `"Form D"`
      - `nodes[].data.prerequisites` are the `nodes[].id`s this node directly depends on
- `forms` of type `FormDefinition`
  - reusable template, not a box
  - `forms[].id` looks like `f_01jk7ap2…` and `component_id` points at it
  - `forms[].field_schema` of type `FieldSchema`
    - standard JSON Schema
    - `forms[].field_schema.properties` map holds one entry per field
      - `forms[].field_schema.properties` values are of type `FieldDefinition`
- `edges` of type `GraphEdge`
  - a `{ source, target }` pair of node ids
  - restates same arrows as `prerequisites`

Traversal reads `prerequisites` because it is already the list of upstream nodes a node depends on. `edges` exists for drawing the arrow diagram; using it would require scanning all edges for `target === nodeId` to rebuild that same list.

Only `nodes[].id` and `forms[].id` are used. Be careful not to grab component id by mistake.

## Avantos's schema names in OpenAPI spec

- `ActionBlueprintGraphDescription` (graph)
- `ActionBlueprintGraphNodeDescription` (node)
- `ActionBlueprintComponentDescription` (component)
- `ActionFormDescription` (form)
- `JsonSchema` (field schema)
- `ActionBlueprintGraphEdgeDescription` (edge)

## The graph in the fixture

```
Form A ──► Form B ──► Form D ──┐
  │                            ├──► Form F
  └─────► Form C ──► Form E ───┘
```

| Node   | Direct prerequisites | Form template |
| ------ | -------------------- | ------------- |
| Form A | —                    | `f_01jk7ap2…` |
| Form B | A                    | `f_01jk7awb…` |
| Form C | A                    | `f_01jk7ayg…` |
| Form D | B                    | `f_01jk7ap2…` |
| Form E | C                    | `f_01jk7ap2…` |
| Form F | D, E                 | `f_01jk7ap2…` |

## Notes

- Node ≠ form
  - Four nodes (A, D, E, F) share one form template, and B and C
    each have their own
  - Anything stored per form instance (prefill rules) must
    be keyed by `nodes[].id`
  - Keying by `forms[].id` would make A, D, E, and F share rules
- Form names are not used
  - All three forms are named `"test form"`.
  - Display names come from `nodes[].data.name` (the component's name), not from the form
- Two ids on every node
  - Traversal must use `nodes[].id` (`form-…`) as that is what `prerequisites` reference
  - `nodes[].data.id` (`bp_c_…`) is the component's id and is not referenced
- Nodes arrive unsorted: payload order is F, D, A, C, B, E.
- Traversal must deduplicate
  - F reaches A by two paths (via D and via E)
  - Must guard against cycles with a visited set even though the data is a DAG
- Every form has the same fields: `button`, `dynamic_checkbox_group`, `dynamic_object`, `email`, `id`, `multi_select`, `name`, `notes`.

## Mock server vs. the real API

The mock server returns the same static `graph.json` for any tenant/blueprint
id, answers only that one GET, and has no save endpoint, so prefill rules live
in client state only.

Two differences from Avantos's real spec, neither acted
on:

- the real endpoint has an extra `{blueprint_version_id}` path segment
- the spec names the top-level fields `blueprint_id`/`blueprint_name` where the
  mock's JSON has `id`/`name`.

The fixture is treated as truth in this app.
