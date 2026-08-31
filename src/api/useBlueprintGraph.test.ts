import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import graph from "../fixtures/graph.json"
import { getBlueprintGraph } from "./blueprints"
import { useBlueprintGraph } from "./useBlueprintGraph"

vi.mock("./blueprints")

const params = { tenantId: "tenant-1", blueprintId: "bp-1" }

beforeEach(() => {
  vi.mocked(getBlueprintGraph).mockReset()
})

describe("useBlueprintGraph", () => {
  it("has no graph and no error while the request is pending", () => {
    vi.mocked(getBlueprintGraph).mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useBlueprintGraph(params))

    expect(result.current).toEqual({ graph: null, error: null })
  })

  it("returns graph when request resolves", async () => {
    vi.mocked(getBlueprintGraph).mockResolvedValue(graph)

    const { result } = renderHook(() => useBlueprintGraph(params))

    await waitFor(() => expect(result.current.graph).toEqual(graph))
    expect(result.current.error).toBeNull()
    expect(getBlueprintGraph).toHaveBeenCalledWith(params)
  })

  it("returns error message when request rejects", async () => {
    vi.mocked(getBlueprintGraph).mockRejectedValue(
      new Error("server unreachable"),
    )

    const { result } = renderHook(() => useBlueprintGraph(params))

    await waitFor(() => expect(result.current.error).toBe("server unreachable"))
    expect(result.current.graph).toBeNull()
  })
})
