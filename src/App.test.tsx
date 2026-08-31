import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import App from "./App"
import { getBlueprintGraph } from "./api/blueprints"
import graph from "./fixtures/graph.json"

vi.mock("./api/blueprints")

beforeEach(() => {
  vi.mocked(getBlueprintGraph).mockReset().mockResolvedValue(graph)
})

describe("App", () => {
  it("renders app heading", () => {
    render(<App />)

    expect(
      screen.getByRole("heading", { name: /journey builder/i }),
    ).toBeInTheDocument()
  })

  it("shows loading message, then fetched graph", async () => {
    render(<App />)

    expect(screen.getByText("Loading…")).toBeInTheDocument()
    expect(await screen.findByText(/"name": "Form D"/)).toBeInTheDocument()
    expect(screen.queryByText("Loading…")).not.toBeInTheDocument()
  })

  it("shows error message when fetch fails", async () => {
    vi.mocked(getBlueprintGraph).mockRejectedValue(
      new Error("server unreachable"),
    )

    render(<App />)

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "server unreachable",
    )
  })
})
