import { describe, expect, it } from "vitest"
import graph from "../fixtures/graph.json"
import { getFormForNode, getNodeById } from "./lookup"
import { findNodeByName, makeTestGraph, makeTestNode } from "./testHelpers"

describe("getNodeById", () => {
  it("returns node matching given id", () => {
    const formDNode = findNodeByName("Form D")

    expect(getNodeById({ graph, nodeId: formDNode.id })).toBe(formDNode)
  })

  it("throws with given id when no node matches it", () => {
    expect(() => getNodeById({ graph, nodeId: "form-missing" })).toThrow(
      'getNodeById: Node "form-missing" not found in graph "bp_01jk766tckfwx84xjcxazggzyc" (Onboard Customer 0)',
    )
  })
})

describe("getFormForNode", () => {
  it("returns form matching node's component_id", () => {
    const formBNode = findNodeByName("Form B")

    const form = getFormForNode({ graph, node: formBNode })

    expect(form.id).toBe(formBNode.data.component_id)
    expect(Object.keys(form.field_schema.properties)).toContain("email")
  })

  it("throws with node and form id when no form matches node's component_id", () => {
    const nodeWithMissingForm = makeTestNode({
      id: "a",
      prerequisites: [],
      componentId: "form-missing",
    })
    const testGraph = makeTestGraph([nodeWithMissingForm])

    expect(() =>
      getFormForNode({ graph: testGraph, node: nodeWithMissingForm }),
    ).toThrow(
      'getFormForNode: Node "a" (Form a) references form "form-missing" which is not in graph "test-graph" (Test graph)',
    )
  })
})
