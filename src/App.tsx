import { useState } from "react"
import { useBlueprintGraph } from "./api/useBlueprintGraph"
import FormList from "./components/FormList"
import PrefillPanel from "./components/PrefillPanel"
import PrefillProvider from "./prefill/PrefillProvider"
import { dataSourcesRegistry } from "./prefill/dataSourcesRegistry"

const TENANT_ID = "1"
const BLUEPRINT_ID = "2"

export default function App() {
  const { graph, error } = useBlueprintGraph({
    tenantId: TENANT_ID,
    blueprintId: BLUEPRINT_ID,
  })
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  return (
    <>
      <h1>Journey Builder</h1>
      {error && <p role="alert">{error}</p>}
      {!error && !graph && <p>Loading…</p>}
      {graph && (
        <PrefillProvider>
          <div className="columns">
            <FormList
              nodes={graph.nodes}
              onSelect={setSelectedNodeId}
              selectedNodeId={selectedNodeId}
            />
            {selectedNodeId ? (
              <PrefillPanel
                graph={graph}
                nodeId={selectedNodeId}
                sources={dataSourcesRegistry}
              />
            ) : (
              <p>Select a form</p>
            )}
          </div>
        </PrefillProvider>
      )}
    </>
  )
}
