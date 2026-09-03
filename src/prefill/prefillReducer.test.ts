import { describe, expect, it } from "vitest"
import { prefillReducer } from "./prefillReducer"
import type { PrefillMappings, SourceRef } from "./types"

const formDNodeId = "node-d"
const formENodeId = "node-e"

const formAEmailRef: SourceRef = {
  elementId: "email",
  groupId: "node-a",
  sourceId: "transitive-dependencies",
}

const formBEmailRef: SourceRef = {
  elementId: "email",
  groupId: "node-b",
  sourceId: "direct-dependencies",
}

const organizationNameRef: SourceRef = {
  elementId: "organization_name",
  groupId: "global",
  sourceId: "global-data",
}

describe("prefillReducer", () => {
  describe("SET_MAPPING", () => {
    it("returns mappings with sourceRef stored under node id and field key", () => {
      const newMappings = prefillReducer(
        {},
        {
          fieldKey: "email",
          nodeId: formDNodeId,
          sourceRef: formBEmailRef,
          type: "SET_MAPPING",
        },
      )

      expect(newMappings).toEqual({ [formDNodeId]: { email: formBEmailRef } })
    })

    it("returns mappings with replaced sourceRef when field key is already mapped", () => {
      const givenMappings: PrefillMappings = {
        [formDNodeId]: { email: formBEmailRef },
      }

      const newMappings = prefillReducer(givenMappings, {
        fieldKey: "email",
        nodeId: formDNodeId,
        sourceRef: formAEmailRef,
        type: "SET_MAPPING",
      })

      expect(newMappings).toEqual({ [formDNodeId]: { email: formAEmailRef } })
    })

    it("returns mappings with sourceRef stored under given node only, though another node maps the same field key", () => {
      const givenMappings: PrefillMappings = {
        [formENodeId]: { email: formAEmailRef },
      }

      const newMappings = prefillReducer(givenMappings, {
        fieldKey: "email",
        nodeId: formDNodeId,
        sourceRef: formBEmailRef,
        type: "SET_MAPPING",
      })

      expect(newMappings).toEqual({
        [formDNodeId]: { email: formBEmailRef },
        [formENodeId]: { email: formAEmailRef },
      })
    })

    it("does not mutate given mappings", () => {
      const givenMappings: PrefillMappings = {
        [formDNodeId]: { email: formBEmailRef },
      }

      prefillReducer(givenMappings, {
        fieldKey: "name",
        nodeId: formDNodeId,
        sourceRef: formAEmailRef,
        type: "SET_MAPPING",
      })

      expect(givenMappings).toEqual({ [formDNodeId]: { email: formBEmailRef } })
    })
  })

  describe("CLEAR_MAPPING", () => {
    it("returns mappings without cleared field key", () => {
      const givenMappings: PrefillMappings = {
        [formDNodeId]: {
          email: formBEmailRef,
          name: organizationNameRef,
        },
      }

      const newMappings = prefillReducer(givenMappings, {
        fieldKey: "email",
        nodeId: formDNodeId,
        type: "CLEAR_MAPPING",
      })

      expect(newMappings).toEqual({
        [formDNodeId]: { name: organizationNameRef },
      })
    })

    it("returns mappings without cleared field key under given node only, though another node maps the same field key", () => {
      const givenMappings: PrefillMappings = {
        [formDNodeId]: { email: formBEmailRef },
        [formENodeId]: { email: formAEmailRef },
      }

      const newMappings = prefillReducer(givenMappings, {
        fieldKey: "email",
        nodeId: formDNodeId,
        type: "CLEAR_MAPPING",
      })

      expect(newMappings).toEqual({
        [formDNodeId]: {},
        [formENodeId]: { email: formAEmailRef },
      })
    })

    it("returns given mappings unchanged when field key is not mapped", () => {
      const givenMappings: PrefillMappings = {
        [formDNodeId]: { email: formBEmailRef },
      }

      const newMappings = prefillReducer(givenMappings, {
        fieldKey: "name",
        nodeId: formDNodeId,
        type: "CLEAR_MAPPING",
      })

      expect(newMappings).toBe(givenMappings)
    })

    it("returns given mappings unchanged when field key collides with an Object.prototype key", () => {
      const givenMappings: PrefillMappings = {
        [formDNodeId]: { email: formBEmailRef },
      }

      const newMappings = prefillReducer(givenMappings, {
        fieldKey: "toString",
        nodeId: formDNodeId,
        type: "CLEAR_MAPPING",
      })

      expect(newMappings).toBe(givenMappings)
    })

    it("returns given mappings unchanged when node has no mappings", () => {
      const givenMappings: PrefillMappings = {
        [formDNodeId]: { email: formBEmailRef },
      }

      const newMappings = prefillReducer(givenMappings, {
        fieldKey: "email",
        nodeId: formENodeId,
        type: "CLEAR_MAPPING",
      })

      expect(newMappings).toBe(givenMappings)
    })

    it("does not mutate given mappings", () => {
      const givenMappings: PrefillMappings = {
        [formDNodeId]: {
          email: formBEmailRef,
          name: organizationNameRef,
        },
      }

      prefillReducer(givenMappings, {
        fieldKey: "email",
        nodeId: formDNodeId,
        type: "CLEAR_MAPPING",
      })

      expect(givenMappings).toEqual({
        [formDNodeId]: {
          email: formBEmailRef,
          name: organizationNameRef,
        },
      })
    })
  })
})
