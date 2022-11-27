import { MantineSize, TextInput } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

interface CustomTextInputProps {
  label: string
  placeholder?: string
  size?: MantineSize 
  required? :boolean
}

export function CustomTextInput(props: CustomTextInputProps) {
  const largeScreen = useMediaQuery("(min-width: 900px)")
  return (
    <TextInput
      variant="filled"
      size={largeScreen ? props.size ? props.size : "xl" : "lg"}
      // label={props.label}
      labelProps={{ size: "xs", mb: "xs" }}
      placeholder={props.placeholder}
      styles={{ input: { fontSize: "16px" } }}
      required={props.required}
      {...props}
    />
  )
}
