import { describe, expect, it } from "vitest"
import graph from "../../fixtures/graph.json"
import { findNodeByName } from "../../graph/testHelpers"
import { transitiveDependenciesSource } from "./transitiveDependenciesSource"

describe("transitiveDependenciesSource", () => {
  it("returns dataGroup with node id and node name for Form D, which has one transitive dependency", () => {
    const dataGroups = transitiveDependenciesSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form D").id,
    })

    expect(dataGroups).toHaveLength(1)

    const [formAGroup] = dataGroups
    const formANode = findNodeByName("Form A")

    expect(formAGroup.id).toBe(formANode.id)
    expect(formAGroup.id).not.toBe(formANode.data.component_id)
    expect(formAGroup.label).toBe("Form A")
  })

  it("returns dataElement per field key of Form A for Form D, which has one transitive dependency", () => {
    const dataGroups = transitiveDependenciesSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form D").id,
    })

    const [formAGroup] = dataGroups
    const dataElementIds = formAGroup.dataElements.map(
      (dataElement) => dataElement.id,
    )

    expect(dataElementIds.toSorted()).toEqual([
      "button",
      "dynamic_checkbox_group",
      "dynamic_object",
      "email",
      "id",
      "multi_select",
      "name",
      "notes",
    ])
  })

  it("returns dataGroup per transitive dependency once for Form F, where two paths reconverge", () => {
    const dataGroups = transitiveDependenciesSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form F").id,
    })

    const dataGroupLabels = dataGroups.map((dataGroup) => dataGroup.label)

    expect(dataGroupLabels.toSorted()).toEqual(["Form A", "Form B", "Form C"])
  })

  it("returns empty array for Form A, the start of the journey", () => {
    const dataGroups = transitiveDependenciesSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form A").id,
    })

    expect(dataGroups).toEqual([])
  })
})
