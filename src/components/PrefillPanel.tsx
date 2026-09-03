import { getFormForNode, getNodeById } from "../graph/lookup"
import { deriveSourceRefLabel } from "../prefill/deriveSourceRefLabel"
import { usePrefill } from "../prefill/usePrefill"
import FieldRow from "./FieldRow"
import type { PrefillDataSource } from "../prefill/types"
import type { BlueprintGraph } from "../types/graph"

interface PrefillPanelProps {
  graph: BlueprintGraph
  nodeId: string
  sources: PrefillDataSource[]
}

export default function PrefillPanel({
  graph,
  nodeId,
  sources,
}: PrefillPanelProps) {
  const { dispatch, prefillMappings } = usePrefill()
  const node = getNodeById({ graph, nodeId })
  const form = getFormForNode({ graph, node })
  const fieldKeys = Object.keys(form.field_schema.properties)
  const nodeMappings = prefillMappings[nodeId] ?? {}

  return (
    <section>
      <h2>{node.data.name}</h2>

      <h3>Fields</h3>
      <ul aria-label="Fields">
        {fieldKeys.map((fieldKey) => {
          const sourceRef = Object.hasOwn(nodeMappings, fieldKey)
            ? nodeMappings[fieldKey]
            : undefined
          const mappedLabel = sourceRef
            ? deriveSourceRefLabel({ graph, nodeId, sourceRef, sources })
            : null

          return (
            <li key={fieldKey}>
              <FieldRow
                fieldKey={fieldKey}
                mappedLabel={mappedLabel}
                onClear={() =>
                  dispatch({ fieldKey, nodeId, type: "CLEAR_MAPPING" })
                }
              />
            </li>
          )
        })}
      </ul>

      <h3>Available data</h3>
      {sources.map((dataSource) => (
        <section key={dataSource.id}>
          <h4>{dataSource.label}</h4>
          {dataSource.getDataGroups({ graph, nodeId }).map((dataGroup) => (
            <div key={dataGroup.id}>
              <p>{dataGroup.label}</p>
              <ul aria-label={dataGroup.label}>
                {dataGroup.dataElements.map((dataElement) => (
                  <li key={dataElement.id}>{dataElement.label}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </section>
  )
}
