import { Stack, Button, Text, Select } from "@mantine/core"
import React from "react"
import { Link } from "react-router-dom"
import { CustomTextInput } from "../components/CustomTextInput"
import { AuthCard, AuthHeader } from "./Login"

type Props = {}

export default function ForgotPassword(props: Props) {
  return (
    <>
      <AuthCard>
        <AuthHeader
          primaryText="Forgot Password"
          secondaryText="Enter email to reset password"
        />

        <form>
          <Stack spacing={"xl"}>
            <CustomTextInput label="Email Address" placeholder={"Enter email address"} />
          </Stack>

          <Button
            fullWidth
            mt={"xl"}
            size={"lg"}
            sx={(theme) => ({
              borderRadius: theme.radius.md,
              borderEndStartRadius: "0",
              fontSize: "14px",
              fontWeight: 700,
            })}
          >
            RESET PASSWORD
          </Button>
        </form>
      </AuthCard>

      <Stack
        align={"center"}
        mt={"xl"}
        sx={(theme) => ({
          color: "white",
          fontSize: ".875rem",
          fontWeight: 400,
        })}
      >
        <Text to={"/auth/login"} component={Link}>
          Back to login
        </Text>
      </Stack>
    </>
  )
}
