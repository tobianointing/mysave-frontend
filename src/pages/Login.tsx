import { Card, Stack, Text, Button, PasswordInput } from "@mantine/core"
import { Link } from "react-router-dom"
import { CustomTextInput } from "../components/CustomTextInput"
import { useForm } from "@mantine/form"
import { useMediaQuery } from "@mantine/hooks"
import { useMutation } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { useAuth } from "../store"
import { useNavigate } from "react-router-dom"

type Props = {}

export default function Login(props: Props) {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length < 4 ? "Password must have at least 4 letters" : null),
    },
  })

  const navigate = useNavigate()

  const [setIsAuthenticated, setToken, setUserData] = useAuth((state: any) => [
    state.setIsAuthenticated,
    state.setToken,
    state.setUserData
  ])

  const largeScreen = useMediaQuery("(min-width: 900px)")

  const loginUser = async (values: any) => {
    const res = await fetch("http://localhost/mysave/backend/login", {
      method: "POST",
      body: JSON.stringify(values),
    })

    const json = await res.json()

    return json
  }

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data, variables, context) => {
      if (data.status === 0) {
        showNotification({
          message: data.message,
          color: "red",
        })
      } else if (data.status === 1) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("userId", data.user_id)
        setIsAuthenticated(true)
        setUserData(data.result)
        navigate("/")
        setToken(data.token)
        showNotification({
          message: data.message,
          color: "blue",
        })

      }
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log(error)
    },
  })

  return (
    <>
      <AuthCard>
        <AuthHeader
          primaryText="Login to your account"
          secondaryText=" Securely Login to your account"
        />

        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <Stack spacing={"xl"}>
            <CustomTextInput
              label="Email or Account Number"
              placeholder="Email or Account Number"
              {...form.getInputProps("email")}
            />

            <PasswordInput
              placeholder="Password"
              label="Password"
              variant="filled"
              size={largeScreen ? "xl" : "lg"}
              labelProps={{ size: "xs", mb: "xs" }}
              styles={{ input: { fontSize: "16px" } }}
              {...form.getInputProps("password")}
            />
          </Stack>

          <Button
            fullWidth
            mt={"xl"}
            size={"lg"}
            type={"submit"}
            disabled={mutation.isLoading}
            sx={(theme) => ({
              borderRadius: theme.radius.md,
              borderEndStartRadius: "0",
              fontSize: "14px",
              fontWeight: 700,
            })}
          >
            LOG IN
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
        <Text to={"/auth/register"} component={Link}>
          Don't have an account? Register
        </Text>

        <Text to={"/auth/forgot-password"} component={Link}>
          Forgot password?
        </Text>
      </Stack>
    </>
  )
}

interface AuthCardProps {
  children: JSX.Element | JSX.Element[]
}

export function AuthCard(props: AuthCardProps) {
  return (
    <Card
      sx={(theme) => ({
        width: "100%",
        borderRadius: theme.radius.lg,
        borderEndStartRadius: "0",

        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
          width: "448px",
          padding: "40px",
        },
      })}
      p={30}
    >
      {props.children}
    </Card>
  )
}

interface AuthHeaderProps {
  primaryText: string
  secondaryText: string
}

export function AuthHeader(props: AuthHeaderProps) {
  // const largeScreen = useMediaQuery("(min-width: 900px)")
  return (
    <Stack mb={32} spacing={0}>
      <Text
        sx={(theme) => ({
          fontSize: "1.35rem",
          color: theme.colors.blue[6],
          fontWeight: 600,

          [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            fontSize: "1.5rem",
          },
        })}
        align="center"
      >
        {props.primaryText}
      </Text>
      <Text
        align="center"
        sx={(theme) => ({
          fontSize: ".875rem",
          fontWeight: 400,
        })}
      >
        {props.secondaryText}
      </Text>
    </Stack>
  )
}
