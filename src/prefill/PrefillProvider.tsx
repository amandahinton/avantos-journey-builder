import { useReducer } from "react"
import { prefillReducer } from "./prefillReducer"
import { PrefillContext } from "./usePrefill"
import type { ReactNode } from "react"
import type { PrefillMappings } from "./types"

interface PrefillProviderProps {
  children: ReactNode
  initialMappings?: PrefillMappings
}

export default function PrefillProvider({
  children,
  initialMappings = {},
}: PrefillProviderProps) {
  const [prefillMappings, dispatch] = useReducer(
    prefillReducer,
    initialMappings,
  )

  return (
    <PrefillContext value={{ dispatch, prefillMappings }}>
      {children}
    </PrefillContext>
  )
}
