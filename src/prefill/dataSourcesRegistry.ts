import { actionPropertiesSource } from "./sources/actionPropertiesSource"
import { directDependenciesSource } from "./sources/directDependenciesSource"
import { globalDataSource } from "./sources/globalDataSource"
import { transitiveDependenciesSource } from "./sources/transitiveDependenciesSource"
import type { PrefillDataSource } from "./types"

export const dataSourcesRegistry: PrefillDataSource[] = [
  actionPropertiesSource,
  directDependenciesSource,
  transitiveDependenciesSource,
  globalDataSource,
]
