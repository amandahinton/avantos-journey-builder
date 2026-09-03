import { describe, expect, it } from "vitest"
import { filterDataGroups } from "./filterDataGroups"
import type { DataGroup } from "./types"

const contactGroup: DataGroup = {
  dataElements: [
    { id: "email", label: "email" },
    { id: "name", label: "name" },
  ],
  id: "contact-group",
  label: "Contact group",
}

const notesGroup: DataGroup = {
  dataElements: [{ id: "notes", label: "notes" }],
  id: "notes-group",
  label: "Notes group",
}

describe("filterDataGroups", () => {
  it("returns given dataGroups unchanged when query is empty", () => {
    const givenDataGroups = [contactGroup, notesGroup]

    const filteredDataGroups = filterDataGroups({
      dataGroups: givenDataGroups,
      query: "",
    })

    expect(filteredDataGroups).toBe(givenDataGroups)
  })

  it("returns given dataGroups unchanged when query is only whitespace", () => {
    const givenDataGroups = [contactGroup, notesGroup]

    const filteredDataGroups = filterDataGroups({
      dataGroups: givenDataGroups,
      query: "   ",
    })

    expect(filteredDataGroups).toBe(givenDataGroups)
  })

  it("returns only dataElements with labels containing query, regardless of case", () => {
    const filteredDataGroups = filterDataGroups({
      dataGroups: [contactGroup, notesGroup],
      query: "EMA",
    })

    expect(filteredDataGroups).toEqual([
      {
        dataElements: [{ id: "email", label: "email" }],
        id: "contact-group",
        label: "Contact group",
      },
    ])
  })

  it("returns dataGroups without groups left empty by the filter", () => {
    const filteredDataGroups = filterDataGroups({
      dataGroups: [contactGroup, notesGroup],
      query: "notes",
    })

    expect(filteredDataGroups).toEqual([notesGroup])
  })

  it("returns whole dataGroup when query matches its label, though no element label matches", () => {
    const filteredDataGroups = filterDataGroups({
      dataGroups: [contactGroup, notesGroup],
      query: "contact",
    })

    expect(filteredDataGroups).toEqual([contactGroup])
  })

  it("does not mutate given dataGroups", () => {
    const givenDataGroups = [contactGroup]

    filterDataGroups({ dataGroups: givenDataGroups, query: "email" })

    expect(contactGroup.dataElements).toHaveLength(2)
  })
})
