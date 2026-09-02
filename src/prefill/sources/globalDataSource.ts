import type { DataElement, DataGroup, PrefillDataSource } from "../types"

const globalDataElements: DataElement[] = [
  { id: "current_user_email", label: "current_user_email" },
  { id: "current_user_name", label: "current_user_name" },
  { id: "organization_name", label: "organization_name" },
]

export const globalDataSource: PrefillDataSource = {
  getDataGroups(): DataGroup[] {
    return [
      {
        dataElements: globalDataElements,
        id: "global",
        label: "Global",
      },
    ]
  },
  id: "global-data",
  label: "Global data",
}
