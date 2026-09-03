import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import FieldRow from "./FieldRow"

interface RenderFieldRowParams {
  mappedLabel?: string | null
  onClear?: () => void
  onOpen?: () => void
}

function renderFieldRow({
  mappedLabel = null,
  onClear = vi.fn(),
  onOpen = vi.fn(),
}: RenderFieldRowParams = {}) {
  render(
    <FieldRow
      fieldKey="email"
      mappedLabel={mappedLabel}
      onClear={onClear}
      onOpen={onOpen}
    />,
  )
}

describe("FieldRow", () => {
  it("shows field key button without clear button for unmapped field", () => {
    renderFieldRow()

    expect(
      screen.getByRole("button", { name: "Map email" }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Clear mapping for email" }),
    ).not.toBeInTheDocument()
  })

  it("calls onOpen when unmapped field button is clicked", async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    renderFieldRow({ onOpen })

    await user.click(screen.getByRole("button", { name: "Map email" }))

    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it("shows field key with mapped label and clear button for mapped field", () => {
    renderFieldRow({ mappedLabel: "Form A.email" })

    expect(screen.getByText("email: Form A.email")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Clear mapping for email" }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Map email" }),
    ).not.toBeInTheDocument()
  })

  it("calls onClear when clear button is clicked", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    renderFieldRow({ mappedLabel: "Form A.email", onClear })

    await user.click(
      screen.getByRole("button", { name: "Clear mapping for email" }),
    )

    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
