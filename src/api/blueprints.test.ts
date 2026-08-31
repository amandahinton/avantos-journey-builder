import { afterEach, describe, expect, it, vi } from "vitest"
import graph from "../fixtures/graph.json"
import { getBlueprintGraph } from "./blueprints"

const params = { tenantId: "tenant-1", blueprintId: "bp-1" }

function stubFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("getBlueprintGraph", () => {
  it("requests graph endpoint for given tenant and blueprint", async () => {
    const fetchMock = stubFetch(new Response(JSON.stringify(graph)))

    await getBlueprintGraph(params)

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/api/v1/tenant-1/actions/blueprints/bp-1/graph",
    )
  })

  it("returns parsed graph", async () => {
    stubFetch(new Response(JSON.stringify(graph)))

    const result = await getBlueprintGraph(params)

    expect(result).toEqual(graph)
  })

  it("throws for non-OK response", async () => {
    stubFetch(new Response(null, { status: 404, statusText: "Not Found" }))

    await expect(getBlueprintGraph(params)).rejects.toThrow("404")
  })

  it("throws when server is unreachable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    )

    await expect(getBlueprintGraph(params)).rejects.toThrow(
      "server unreachable",
    )
  })
})
