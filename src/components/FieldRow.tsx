interface FieldRowProps {
  fieldKey: string
  mappedLabel: string | null
  onClear: () => void
  onOpen: () => void
}

export default function FieldRow({
  fieldKey,
  mappedLabel,
  onClear,
  onOpen,
}: FieldRowProps) {
  if (!mappedLabel) {
    return (
      <button
        aria-label={`Map ${fieldKey}`}
        className="field-row-unmapped"
        onClick={onOpen}
        type="button"
      >
        {fieldKey}
      </button>
    )
  }

  return (
    <span className="field-row-mapped">
      {fieldKey}: {mappedLabel}
      <button
        aria-label={`Clear mapping for ${fieldKey}`}
        className="clear-mapping-button"
        onClick={onClear}
        type="button"
      >
        <span aria-hidden="true">✕</span>
      </button>
    </span>
  )
}
