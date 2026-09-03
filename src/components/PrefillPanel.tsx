import { useState } from "react"
import { getFormForNode, getNodeById } from "../graph/lookup"
import { deriveSourceRefLabel } from "../prefill/deriveSourceRefLabel"
import { usePrefill } from "../prefill/usePrefill"
import DataElementModal from "./DataElementModal"
import FieldRow from "./FieldRow"
import type { PrefillDataSource, SourceRef } from "../prefill/types"
import type { BlueprintGraph } from "../types/graph"

interface PrefillPanelProps {
  graph: BlueprintGraph
  nodeId: string
  sources: PrefillDataSource[]
}

interface SelectedMappingParams {
  fieldKey: string
  sourceRef: SourceRef
}

export default function PrefillPanel({
  graph,
  nodeId,
  sources,
}: PrefillPanelProps) {
  const { dispatch, prefillMappings } = usePrefill()
  const [fieldKeyBeingMapped, setFieldKeyBeingMapped] = useState<string | null>(
    null,
  )
  const node = getNodeById({ graph, nodeId })
  const form = getFormForNode({ graph, node })
  const fieldKeys = Object.keys(form.field_schema.properties)
  const nodeMappings = prefillMappings[nodeId] ?? {}

  function handleSelect({ fieldKey, sourceRef }: SelectedMappingParams) {
    dispatch({ fieldKey, nodeId, sourceRef, type: "SET_MAPPING" })
    setFieldKeyBeingMapped(null)
  }

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
                onOpen={() => setFieldKeyBeingMapped(fieldKey)}
              />
            </li>
          )
        })}
      </ul>

      {fieldKeyBeingMapped !== null && (
        <DataElementModal
          graph={graph}
          nodeId={nodeId}
          onClose={() => setFieldKeyBeingMapped(null)}
          onSelect={(sourceRef) =>
            handleSelect({ fieldKey: fieldKeyBeingMapped, sourceRef })
          }
          sources={sources}
        />
      )}
    </section>
  )
}
