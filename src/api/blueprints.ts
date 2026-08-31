import type { BlueprintGraph } from "../types/graph"

const BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"

export interface BlueprintGraphParams {
  tenantId: string
  blueprintId: string
}

export async function getBlueprintGraph({
  tenantId,
  blueprintId,
}: BlueprintGraphParams): Promise<BlueprintGraph> {
  const url = `${BASE_URL}/api/v1/${tenantId}/actions/blueprints/${blueprintId}/graph`

  let response: Response

  try {
    response = await fetch(url)
  } catch {
    throw new Error("Failed to fetch blueprint graph: server unreachable")
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch blueprint graph with ${response.status}: ${response.statusText}`,
    )
  }

  return (await response.json()) as BlueprintGraph
}
