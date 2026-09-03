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
      <button aria-label={`Map ${fieldKey}`} onClick={onOpen} type="button">
        {fieldKey}
      </button>
    )
  }

  return (
    <span>
      {fieldKey}: {mappedLabel}
      <button
        aria-label={`Clear mapping for ${fieldKey}`}
        onClick={onClear}
        type="button"
      >
        <span aria-hidden="true">✕</span>
      </button>
    </span>
  )
}
