import { describe, expect, it } from "vitest"
import graph from "../../fixtures/graph.json"
import { findNodeByName } from "../../graph/testHelpers"
import { globalDataSource } from "./globalDataSource"

describe("globalDataSource", () => {
  it("returns one dataGroup of invented global properties for the given node", () => {
    const dataGroups = globalDataSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form A").id,
    })

    expect(dataGroups).toHaveLength(1)

    const [globalGroup] = dataGroups
    const dataElementIds = globalGroup.dataElements.map(
      (dataElement) => dataElement.id,
    )

    expect(globalGroup.label).toBe("Global")
    expect(dataElementIds).toEqual([
      "current_user_email",
      "current_user_name",
      "organization_name",
    ])
  })

  it("returns same dataGroups for every node, because global data is independent of the graph", () => {
    const formAGroups = globalDataSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form A").id,
    })
    const formFGroups = globalDataSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form F").id,
    })

    expect(formAGroups).toEqual(formFGroups)
  })
})
