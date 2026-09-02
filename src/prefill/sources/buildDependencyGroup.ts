import { getFormForNode } from "../../graph/lookup"
import type { BlueprintGraph, GraphNode } from "../../types/graph"
import type { DataGroup } from "../types"

interface DependencyGroupParams {
  dependencyNode: GraphNode
  graph: BlueprintGraph
}

export function buildDependencyGroup({
  dependencyNode,
  graph,
}: DependencyGroupParams): DataGroup {
  const dependencyForm = getFormForNode({ graph, node: dependencyNode })
  const fieldKeys = Object.keys(dependencyForm.field_schema.properties)

  const dataElements = fieldKeys.map((fieldKey) => ({
    id: fieldKey,
    label: fieldKey,
  }))

  return {
    dataElements,
    id: dependencyNode.id,
    label: dependencyNode.data.name,
  }
}
