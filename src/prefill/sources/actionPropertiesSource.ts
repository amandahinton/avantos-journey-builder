import type {
  DataElement,
  DataGroup,
  DataSourceParams,
  PrefillDataSource,
} from "../types"

const actionDataElements: DataElement[] = [
  { id: "blueprint_id", label: "blueprint_id" },
  { id: "blueprint_name", label: "blueprint_name" },
]

export const actionPropertiesSource: PrefillDataSource = {
  getDataGroups({ graph }: DataSourceParams): DataGroup[] {
    return [
      {
        dataElements: actionDataElements,
        id: graph.id,
        label: graph.name,
      },
    ]
  },
  id: "action-properties",
}
