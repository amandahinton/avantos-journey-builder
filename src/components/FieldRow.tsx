interface FieldRowProps {
  fieldKey: string
  mappedLabel: string | null
  onClear: () => void
}

export default function FieldRow({
  fieldKey,
  mappedLabel,
  onClear,
}: FieldRowProps) {
  if (!mappedLabel) {
    return <span>{fieldKey}</span>
  }

  // TODO: not in browser until next commit (proven in tests)
  return (
    <span>
      {fieldKey}: {mappedLabel}
      <button
        aria-label={`Clear mapping for ${fieldKey}`}
        onClick={onClear}
        type="button"
      >
        ✕
      </button>
    </span>
  )
}
