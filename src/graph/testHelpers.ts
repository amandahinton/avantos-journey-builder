import graph from "../fixtures/graph.json"
import type { BlueprintGraph, GraphNode } from "../types/graph"

interface MakeTestNodeParams {
  id: string
  prerequisites: string[]
  componentId?: string
}

export function findNodeByName(name: string): GraphNode {
  const node = graph.nodes.find(
    (candidateNode) => candidateNode.data.name === name,
  )
  if (!node) {
    throw new Error(`No node named "${name}"`)
  }
  return node
}

export function listNodeNames(nodes: GraphNode[]): string[] {
  return nodes.map((node) => node.data.name)
}

export function makeTestNode({
  id,
  prerequisites,
  componentId = "form-template",
}: MakeTestNodeParams): GraphNode {
  return {
    data: {
      component_id: componentId,
      id: `component-${id}`,
      input_mapping: {},
      name: `Form ${id}`,
      prerequisites,
    },
    id,
    type: "form",
  }
}

export function makeTestGraph(nodes: GraphNode[]): BlueprintGraph {
  return {
    forms: [],
    id: "test-graph",
    name: "Test graph",
    nodes,
  }
}
