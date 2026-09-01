import { getNodeById } from "./lookup"
import type { GraphNode } from "../types/graph"
import type { NodeParams } from "./lookup"

// ancestors is union of direct dep and transitive dep

export function getDirectDependencies({
  graph,
  nodeId,
}: NodeParams): GraphNode[] {
  const node = getNodeById({ graph, nodeId })

  const directDependencyNodes = node.data.prerequisites.map(
    (prerequisiteId) => {
      const dependencyNode = graph.nodes.find(
        (candidateNode) => candidateNode.id === prerequisiteId,
      )

      if (!dependencyNode) {
        throw new Error(
          `getDirectDependencies: Node "${node.id}" (${node.data.name}) lists prerequisite "${prerequisiteId}" which is not in graph "${graph.id}" (${graph.name})`,
        )
      }

      return dependencyNode
    },
  )

  return directDependencyNodes
}

function getAncestors({ graph, nodeId }: NodeParams): GraphNode[] {
  const startNode = getNodeById({ graph, nodeId })
  const visitedIds = new Set([startNode.id])
  const nodesToVisit = [startNode]
  const ancestorNodes: GraphNode[] = []

  for (let visitIndex = 0; visitIndex < nodesToVisit.length; visitIndex++) {
    const currentNode = nodesToVisit[visitIndex]

    const directDependencyNodes = getDirectDependencies({
      graph,
      nodeId: currentNode.id,
    })

    for (const dependencyNode of directDependencyNodes) {
      if (visitedIds.has(dependencyNode.id)) {
        continue
      }
      visitedIds.add(dependencyNode.id)
      nodesToVisit.push(dependencyNode)
      ancestorNodes.push(dependencyNode)
    }
  }

  return ancestorNodes
}

export function getTransitiveDependencies({
  graph,
  nodeId,
}: NodeParams): GraphNode[] {
  const directDependencyIds = new Set(
    getDirectDependencies({ graph, nodeId }).map(
      (dependencyNode) => dependencyNode.id,
    ),
  )

  const transitiveDependencyNodes = getAncestors({ graph, nodeId }).filter(
    (ancestorNode) => !directDependencyIds.has(ancestorNode.id),
  )

  return transitiveDependencyNodes
}
