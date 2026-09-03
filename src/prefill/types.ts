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

// object keyed by node id (not form id), whose values are objects keyed by field key
export type PrefillMappings = Record<string, Record<string, SourceRef>>

export interface SourceRef {
  elementId: string
  groupId: string
  sourceId: string
}
