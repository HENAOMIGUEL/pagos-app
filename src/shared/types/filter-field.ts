export interface FilterOption {
  label: string
  value: string
}

export interface FilterField {
  name: string
  label: string
  type: 'text' | 'select'
  options?: Array<string | FilterOption>
  required?: boolean
}
