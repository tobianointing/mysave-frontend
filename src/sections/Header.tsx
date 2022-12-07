import { Box, Group, Stack, Text, useMantineColorScheme } from "@mantine/core"

import { IconMoonStars, IconSunHigh } from "@tabler/icons"
import React from "react"

type Props = {
  title: string
}

export default function Header(props: Props) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === "dark"

  return (
    <Group position="apart">
      <Stack spacing={0}>
        <Text
          sx={(theme) => ({
            fontSize: "1.5rem",
            fontWeight: 700,

            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              fontSize: "1.875rem",
            },
          })}
        >
          {props.title}
        </Text>
        <Text
          sx={(theme) => ({
            fontSize: "0.875rem",

            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              fontSize: "1rem",
            },
          })}
        >
          Good morning, wash your hands 🌞
        </Text>
      </Stack>

      <Box
        sx={(theme) => ({
          borderRadius: "50%",
          padding: ".4rem",
          backgroundColor: theme.colors.blue[7],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",

          [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            padding: theme.spacing.sm,
          },
        })}
        onClick={() => toggleColorScheme()}
      >
        {dark ? (
          <IconMoonStars color={"#C1C2C5"} size={24} />
        ) : (
          <IconSunHigh color={"white"} size={24} />
        )}
      </Box>
    </Group>
  )
}
