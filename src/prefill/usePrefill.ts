import { createContext, useContext } from "react"
import type { Dispatch } from "react"
import type { PrefillAction } from "./prefillReducer"
import type { PrefillMappings } from "./types"

export interface PrefillContextValue {
  dispatch: Dispatch<PrefillAction>
  prefillMappings: PrefillMappings
}

export const PrefillContext = createContext<PrefillContextValue | null>(null)

export function usePrefill(): PrefillContextValue {
  const contextValue = useContext(PrefillContext)

  if (!contextValue) {
    throw new Error("usePrefill: no PrefillProvider found above this component")
  }

  return contextValue
}
