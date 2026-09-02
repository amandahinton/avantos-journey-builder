import { describe, expect, it } from "vitest"
import graph from "../../fixtures/graph.json"
import { findNodeByName } from "../../graph/testHelpers"
import { directDependenciesSource } from "./directDependenciesSource"

describe("directDependenciesSource", () => {
  it("returns dataGroup with node id and node name for Form D, which has one direct dependency", () => {
    const dataGroups = directDependenciesSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form D").id,
    })

    expect(dataGroups).toHaveLength(1)

    const [formBGroup] = dataGroups
    const formBNode = findNodeByName("Form B")

    expect(formBGroup.id).toBe(formBNode.id)
    expect(formBGroup.id).not.toBe(formBNode.data.component_id)
    expect(formBGroup.label).toBe("Form B")
  })

  it("returns dataElement per field key of Form B for Form D, which has one direct dependency", () => {
    const dataGroups = directDependenciesSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form D").id,
    })

    const [formBGroup] = dataGroups
    const dataElementIds = formBGroup.dataElements.map(
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

  it("returns dataGroups in prerequisite order for Form F, which has multiple direct dependencies", () => {
    const dataGroups = directDependenciesSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form F").id,
    })

    const dataGroupLabels = dataGroups.map((dataGroup) => dataGroup.label)

    expect(dataGroupLabels).toEqual(["Form D", "Form E"])
  })

  it("returns empty array for Form A, the start of the journey", () => {
    const dataGroups = directDependenciesSource.getDataGroups({
      graph,
      nodeId: findNodeByName("Form A").id,
    })

    expect(dataGroups).toEqual([])
  })
})
