import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { StrictMode } from "react"
import { describe, expect, it, vi } from "vitest"
import { makeTestGraph } from "../graph/testHelpers"
import { makeTestSource } from "../prefill/testHelpers"
import DataElementModal from "./DataElementModal"
import type { RenderOptions } from "@testing-library/react"
import type { PrefillDataSource, SourceRef } from "../prefill/types"

interface RenderModalParams {
  onClose?: () => void
  onSelect?: (sourceRef: SourceRef) => void
  sources?: PrefillDataSource[]
  wrapper?: RenderOptions["wrapper"]
}

function renderModal({
  onClose = vi.fn(),
  onSelect = vi.fn(),
  sources = [makeTestSource()],
  wrapper,
}: RenderModalParams = {}) {
  render(
    <DataElementModal
      graph={makeTestGraph([])}
      nodeId="node-being-mapped"
      onClose={onClose}
      onSelect={onSelect}
      sources={sources}
    />,
    { wrapper },
  )
}

const secondTestSource = makeTestSource({
  dataGroups: [
    {
      dataElements: [{ id: "second_element", label: "second_element" }],
      id: "second-group",
      label: "Second group",
    },
  ],
  id: "second-source",
})

describe("DataElementModal", () => {
  it("shows dialog title", () => {
    renderModal()

    expect(
      screen.getByRole("dialog", { name: "Select data element to map" }),
    ).toBeInTheDocument()
  })

  it("shows dataGroups from every given source implementing PrefillDataSource", () => {
    renderModal({ sources: [makeTestSource(), secondTestSource] })

    expect(screen.getByText("Test group")).toBeInTheDocument()
    expect(screen.getByText("Second group")).toBeInTheDocument()
  })

  it("stays open without calling onClose, though StrictMode runs the open effect twice", () => {
    const onClose = vi.fn()

    renderModal({ onClose, wrapper: StrictMode })

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })

  it("hides dataElements until their group summary is clicked", async () => {
    const user = userEvent.setup()
    renderModal()

    expect(screen.getByText("test_element")).not.toBeVisible()

    await user.click(screen.getByText("Test group"))

    expect(screen.getByText("test_element")).toBeVisible()
  })

  it("calls onSelect with coordinates of chosen dataElement when select button is clicked", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderModal({ onSelect })

    await user.click(screen.getByText("Test group"))
    await user.click(screen.getByRole("button", { name: "test_element" }))

    expect(onSelect).not.toHaveBeenCalled()

    await user.click(screen.getByRole("button", { name: "Select" }))

    expect(onSelect).toHaveBeenCalledExactlyOnceWith({
      elementId: "test_element",
      groupId: "test-group",
      sourceId: "test-source",
    })
  })

  it("disables select button until a dataElement is chosen", async () => {
    const user = userEvent.setup()
    renderModal()

    const selectButton = screen.getByRole("button", { name: "Select" })

    expect(selectButton).toBeDisabled()

    await user.click(screen.getByText("Test group"))
    await user.click(screen.getByRole("button", { name: "test_element" }))

    expect(selectButton).toBeEnabled()
  })

  it("marks only the chosen dataElement as pressed", async () => {
    const user = userEvent.setup()
    const twoElementSource = makeTestSource({
      dataGroups: [
        {
          dataElements: [
            { id: "email", label: "email" },
            { id: "name", label: "name" },
          ],
          id: "contact-group",
          label: "Contact group",
        },
      ],
    })
    renderModal({ sources: [twoElementSource] })

    await user.click(screen.getByText("Contact group"))
    await user.click(screen.getByRole("button", { name: "email" }))

    expect(
      screen.getByRole("button", { name: "email", pressed: true }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "name", pressed: false }),
    ).toBeInTheDocument()
  })

  it("shows only matching dataGroups, expanded, when query is typed", async () => {
    const user = userEvent.setup()
    renderModal({ sources: [makeTestSource(), secondTestSource] })

    await user.type(
      screen.getByRole("searchbox", { name: "Search data elements" }),
      "second",
    )

    expect(screen.queryByText("Test group")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "second_element" })).toBeVisible()
  })

  it("restores collapsed dataGroups when query is cleared", async () => {
    const user = userEvent.setup()
    renderModal({ sources: [makeTestSource(), secondTestSource] })
    const searchInput = screen.getByRole("searchbox", {
      name: "Search data elements",
    })

    await user.type(searchInput, "second")
    await user.clear(searchInput)

    expect(screen.getByText("Test group")).toBeInTheDocument()
    expect(screen.getByText("second_element")).not.toBeVisible()
  })

  it("shows no-match message for query matching no dataGroup or dataElement", async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(
      screen.getByRole("searchbox", { name: "Search data elements" }),
      "zzz",
    )

    expect(screen.getByText('No data elements match "zzz"')).toBeInTheDocument()
    expect(screen.queryByText("Test group")).not.toBeInTheDocument()
  })

  it("clears chosen dataElement when query changes, because it may no longer be visible", async () => {
    const user = userEvent.setup()
    renderModal()

    await user.click(screen.getByText("Test group"))
    await user.click(screen.getByRole("button", { name: "test_element" }))

    const selectButton = screen.getByRole("button", { name: "Select" })

    expect(selectButton).toBeEnabled()

    await user.type(
      screen.getByRole("searchbox", { name: "Search data elements" }),
      "t",
    )

    expect(selectButton).toBeDisabled()
  })

  it("calls onClose when cancel button is clicked", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderModal({ onClose })

    await user.click(screen.getByRole("button", { name: "Cancel" }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn()
    renderModal({ onClose })

    fireEvent.click(screen.getByRole("dialog"))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("calls onClose when dialog is cancelled, as Escape does in the browser", () => {
    const onClose = vi.fn()
    renderModal({ onClose })

    fireEvent(screen.getByRole("dialog"), new Event("cancel"))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("does not call onSelect or onClose when a group is expanded", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onSelect = vi.fn()
    renderModal({ onClose, onSelect })

    await user.click(screen.getByText("Test group"))

    expect(onSelect).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })
})
