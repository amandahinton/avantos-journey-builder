import { getFormForNode, getNodeById } from "../graph/lookup"
import {
  getDirectDependencies,
  getTransitiveDependencies,
} from "../graph/traversal"
import type { BlueprintGraph } from "../types/graph"

interface PrefillPanelProps {
  graph: BlueprintGraph
  nodeId: string
}

export default function PrefillPanel({ graph, nodeId }: PrefillPanelProps) {
  const node = getNodeById({ graph, nodeId })
  const form = getFormForNode({ graph, node })
  const fieldKeys = Object.keys(form.field_schema.properties)

  const directDependencyText = getDirectDependencies({ graph, nodeId })
    .map((dependencyNode) => dependencyNode.data.name)
    .join(", ")

  const transitiveDependencyText = getTransitiveDependencies({ graph, nodeId })
    .map((dependencyNode) => dependencyNode.data.name)
    .join(", ")

  return (
    <section>
      <h2>{node.data.name}</h2>

      <h3>Fields</h3>
      <ul>
        {fieldKeys.map((fieldKey) => (
          <li key={fieldKey}>{fieldKey}</li>
        ))}
      </ul>

      <h3>Dependencies</h3>
      <p>Direct dependencies: {directDependencyText}</p>
      <p>Transitive dependencies: {transitiveDependencyText}</p>
    </section>
  )
}
