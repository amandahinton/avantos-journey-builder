import { useEffect, useMemo, useRef, useState } from "react"
import { filterDataGroups, isActiveQuery } from "../prefill/filterDataGroups"
import type { MouseEvent } from "react"
import type { PrefillDataSource, SourceRef } from "../prefill/types"
import type { BlueprintGraph } from "../types/graph"

interface DataElementModalProps {
  graph: BlueprintGraph
  nodeId: string
  onClose: () => void
  onSelect: (sourceRef: SourceRef) => void
  sources: PrefillDataSource[]
}

export default function DataElementModal({
  graph,
  nodeId,
  onClose,
  onSelect,
  sources,
}: DataElementModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState("")
  const [selectedSourceRef, setSelectedSourceRef] = useState<SourceRef | null>(
    null,
  )

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery)
    // new query can hide selected element; hidden selections must not commit
    setSelectedSourceRef(null)
  }

  function handleSelectClick() {
    if (selectedSourceRef === null) return
    onSelect(selectedSourceRef)
  }

  // modal-lifetime inputs: run getDataGroups once per open, not per keystroke
  const sourceDataGroups = useMemo(
    () =>
      sources.map((dataSource) => ({
        dataGroups: dataSource.getDataGroups({ graph, nodeId }),
        sourceId: dataSource.id,
      })),
    [graph, nodeId, sources],
  )

  const hasActiveQuery = isActiveQuery(query)
  const selectableDataGroups = sourceDataGroups.flatMap(
    ({ dataGroups, sourceId }) =>
      filterDataGroups({ dataGroups, query }).map((dataGroup) => ({
        dataGroup,
        sourceId,
      })),
  )

  return (
    <dialog
      aria-labelledby="data-element-modal-title"
      onCancel={onClose}
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <div>
        <h2 id="data-element-modal-title">Select data element to map</h2>
        <h3>Available data</h3>
        <input
          aria-label="Search data elements"
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder="Search"
          type="search"
          value={query}
        />
        <div className="data-group-tree">
          {hasActiveQuery && selectableDataGroups.length === 0 && (
            <p>No data elements match "{query.trim()}"</p>
          )}
          {selectableDataGroups.map(
            ({
              dataGroup: { dataElements, id: groupId, label: groupLabel },
              sourceId,
            }) => (
              <details key={`${sourceId}:${groupId}`} open={hasActiveQuery}>
                <summary>{groupLabel}</summary>
                <ul aria-label={groupLabel} role="list">
                  {dataElements.map(
                    ({ id: elementId, label: elementLabel }) => {
                      const isSelected =
                        selectedSourceRef !== null &&
                        selectedSourceRef.elementId === elementId &&
                        selectedSourceRef.groupId === groupId &&
                        selectedSourceRef.sourceId === sourceId

                      return (
                        <li key={elementId}>
                          <button
                            aria-pressed={isSelected}
                            onClick={() =>
                              setSelectedSourceRef({
                                elementId,
                                groupId,
                                sourceId,
                              })
                            }
                            type="button"
                          >
                            {elementLabel}
                          </button>
                        </li>
                      )
                    },
                  )}
                </ul>
              </details>
            ),
          )}
        </div>
        <div className="modal-footer">
          <button className="secondary-button" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="primary-button"
            disabled={selectedSourceRef === null}
            onClick={handleSelectClick}
            type="button"
          >
            Select
          </button>
        </div>
      </div>
    </dialog>
  )
}
