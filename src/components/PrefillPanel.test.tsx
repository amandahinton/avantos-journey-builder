import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import graph from "../fixtures/graph.json"
import { findNodeByName } from "../graph/testHelpers"
import PrefillPanel from "./PrefillPanel"

function renderPanelFor(name: string) {
  render(<PrefillPanel graph={graph} nodeId={findNodeByName(name).id} />)
}

describe("PrefillPanel", () => {
  it("shows given form name as heading", () => {
    renderPanelFor("Form D")

    expect(screen.getByRole("heading", { name: "Form D" })).toBeInTheDocument()
  })

  it("lists field keys of form template in schema order", () => {
    renderPanelFor("Form D")

    const fieldKeys = screen
      .getAllByRole("listitem")
      .map((listItem) => listItem.textContent)

    expect(fieldKeys).toEqual([
      "button",
      "dynamic_checkbox_group",
      "dynamic_object",
      "email",
      "id",
      "multi_select",
      "name",
      "notes",
    ])
  })

  it("shows one direct and one transitive dependency for Form D, a simple chain", () => {
    renderPanelFor("Form D")

    expect(screen.getByText("Direct dependencies: Form B")).toBeInTheDocument()
    expect(
      screen.getByText("Transitive dependencies: Form A"),
    ).toBeInTheDocument()
  })

  it("shows multiple dependencies for Form F, where two paths reconverge, in traversal order", () => {
    renderPanelFor("Form F")

    expect(
      screen.getByText("Direct dependencies: Form D, Form E"),
    ).toBeInTheDocument()
    expect(
      screen.getByText("Transitive dependencies: Form B, Form C, Form A"),
    ).toBeInTheDocument()
  })

  it("shows no dependency names for Form A, the start of the journey", () => {
    renderPanelFor("Form A")

    expect(screen.getByText("Direct dependencies:")).toBeInTheDocument()
    expect(screen.getByText("Transitive dependencies:")).toBeInTheDocument()
  })
})
