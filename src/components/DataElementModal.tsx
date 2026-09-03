import { useEffect, useRef } from "react"
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

  return (
    <dialog
      aria-labelledby="data-element-modal-title"
      onCancel={onClose}
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <div>
        <h2 id="data-element-modal-title">Select data element to map</h2>
        {sources.map((dataSource) => {
          const { id: sourceId, label: sourceLabel } = dataSource

          return (
            <section key={sourceId}>
              <h3>{sourceLabel}</h3>
              {dataSource
                .getDataGroups({ graph, nodeId })
                .map(({ dataElements, id: groupId, label: groupLabel }) => (
                  <details key={groupId}>
                    <summary>{groupLabel}</summary>
                    <ul aria-label={groupLabel}>
                      {dataElements.map(
                        ({ id: elementId, label: elementLabel }) => (
                          <li key={elementId}>
                            <button
                              onClick={() =>
                                onSelect({ elementId, groupId, sourceId })
                              }
                              type="button"
                            >
                              {elementLabel}
                            </button>
                          </li>
                        ),
                      )}
                    </ul>
                  </details>
                ))}
            </section>
          )
        })}
        <button onClick={onClose} type="button">
          Cancel
        </button>
      </div>
    </dialog>
  )
}
