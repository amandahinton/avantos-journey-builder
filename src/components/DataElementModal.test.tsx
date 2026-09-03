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

describe("DataElementModal", () => {
  it("shows dialog title", () => {
    renderModal()

    expect(
      screen.getByRole("dialog", { name: "Select data element to map" }),
    ).toBeInTheDocument()
  })

  it("shows dataGroups from every given source implementing PrefillDataSource", () => {
    const secondSource = makeTestSource({
      dataGroups: [
        {
          dataElements: [{ id: "second_element", label: "second_element" }],
          id: "second-group",
          label: "Second group",
        },
      ],
      id: "second-source",
      label: "Second source",
    })

    renderModal({ sources: [makeTestSource(), secondSource] })

    expect(
      screen.getByRole("heading", { name: "Test source" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Second source" }),
    ).toBeInTheDocument()
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

  it("calls onSelect with coordinates of clicked dataElement", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderModal({ onSelect })

    await user.click(screen.getByText("Test group"))
    await user.click(screen.getByRole("button", { name: "test_element" }))

    expect(onSelect).toHaveBeenCalledExactlyOnceWith({
      elementId: "test_element",
      groupId: "test-group",
      sourceId: "test-source",
    })
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
