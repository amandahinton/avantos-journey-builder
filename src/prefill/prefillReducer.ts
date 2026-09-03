import type { PrefillMappings, SourceRef } from "./types"

export type PrefillAction =
  | {
      fieldKey: string
      nodeId: string
      sourceRef: SourceRef
      type: "SET_MAPPING"
    }
  | {
      fieldKey: string
      nodeId: string
      type: "CLEAR_MAPPING"
    }

export function prefillReducer(
  prefillMappings: PrefillMappings,
  action: PrefillAction,
): PrefillMappings {
  switch (action.type) {
    case "SET_MAPPING": {
      const nodeMappings = prefillMappings[action.nodeId] ?? {}

      return {
        ...prefillMappings,
        [action.nodeId]: {
          ...nodeMappings,
          [action.fieldKey]: action.sourceRef,
        },
      }
    }
    case "CLEAR_MAPPING": {
      const nodeMappings = prefillMappings[action.nodeId]

      if (!nodeMappings || !Object.hasOwn(nodeMappings, action.fieldKey)) {
        return prefillMappings
      }

      const remainingNodeMappings = { ...nodeMappings }
      delete remainingNodeMappings[action.fieldKey]

      return { ...prefillMappings, [action.nodeId]: remainingNodeMappings }
    }
  }
}
