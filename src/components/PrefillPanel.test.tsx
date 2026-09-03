import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import graph from "../fixtures/graph.json"
import {
  findNodeByName,
  makeTestGraph,
  makeTestNode,
} from "../graph/testHelpers"
import PrefillProvider from "../prefill/PrefillProvider"
import { dataSourcesRegistry } from "../prefill/dataSourcesRegistry"
import { makeTestSource } from "../prefill/testHelpers"
import PrefillPanel from "./PrefillPanel"
import type { PrefillDataSource, PrefillMappings } from "../prefill/types"
import type { FormDefinition } from "../types/graph"

interface RenderPanelParams {
  formName: string
  initialMappings?: PrefillMappings
  sources?: PrefillDataSource[]
}

function renderPanelFor({
  formName,
  initialMappings,
  sources = dataSourcesRegistry,
}: RenderPanelParams) {
  render(
    <PrefillProvider initialMappings={initialMappings}>
      <PrefillPanel
        graph={graph}
        nodeId={findNodeByName(formName).id}
        sources={sources}
      />
    </PrefillProvider>,
  )
}

function makeFormDEmailFromFormBMapping(): PrefillMappings {
  return {
    [findNodeByName("Form D").id]: {
      email: {
        elementId: "email",
        groupId: findNodeByName("Form B").id,
        sourceId: "direct-dependencies",
      },
    },
  }
}

