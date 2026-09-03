import type { DataGroup, PrefillDataSource } from "./types"

interface MakeTestSourceParams {
  dataGroups?: DataGroup[]
  id?: string
  label?: string
}

export function makeTestSource({
  dataGroups = [
    {
      dataElements: [{ id: "test_element", label: "test_element" }],
      id: "test-group",
      label: "Test group",
    },
  ],
  id = "test-source",
  label = "Test source",
}: MakeTestSourceParams = {}): PrefillDataSource {
  return {
    getDataGroups() {
      return dataGroups
    },
    id,
    label,
  }
}
