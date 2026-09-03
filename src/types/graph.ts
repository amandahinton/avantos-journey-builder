// Only the parts of the payload this app reads are typed
// Payload structure and how ids relate - docs/data-model.md

export interface BlueprintGraph {
  forms: FormDefinition[]
  id: string
  name: string
  nodes: GraphNode[]
}

export interface FieldDefinition {
  avantos_type: string
  type: string
  format?: string
  title?: string
}

export interface FieldSchema {
  properties: Record<string, FieldDefinition>
  type: string
  required?: string[]
}

export interface FormDefinition {
  field_schema: FieldSchema
  id: string
  name: string
}

export interface GraphNode {
  data: NodeComponent
  id: string
  type: string
}

export interface NodeComponent {
  component_id: string
  id: string
  input_mapping: Record<string, unknown>
  name: string
  prerequisites: string[]
}
