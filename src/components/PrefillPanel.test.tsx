import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import graph from "../fixtures/graph.json"
import { findNodeByName } from "../graph/testHelpers"
import { dataSourcesRegistry } from "../prefill/dataSourcesRegistry"
import PrefillPanel from "./PrefillPanel"
import type { PrefillDataSource } from "../prefill/types"

function renderPanelFor(name: string) {
  render(
    <PrefillPanel
      graph={graph}
      nodeId={findNodeByName(name).id}
      sources={dataSourcesRegistry}
    />,
  )
}

describe("PrefillPanel", () => {
  it("shows given form name as heading", () => {
    renderPanelFor("Form D")

    expect(screen.getByRole("heading", { name: "Form D" })).toBeInTheDocument()
  })

  it("lists field keys of form template in schema order", () => {
    renderPanelFor("Form D")

    const fieldsList = screen.getByRole("list", { name: "Fields" })
    const fieldKeys = within(fieldsList)
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

  it("shows dataGroups from every given source for Form D, which has both direct and transitive dependencies", () => {
    renderPanelFor("Form D")

    const formBList = screen.getByRole("list", { name: "Form B" })
    const formAList = screen.getByRole("list", { name: "Form A" })
    const globalList = screen.getByRole("list", { name: "Global" })

    expect(within(formBList).getByText("email")).toBeInTheDocument()
    expect(within(formAList).getByText("email")).toBeInTheDocument()
    expect(
      within(globalList).getByText("organization_name"),
    ).toBeInTheDocument()
  })

  it("shows only dataGroups from given sources for Form D, which has both direct and transitive dependencies", () => {
    const sourcesWithoutGlobal = dataSourcesRegistry.filter(
      (dataSource) => dataSource.id !== "global-data",
    )

    render(
      <PrefillPanel
        graph={graph}
        nodeId={findNodeByName("Form D").id}
        sources={sourcesWithoutGlobal}
      />,
    )

    expect(screen.queryByText("Global data")).not.toBeInTheDocument()
    expect(screen.getByRole("list", { name: "Form B" })).toBeInTheDocument()
  })

  it("shows dataGroups from any source satisfying the contract for given node", () => {
    const testSource: PrefillDataSource = {
      getDataGroups() {
        return [
          {
            dataElements: [{ id: "test_element", label: "test_element" }],
            id: "test-group",
            label: "Test group",
          },
        ]
      },
      id: "test-source",
      label: "Test source",
    }

    render(
      <PrefillPanel
        graph={graph}
        nodeId={findNodeByName("Form D").id}
        sources={[testSource]}
      />,
    )

    const testGroupList = screen.getByRole("list", { name: "Test group" })

    expect(within(testGroupList).getByText("test_element")).toBeInTheDocument()
  })
})
