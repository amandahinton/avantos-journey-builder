import type { GraphNode } from "../types/graph"

interface FormListProps {
  nodes: GraphNode[]
  onSelect: (nodeId: string) => void
  selectedNodeId: string | null
}

export default function FormList({
  nodes,
  onSelect,
  selectedNodeId,
}: FormListProps) {
  const sortedNodes = nodes.toSorted((firstNode, secondNode) =>
    firstNode.data.name.localeCompare(secondNode.data.name),
  )

  return (
    <ul className="form-list" role="list">
      {sortedNodes.map((node) => (
        <li key={node.id}>
          <button
            aria-current={node.id === selectedNodeId}
            onClick={() => onSelect(node.id)}
          >
            {node.data.name}
          </button>
        </li>
      ))}
    </ul>
  )
}
