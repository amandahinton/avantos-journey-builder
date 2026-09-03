import { describe, expect, it } from "vitest"
import graph from "../../fixtures/graph.json"
import { findNodeByName } from "../../graph/testHelpers"
import { actionPropertiesSource } from "./actionPropertiesSource"

describe("actionPropertiesSource", () => {
  it("returns one dataGroup of blueprint properties, keyed and labeled by the graph itself, for the given node", () => {
    const dataGroups = actionPropertiesSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form A").id,
    })

    expect(dataGroups).toHaveLength(1)

    const [actionGroup] = dataGroups
    const dataElementIds = actionGroup.dataElements.map(
      (dataElement) => dataElement.id,
    )

    expect(actionGroup.id).toBe("bp_01jk766tckfwx84xjcxazggzyc")
    expect(actionGroup.label).toBe("Onboard Customer 0")
    expect(dataElementIds).toEqual(["blueprint_id", "blueprint_name"])
  })

  it("returns same dataGroups for every node, because action properties are independent of the node", () => {
    const formAGroups = actionPropertiesSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form A").id,
    })
    const formFGroups = actionPropertiesSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form F").id,
    })

    expect(formAGroups).toEqual(formFGroups)
  })
})
