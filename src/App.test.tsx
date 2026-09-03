import { render, screen, within } from "@testing-library/react"
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

  it("shows available data in the modal for clicked field", async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByRole("button", { name: "Form D" }))
    await user.click(screen.getByRole("button", { name: "Map email" }))

    const dialog = screen.getByRole("dialog")

    expect(
      within(dialog).getByRole("list", { name: "Form B" }),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByRole("list", { name: "Global" }),
    ).toBeInTheDocument()
  })

  it("maps field from modal selection and clears it, completing the prefill flow", async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByRole("button", { name: "Form D" }))
    await user.click(screen.getByRole("button", { name: "Map email" }))

    const dialog = screen.getByRole("dialog")
    await user.click(within(dialog).getByText("Form A"))

    const formAGroupList = within(dialog).getByRole("list", { name: "Form A" })
    await user.click(
      within(formAGroupList).getByRole("button", { name: "email" }),
    )
    await user.click(within(dialog).getByRole("button", { name: "Select" }))

    const fieldsList = screen.getByRole("list", { name: "Fields" })

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(
      within(fieldsList).getByText("email: Form A.email"),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole("button", { name: "Clear mapping for email" }),
    )

    expect(
      within(fieldsList).queryByText("email: Form A.email"),
    ).not.toBeInTheDocument()
    expect(
      within(fieldsList).getByRole("button", { name: "Map email" }),
    ).toBeInTheDocument()
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
