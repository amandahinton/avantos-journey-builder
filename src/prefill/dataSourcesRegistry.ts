import { directDependenciesSource } from "./sources/directDependenciesSource"
import { globalDataSource } from "./sources/globalDataSource"
import { transitiveDependenciesSource } from "./sources/transitiveDependenciesSource"
import type { PrefillDataSource } from "./types"

export const dataSourcesRegistry: PrefillDataSource[] = [
  directDependenciesSource,
  transitiveDependenciesSource,
  globalDataSource,
]
