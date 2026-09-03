import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { usePrefill } from "./usePrefill"

describe("usePrefill", () => {
  it("throws with hook name when no PrefillProvider is above the component", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {})

    try {
      expect(() => renderHook(() => usePrefill())).toThrow(
        "usePrefill: no PrefillProvider found above this component",
      )
    } finally {
      consoleErrorSpy.mockRestore()
    }
  })
})
