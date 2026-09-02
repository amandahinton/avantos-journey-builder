import { describe, expect, it } from "vitest"
import graph from "../fixtures/graph.json"
import { findNodeByName } from "../graph/testHelpers"
import { dataSourcesRegistry } from "./dataSourcesRegistry"

describe("dataSourcesRegistry", () => {
  it("lists direct, transitive, then global sources in display order", () => {
    const dataSourceIds = dataSourcesRegistry.map((dataSource) => dataSource.id)

    expect(dataSourceIds).toEqual([
      "direct-dependencies",
      "transitive-dependencies",
      "global-data",
    ])
  })

  it("returns dataGroups from every source in registry order for Form D, which has both direct and transitive dependencies", () => {
    const dataGroupLabels = dataSourcesRegistry.flatMap((dataSource) =>
      dataSource
        .getDataGroups({ graph, nodeId: findNodeByName("Form D").id })
        .map((dataGroup) => dataGroup.label),
    )

    expect(dataGroupLabels).toEqual(["Form B", "Form A", "Global"])
  })
})
