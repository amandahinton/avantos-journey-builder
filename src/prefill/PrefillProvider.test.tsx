import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import PrefillProvider from "./PrefillProvider"
import { usePrefill } from "./usePrefill"
import type { ReactNode } from "react"
import type { PrefillMappings, SourceRef } from "./types"

const formBEmailRef: SourceRef = {
  elementId: "email",
  groupId: "node-b",
  sourceId: "direct-dependencies",
}

function renderUsePrefill(initialMappings?: PrefillMappings) {
  return renderHook(() => usePrefill(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <PrefillProvider initialMappings={initialMappings}>
        {children}
      </PrefillProvider>
    ),
  })
}

describe("PrefillProvider", () => {
  it("provides empty mappings when no initialMappings given", () => {
    const { result } = renderUsePrefill()

    expect(result.current.prefillMappings).toEqual({})
  })

  it("provides given initialMappings", () => {
    const initialMappings: PrefillMappings = {
      "node-d": { email: formBEmailRef },
    }

    const { result } = renderUsePrefill(initialMappings)

    expect(result.current.prefillMappings).toEqual(initialMappings)
  })

  it("provides mappings updated by dispatched action", () => {
    const { result } = renderUsePrefill()

    act(() => {
      result.current.dispatch({
        fieldKey: "email",
        nodeId: "node-d",
        sourceRef: formBEmailRef,
        type: "SET_MAPPING",
      })
    })

    expect(result.current.prefillMappings).toEqual({
      "node-d": { email: formBEmailRef },
    })
  })
})
