import { useBlueprintGraph } from "./api/useBlueprintGraph"

const TENANT_ID = "1"
const BLUEPRINT_ID = "2"

export default function App() {
  const { graph, error } = useBlueprintGraph({
    tenantId: TENANT_ID,
    blueprintId: BLUEPRINT_ID,
  })
  return (
    <>
      <h1>Journey Builder</h1>
      {error && <p role="alert">{error}</p>}
      {!error && !graph && <p>Loading…</p>}
      {graph && <pre>{JSON.stringify(graph, null, 2)}</pre>}
    </>
  )
}
