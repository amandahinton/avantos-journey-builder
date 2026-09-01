import { describe, expect, it } from "vitest"
import graph from "../fixtures/graph.json"
import {
  findNodeByName,
  listNodeNames,
  makeTestGraph,
  makeTestNode,
} from "./testHelpers"
import { getDirectDependencies, getTransitiveDependencies } from "./traversal"

describe("getDirectDependencies", () => {
  it("returns direct dependency of Form D", () => {
    const directDependencyNodes = getDirectDependencies({
      graph,
      nodeId: findNodeByName("Form D").id,
    })

    expect(listNodeNames(directDependencyNodes)).toEqual(["Form B"])
  })

  it("returns direct dependencies of Form F in prerequisite order", () => {
    const directDependencyNodes = getDirectDependencies({
      graph,
      nodeId: findNodeByName("Form F").id,
    })

    expect(listNodeNames(directDependencyNodes)).toEqual(["Form D", "Form E"])
  })

  it("returns empty array for Form A, the start of the journey", () => {
    const directDependencyNodes = getDirectDependencies({
      graph,
      nodeId: findNodeByName("Form A").id,
    })

    expect(directDependencyNodes).toEqual([])
  })

  it("throws with node and prerequisite id when no node matches prerequisite id", () => {
    const testGraph = makeTestGraph([
      makeTestNode({ id: "b", prerequisites: ["missing"] }),
    ])

    expect(() =>
      getDirectDependencies({ graph: testGraph, nodeId: "b" }),
    ).toThrow(
      'getDirectDependencies: Node "b" (Form b) lists prerequisite "missing" which is not in graph "test-graph" (Test graph)',
    )
  })
})

describe("getTransitiveDependencies", () => {
  it("returns ancestors of Form D except its direct dependency", () => {
    const transitiveDependencyNodes = getTransitiveDependencies({
      graph,
      nodeId: findNodeByName("Form D").id,
    })

    const transitiveDependencyNames = listNodeNames(transitiveDependencyNodes)

    expect(transitiveDependencyNames).toEqual(["Form A"])
    expect(transitiveDependencyNames).not.toContain("Form B")
  })

  it("returns ancestors of Form F except its direct dependencies", () => {
    const transitiveDependencyNodes = getTransitiveDependencies({
      graph,
      nodeId: findNodeByName("Form F").id,
    })

    const transitiveDependencyNames = listNodeNames(transitiveDependencyNodes)

    expect(transitiveDependencyNames.toSorted()).toEqual([
      "Form A",
      "Form B",
      "Form C",
    ])
    expect(transitiveDependencyNames).not.toContain("Form D")
    expect(transitiveDependencyNames).not.toContain("Form E")
  })

  it("returns empty array for Form A, the start of the journey", () => {
    const transitiveDependencyNodes = getTransitiveDependencies({
      graph,
      nodeId: findNodeByName("Form A").id,
    })

    expect(transitiveDependencyNodes).toEqual([])
  })

  it("returns Form A once for Form F, though Form A is reached by two paths", () => {
    const transitiveDependencyNodes = getTransitiveDependencies({
      graph,
      nodeId: findNodeByName("Form F").id,
    })

    const formACount = listNodeNames(transitiveDependencyNodes).filter(
      (name) => name === "Form A",
    ).length

    expect(formACount).toBe(1)
  })

  it("returns empty array when every ancestor is also a direct dependency", () => {
    const testGraph = makeTestGraph([
      makeTestNode({ id: "a", prerequisites: [] }),
      makeTestNode({ id: "b", prerequisites: ["a"] }),
      makeTestNode({ id: "c", prerequisites: ["b", "a"] }),
    ])

    const transitiveDependencyNodes = getTransitiveDependencies({
      graph: testGraph,
      nodeId: "c",
    })

    expect(transitiveDependencyNodes).toEqual([])
  })

  it("returns empty array when graph has a cycle back to given node", () => {
    const testGraph = makeTestGraph([
      makeTestNode({ id: "a", prerequisites: ["b"] }),
      makeTestNode({ id: "b", prerequisites: ["a"] }),
    ])

    const transitiveDependencyNodes = getTransitiveDependencies({
      graph: testGraph,
      nodeId: "a",
    })

    expect(transitiveDependencyNodes).toEqual([])
  })
})
