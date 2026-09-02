import { getTransitiveDependencies } from "../../graph/traversal"
import { buildDependencyGroup } from "./buildDependencyGroup"
import type { DataGroup, DataSourceParams, PrefillDataSource } from "../types"

export const transitiveDependenciesSource: PrefillDataSource = {
  getDataGroups({ graph, nodeId }: DataSourceParams): DataGroup[] {
    const transitiveDependencyNodes = getTransitiveDependencies({
      graph,
      nodeId,
    })

    return transitiveDependencyNodes.map((dependencyNode) =>
      buildDependencyGroup({ dependencyNode, graph }),
    )
  },
  id: "transitive-dependencies",
  label: "Transitive dependencies",
}
