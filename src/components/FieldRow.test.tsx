import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import FieldRow from "./FieldRow"

describe("FieldRow", () => {
  it("shows only field key for unmapped field", () => {
    render(<FieldRow fieldKey="email" mappedLabel={null} onClear={vi.fn()} />)

    expect(screen.getByText("email")).toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("shows field key with mapped label and clear button for mapped field", () => {
    render(
      <FieldRow
        fieldKey="email"
        mappedLabel="Form A.email"
        onClear={vi.fn()}
      />,
    )

    expect(screen.getByText("email: Form A.email")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Clear mapping for email" }),
    ).toBeInTheDocument()
  })

  it("calls onClear when clear button is clicked", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()

    render(
      <FieldRow
        fieldKey="email"
        mappedLabel="Form A.email"
        onClear={onClear}
      />,
    )

    await user.click(
      screen.getByRole("button", { name: "Clear mapping for email" }),
    )

    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
