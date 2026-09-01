import type { BlueprintGraph, FormDefinition, GraphNode } from "../types/graph"

export interface NodeParams {
  graph: BlueprintGraph
  nodeId: string
}

export function getNodeById({ graph, nodeId }: NodeParams): GraphNode {
  const node = graph.nodes.find((candidateNode) => candidateNode.id === nodeId)
  if (!node) {
    throw new Error(
      `getNodeById: Node "${nodeId}" not found in graph "${graph.id}" (${graph.name})`,
    )
  }
  return node
}

export interface NodeFormParams {
  graph: BlueprintGraph
  node: GraphNode
}

export function getFormForNode({
  graph,
  node,
}: NodeFormParams): FormDefinition {
  const form = graph.forms.find(
    (candidateForm) => candidateForm.id === node.data.component_id,
  )
  if (!form) {
    throw new Error(
      `getFormForNode: Node "${node.id}" (${node.data.name}) references form "${node.data.component_id}" which is not in graph "${graph.id}" (${graph.name})`,
    )
  }
  return form
}
