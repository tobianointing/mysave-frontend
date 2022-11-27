import { MantineSize, NumberInput } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useState } from "react"

interface CustomNumberInputProps {
  label: string
  placeholder: string
  size?: MantineSize
  required?: boolean
}

export function CustomNumberInput(props: CustomNumberInputProps) {

  const largeScreen = useMediaQuery("(min-width: 900px)")
  return (
    <NumberInput
      variant="filled"
      size={largeScreen ? (props.size ? props.size : "xl") : "lg"}
      labelProps={{ size: "xs", mb: "xs" }}
      styles={{ input: { fontSize: "16px" } }}
      hideControls
      required={props.required}
      {...props}
    />
  )
}
