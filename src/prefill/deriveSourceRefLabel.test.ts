import { describe, expect, it } from "vitest"
import graph from "../fixtures/graph.json"
import { findNodeByName } from "../graph/testHelpers"
import { dataSourcesRegistry } from "./dataSourcesRegistry"
import { deriveSourceRefLabel } from "./deriveSourceRefLabel"

describe("deriveSourceRefLabel", () => {
  it("returns dataGroup.dataElement label for direct dependency mapping of Form D, whose direct dependency is Form B", () => {
    const label = deriveSourceRefLabel({
      graph,
      nodeId: findNodeByName("Form D").id,
      sourceRef: {
        elementId: "email",
        groupId: findNodeByName("Form B").id,
        sourceId: "direct-dependencies",
      },
      sources: dataSourcesRegistry,
    })

    expect(label).toBe("Form B.email")
  })

  it("returns dataGroup.dataElement label for transitive dependency mapping of Form D, whose transitive dependency is Form A", () => {
    const label = deriveSourceRefLabel({
      graph,
      nodeId: findNodeByName("Form D").id,
      sourceRef: {
        elementId: "email",
        groupId: findNodeByName("Form A").id,
        sourceId: "transitive-dependencies",
      },
      sources: dataSourcesRegistry,
    })

    expect(label).toBe("Form A.email")
  })

  it("returns dataGroup.dataElement label for global data mapping of given node", () => {
    const label = deriveSourceRefLabel({
      graph,
      nodeId: findNodeByName("Form A").id,
      sourceRef: {
        elementId: "organization_name",
        groupId: "global",
        sourceId: "global-data",
      },
      sources: dataSourcesRegistry,
    })

    expect(label).toBe("Global.organization_name")
  })

  it("throws with source id when no given source matches sourceRef source id", () => {
    expect(() =>
      deriveSourceRefLabel({
        graph,
        nodeId: findNodeByName("Form D").id,
        sourceRef: {
          elementId: "email",
          groupId: findNodeByName("Form B").id,
          sourceId: "missing-source",
        },
        sources: dataSourcesRegistry,
      }),
    ).toThrow(
      'deriveSourceRefLabel: SourceRef names source "missing-source" which is not in given sources',
    )
  })

  it("throws with group, source, and node ids when no dataGroup from the source matches sourceRef group id", () => {
    const formDNodeId = findNodeByName("Form D").id

    expect(() =>
      deriveSourceRefLabel({
        graph,
        nodeId: formDNodeId,
        sourceRef: {
          elementId: "email",
          groupId: "missing-group",
          sourceId: "direct-dependencies",
        },
        sources: dataSourcesRegistry,
      }),
    ).toThrow(
      `deriveSourceRefLabel: SourceRef names group "missing-group" which is not returned by source "direct-dependencies" for node "${formDNodeId}"`,
    )
  })

  it("throws with element, group, and source ids when no dataElement in the group matches sourceRef element id", () => {
    const formBNodeId = findNodeByName("Form B").id

    expect(() =>
      deriveSourceRefLabel({
        graph,
        nodeId: findNodeByName("Form D").id,
        sourceRef: {
          elementId: "missing-element",
          groupId: formBNodeId,
          sourceId: "direct-dependencies",
        },
        sources: dataSourcesRegistry,
      }),
    ).toThrow(
      `deriveSourceRefLabel: SourceRef names element "missing-element" which is not in group "${formBNodeId}" (Form B) returned by source "direct-dependencies"`,
    )
  })
})
