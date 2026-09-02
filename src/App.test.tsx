import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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

  it("shows loading message, then form list sorted by name", async () => {
    render(<App />)

    expect(screen.getByText("Loading…")).toBeInTheDocument()

    const buttonNames = (await screen.findAllByRole("button")).map(
      (button) => button.textContent,
    )

    expect(buttonNames).toEqual([
      "Form A",
      "Form B",
      "Form C",
      "Form D",
      "Form E",
      "Form F",
    ])
    expect(screen.queryByText("Loading…")).not.toBeInTheDocument()
  })

  it("marks clicked form as current", async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByRole("button", { name: "Form D" }))

    const currentButtonNames = screen
      .queryAllByRole("button", { current: true })
      .map((button) => button.textContent)

    expect(currentButtonNames).toEqual(["Form D"])
  })

  it("shows select prompt, then removes it when a form is clicked", async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(await screen.findByText("Select a form")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Form D" }))

    expect(screen.queryByText("Select a form")).not.toBeInTheDocument()
  })

  it("shows available data for clicked form", async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByRole("button", { name: "Form D" }))

    expect(screen.getByRole("list", { name: "Form B" })).toBeInTheDocument()
    expect(screen.getByRole("list", { name: "Global" })).toBeInTheDocument()
  })

  it("shows loading message, then error message when fetch fails", async () => {
    vi.mocked(getBlueprintGraph).mockRejectedValue(
      new Error("server unreachable"),
    )

    render(<App />)

    expect(screen.getByText("Loading…")).toBeInTheDocument()
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "server unreachable",
    )
    expect(screen.queryByText("Loading…")).not.toBeInTheDocument()
  })
})
