import { getDirectDependencies } from "../../graph/traversal"
import { buildDependencyGroup } from "./buildDependencyGroup"
import type { DataGroup, DataSourceParams, PrefillDataSource } from "../types"

export const directDependenciesSource: PrefillDataSource = {
  getDataGroups({ graph, nodeId }: DataSourceParams): DataGroup[] {
    const directDependencyNodes = getDirectDependencies({ graph, nodeId })

    return directDependencyNodes.map((dependencyNode) =>
      buildDependencyGroup({ dependencyNode, graph }),
    )
  },
  id: "direct-dependencies",
}
