export interface IOption {
  label: string
  subLabel?: string
  afterLabel?: string | number
  icon?: string | { src: string }
  value: string
  disabled?: boolean
}
