import { Container, Text } from "@mantine/core"
import { Outlet } from "react-router-dom"

type Props = {}

export default function AuthLayout(props: Props) {
  return (
    <Container
      sx={(theme) => ({
        backgroundColor: theme.colors.blue[9],
        minHeight: "100vh",
        width: "100%",

        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
          display: "grid",
          placeContent: "center",
        },
      })}
      py={48}
      fluid
    >
      <Text
        sx={(theme) => ({
          fontSize: "2rem",
          fontWeight: 600,
        })}
        align="center"
        color={"white"}
        mb={42}
      >
        MySave
      </Text>
      <Outlet />
    </Container>
  )
}
