import type { BlueprintGraph } from "../types/graph"
import type { PrefillDataSource, SourceRef } from "./types"

interface SourceRefLabelParams {
  graph: BlueprintGraph
  nodeId: string
  sourceRef: SourceRef
  sources: PrefillDataSource[]
}

export function deriveSourceRefLabel({
  graph,
  nodeId,
  sourceRef,
  sources,
}: SourceRefLabelParams): string {
  const { elementId, groupId, sourceId } = sourceRef

  const dataSource = sources.find((candidate) => candidate.id === sourceId)
  if (!dataSource) {
    throw new Error(
      `deriveSourceRefLabel: SourceRef names source "${sourceId}" which is not in given sources`,
    )
  }

  const dataGroups = dataSource.getDataGroups({ graph, nodeId })
  const dataGroup = dataGroups.find((candidate) => candidate.id === groupId)
  if (!dataGroup) {
    throw new Error(
      `deriveSourceRefLabel: SourceRef names group "${groupId}" which is not returned by source "${sourceId}" for node "${nodeId}"`,
    )
  }

  const dataElement = dataGroup.dataElements.find(
    (candidate) => candidate.id === elementId,
  )
  if (!dataElement) {
    throw new Error(
      `deriveSourceRefLabel: SourceRef names element "${elementId}" which is not in group "${groupId}" (${dataGroup.label}) returned by source "${sourceId}"`,
    )
  }

  return `${dataGroup.label}.${dataElement.label}`
}
