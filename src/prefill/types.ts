import type { BlueprintGraph } from "../types/graph"

export interface DataElement {
  id: string
  label: string
}

export interface DataGroup {
  dataElements: DataElement[]
  id: string
  label: string
}

export interface DataSourceParams {
  graph: BlueprintGraph
  nodeId: string
}

export interface PrefillDataSource {
  getDataGroups(params: DataSourceParams): DataGroup[]
  id: string
  label: string
}

export interface SourceRef {
  elementId: string
  groupId: string
  sourceId: string
}
