import { useState } from "react"
import { StoryFn, Meta } from "@storybook/react"
import { DropdownSelect, IDropdownSelect } from "./index"

export default {
  title: "Molecules/DropdownSelect",
  component: DropdownSelect,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    bordered: { control: "boolean" },
    options: { control: "object" },
    isSearch: { control: "boolean" },
    selectedValues: { control: "array" },
    setSelectedValues: { action: "setSelectedValues" },
    placeholder: { control: "text" },
    isMultiselect: { control: "boolean" },
    firstSelected: { control: "boolean" },
    disabled: { control: "boolean" },
    showSelectAllOption: { control: "boolean" },
    errorText: { control: "text" },
    id: { control: "text" },
    showIcon: { control: "boolean" },
  },
} as unknown as Meta<IDropdownSelect>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template: StoryFn<IDropdownSelect> = (args: any) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  return (
    <DropdownSelect
      {...args}
      selectedValues={selectedValues}
      setSelectedValues={setSelectedValues}
    />
  )
}

// Example options for stories
const optionsExample = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
]

export const Multiselect = Template.bind({})
Multiselect.args = {
  label: "Dropdown Label",
  options: optionsExample,
}

export const SingleSelect = Template.bind({})
SingleSelect.args = {
  label: "SingleSelect Dropdown",
  options: optionsExample,
  isMultiselect: false,
  selectedValues: ["option1"],
}

export const WithSearch = Template.bind({})
WithSearch.args = {
  label: "Dropdown With Search",
  options: optionsExample,
}

export const Disabled = Template.bind({})
Disabled.args = {
  label: "Disabled Dropdown",
  options: optionsExample,
  disabled: true,
}

export const Error = Template.bind({})
Error.args = {
  label: "Error Dropdown",
  options: optionsExample,
  errorText: "Something went wrong",
}
