import { useEffect, useState } from "react"
import { getBlueprintGraph } from "./blueprints"
import type { BlueprintGraphParams } from "./blueprints"
import type { BlueprintGraph } from "../types/graph"

export function useBlueprintGraph(params: BlueprintGraphParams) {
  const [graph, setGraph] = useState<BlueprintGraph | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { tenantId, blueprintId } = params

  useEffect(() => {
    let ignore = false

    getBlueprintGraph({ tenantId, blueprintId })
      .then((result) => {
        if (!ignore) {
          setGraph(result)
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : String(err))
        }
      })

    return () => {
      ignore = true
    }
  }, [tenantId, blueprintId])

  return { graph, error }
}
