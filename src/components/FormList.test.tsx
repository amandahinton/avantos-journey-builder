import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import graph from "../fixtures/graph.json"
import { findNodeByName } from "../graph/testHelpers"
import FormList from "./FormList"

describe("FormList", () => {
  it("renders one button per node, sorted by name", () => {
    render(
      <FormList
        nodes={graph.nodes}
        onSelect={() => {}}
        selectedNodeId={null}
      />,
    )

    const buttonNames = screen
      .getAllByRole("button")
      .map((button) => button.textContent)

    expect(buttonNames).toEqual([
      "Form A",
      "Form B",
      "Form C",
      "Form D",
      "Form E",
      "Form F",
    ])
  })

  it("calls onSelect with node id when form is clicked", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <FormList
        nodes={graph.nodes}
        onSelect={onSelect}
        selectedNodeId={null}
      />,
    )

    await user.click(screen.getByRole("button", { name: "Form D" }))

    expect(onSelect).toHaveBeenCalledWith(findNodeByName("Form D").id)
  })

  it("marks only selected form as current", () => {
    render(
      <FormList
        nodes={graph.nodes}
        onSelect={() => {}}
        selectedNodeId={findNodeByName("Form D").id}
      />,
    )

    const currentButtonNames = screen
      .queryAllByRole("button", { current: true })
      .map((button) => button.textContent)

    expect(currentButtonNames).toEqual(["Form D"])
  })

  it("marks nothing current when selectedNodeId matches no node", () => {
    render(
      <FormList
        nodes={graph.nodes}
        onSelect={() => {}}
        selectedNodeId="form-missing"
      />,
    )

    expect(screen.queryAllByRole("button", { current: true })).toEqual([])
  })

  it("renders no buttons when nodes is empty", () => {
    render(<FormList nodes={[]} onSelect={() => {}} selectedNodeId={null} />)

    expect(screen.queryAllByRole("button")).toEqual([])
  })
})
