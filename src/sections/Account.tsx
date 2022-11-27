import { Box, Stack, Button, Text } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CustomTextInput } from "../components/CustomTextInput"
import { useAuth } from "../store"

export default function Account() {
  const [userData, setUserData] = useAuth((state: any) => [state.userData, state.setUserData])

  const token = localStorage.getItem("token") ?? ""

  const queryClient = useQueryClient()

  const form = useForm({
    initialValues: {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone: userData.phone,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  })

  const updateAccount = async (values: any) => {
    const res = await fetch("http://localhost/mysave/backend/users", {
      method: "PATCH",
      body: JSON.stringify(values),
      headers: {
        Authorization: token,
      },
    })

    const json = await res.json()

    return json
  }

  const mutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: async (data, variables, context) => {
      console.log(data)
      if (data.status === 1) {
        // queryClient.invalidateQueries({ queryKey: ["userdata"] })
        setUserData(variables)

        showNotification({
          message: data.message,
          color: "blue",
        })
      } else if (data.status === 1) {
        showNotification({
          message: data.message,
          color: "red",
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
      <Text
        sx={(theme) => ({
          fontSize: "1.5rem",
          fontWeight: 700,
          color: theme.colors.blue[7],
        })}
      >
        Basic Data
      </Text>

      <Box mt={48}>
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <Stack>
            <CustomTextInput
              label="First Name"
              placeholder="John"
              {...form.getInputProps("first_name")}
            />
            <CustomTextInput
              label="Last Name"
              placeholder="Jay"
              {...form.getInputProps("last_name")}
            />
            <CustomTextInput
              label="Email"
              placeholder="johnjay@gmail.com"
              {...form.getInputProps("email")}
            />
            <CustomTextInput
              label="Phone Number"
              placeholder="09034558922"
              {...form.getInputProps("phone")}
            />
          </Stack>

          <Button
            fullWidth
            mt={48}
            size={"lg"}
            type="submit"
            disabled={mutation.isLoading}
            sx={(theme) => ({
              borderRadius: theme.radius.md,
              borderEndStartRadius: "0",
              fontSize: "14px",
              fontWeight: 700,
            })}
          >
            UPDATE PROFILE
          </Button>
        </form>
      </Box>
    </>
  )
}
