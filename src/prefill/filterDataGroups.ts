import type { DataGroup } from "./types"

interface FilterDataGroupsParams {
  dataGroups: DataGroup[]
  query: string
}

export function isActiveQuery(query: string): boolean {
  return query.trim() !== ""
}

export function filterDataGroups({
  dataGroups,
  query,
}: FilterDataGroupsParams): DataGroup[] {
  if (!isActiveQuery(query)) {
    return dataGroups
  }

  const normalizedQuery = query.trim().toLowerCase()

  return dataGroups
    .map((dataGroup) => {
      if (dataGroup.label.toLowerCase().includes(normalizedQuery)) {
        return dataGroup
      }

      return {
        ...dataGroup,
        dataElements: dataGroup.dataElements.filter((dataElement) =>
          dataElement.label.toLowerCase().includes(normalizedQuery),
        ),
      }
    })
    .filter((dataGroup) => dataGroup.dataElements.length > 0)
}