describe("PrefillPanel", () => {
  it("shows given form name as heading", () => {
    renderPanelFor({ formName: "Form D" })

    expect(screen.getByRole("heading", { name: "Form D" })).toBeInTheDocument()
  })

  it("lists field keys of form template in schema order", () => {
    renderPanelFor({ formName: "Form D" })

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

  it("lists every field key in schema order, though one field is mapped", () => {
    renderPanelFor({
      formName: "Form D",
      initialMappings: makeFormDEmailFromFormBMapping(),
    })

    const fieldsList = screen.getByRole("list", { name: "Fields" })
    const rowTexts = within(fieldsList)
      .getAllByRole("listitem")
      .map((listItem) => listItem.textContent)

    expect(rowTexts).toEqual([
      "button",
      "dynamic_checkbox_group",
      "dynamic_object",
      "email: Form B.email✕",
      "id",
      "multi_select",
      "name",
      "notes",
    ])
  })

  it("shows mapped row with label derived from stored sourceRef", () => {
    renderPanelFor({
      formName: "Form D",
      initialMappings: makeFormDEmailFromFormBMapping(),
    })

    const fieldsList = screen.getByRole("list", { name: "Fields" })

    expect(
      within(fieldsList).getByText("email: Form B.email"),
    ).toBeInTheDocument()
  })

  it("returns row to unmapped state when its clear button is clicked", async () => {
    const user = userEvent.setup()
    renderPanelFor({
      formName: "Form D",
      initialMappings: makeFormDEmailFromFormBMapping(),
    })

    await user.click(
      screen.getByRole("button", { name: "Clear mapping for email" }),
    )

    const fieldsList = screen.getByRole("list", { name: "Fields" })

    expect(
      within(fieldsList).queryByText("email: Form B.email"),
    ).not.toBeInTheDocument()
    expect(within(fieldsList).getByText("email")).toBeInTheDocument()
  })

  it("clears only the clicked row, leaving other mapped rows intact", async () => {
    const user = userEvent.setup()
    const formDNodeId = findNodeByName("Form D").id
    renderPanelFor({
      formName: "Form D",
      initialMappings: {
        [formDNodeId]: {
          email: {
            elementId: "email",
            groupId: findNodeByName("Form B").id,
            sourceId: "direct-dependencies",
          },
          name: {
            elementId: "current_user_name",
            groupId: "global",
            sourceId: "global-data",
          },
        },
      },
    })

    await user.click(
      screen.getByRole("button", { name: "Clear mapping for email" }),
    )

    const fieldsList = screen.getByRole("list", { name: "Fields" })

    expect(
      within(fieldsList).queryByText("email: Form B.email"),
    ).not.toBeInTheDocument()
    expect(
      within(fieldsList).getByText("name: Global.current_user_name"),
    ).toBeInTheDocument()
  })

  it("shows unmapped row for field key that collides with an Object.prototype key", () => {
    const constructorFieldForm: FormDefinition = {
      field_schema: {
        properties: {
          constructor: { avantos_type: "short-text", type: "string" },
        },
        type: "object",
      },
      id: "form-template",
      name: "test form",
    }
    const testGraph = {
      ...makeTestGraph([makeTestNode({ id: "a", prerequisites: [] })]),
      forms: [constructorFieldForm],
    }

    render(
      <PrefillProvider>
        <PrefillPanel graph={testGraph} nodeId="a" sources={[]} />
      </PrefillProvider>,
    )

    const fieldsList = screen.getByRole("list", { name: "Fields" })

    expect(within(fieldsList).getByText("constructor")).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Clear mapping for constructor" }),
    ).not.toBeInTheDocument()
  })

  it("opens data element modal when unmapped field button is clicked", async () => {
    const user = userEvent.setup()
    renderPanelFor({ formName: "Form D" })

    await user.click(screen.getByRole("button", { name: "Map email" }))

    expect(
      screen.getByRole("dialog", { name: "Select data element to map" }),
    ).toBeInTheDocument()
  })

  it("maps clicked field from modal selection and closes modal", async () => {
    const user = userEvent.setup()
    renderPanelFor({ formName: "Form D" })

    await user.click(screen.getByRole("button", { name: "Map email" }))

    const dialog = screen.getByRole("dialog")
    await user.click(within(dialog).getByText("Form B"))

    const formBGroupList = within(dialog).getByRole("list", { name: "Form B" })
    await user.click(
      within(formBGroupList).getByRole("button", { name: "email" }),
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    const fieldsList = screen.getByRole("list", { name: "Fields" })
    expect(
      within(fieldsList).getByText("email: Form B.email"),
    ).toBeInTheDocument()
  })

  it("closes modal leaving field unmapped when cancel is clicked", async () => {
    const user = userEvent.setup()
    renderPanelFor({ formName: "Form D" })

    await user.click(screen.getByRole("button", { name: "Map email" }))
    await user.click(screen.getByRole("button", { name: "Cancel" }))

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    const fieldsList = screen.getByRole("list", { name: "Fields" })
    expect(
      within(fieldsList).queryByText("email: Form B.email"),
    ).not.toBeInTheDocument()
  })

  it("shows dataGroups from every given source in the modal for Form D, which has both direct and transitive dependencies", async () => {
    const user = userEvent.setup()
    renderPanelFor({ formName: "Form D" })

    await user.click(screen.getByRole("button", { name: "Map email" }))

    const dialog = screen.getByRole("dialog")
    const formBList = within(dialog).getByRole("list", { name: "Form B" })
    const formAList = within(dialog).getByRole("list", { name: "Form A" })
    const globalList = within(dialog).getByRole("list", { name: "Global" })

    expect(within(formBList).getByText("email")).toBeInTheDocument()
    expect(within(formAList).getByText("email")).toBeInTheDocument()
    expect(
      within(globalList).getByText("organization_name"),
    ).toBeInTheDocument()
  })

  it("shows only dataGroups from given sources in the modal for Form D, which has both direct and transitive dependencies", async () => {
    const user = userEvent.setup()
    const sourcesWithoutGlobal = dataSourcesRegistry.filter(
      (dataSource) => dataSource.id !== "global-data",
    )
    renderPanelFor({ formName: "Form D", sources: sourcesWithoutGlobal })

    await user.click(screen.getByRole("button", { name: "Map email" }))

    const dialog = screen.getByRole("dialog")

    expect(screen.queryByText("Global data")).not.toBeInTheDocument()
    expect(
      within(dialog).getByRole("list", { name: "Form B" }),
    ).toBeInTheDocument()
  })

  it("shows dataGroups from any source implementing PrefillDataSource for given node", async () => {
    const user = userEvent.setup()
    renderPanelFor({ formName: "Form D", sources: [makeTestSource()] })

    await user.click(screen.getByRole("button", { name: "Map email" }))

    const dialog = screen.getByRole("dialog")
    const testGroupList = within(dialog).getByRole("list", {
      name: "Test group",
    })

    expect(within(testGroupList).getByText("test_element")).toBeInTheDocument()
  })
})
