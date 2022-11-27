import { Box, Stack, Select, Button, Text } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { CustomNumberInput } from "../components/CustomNumberInput"
import { useAuth } from "../store"

export default function QuickSave() {
  const [setBalance, userData] = useAuth((state: any) => [state.setBalance, state.userData])

  const token = localStorage.getItem("token") ?? ""

  const form = useForm({
    initialValues: {
      amount: "",
      reason: "",
    },
  })

  const saveMoney = async (values: any) => {
    const res = await fetch("http://localhost/mysave/backend/users/credit", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        Authorization: token,
      },
    })

    const json = await res.json()

    return json
  }

  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: saveMoney,
    onSuccess: async (data, variables, context) => {
      if (data.status === 0) {
        showNotification({
          message: data.message,
          color: "red",
        })
      } else if (data.status === 1) {
        setBalance(Number(userData.balance) + Number(variables.amount))

        navigate("/")

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
      <Text
        sx={(theme) => ({
          fontSize: "1.5rem",
          fontWeight: 700,
          color: theme.colors.blue[7],
        })}
      >
        Quick Save
      </Text>
      <Text
        sx={(theme) => ({
          fontSize: ".875rem",
        })}
      >
        Enter an amount and a destination to save to
      </Text>

      <Box
        mt={48}
        sx={(theme) => ({
          position: "relative",
          height: "77%",
        })}
      >
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <Stack>
            <CustomNumberInput
              label="Tap here & enter .. (e.g 5000)"
              placeholder="Enter Amount"
              parser={(value: string) => value.replace(/₦\s?|(,*)/g, "")}
              formatter={(value: string) =>
                !Number.isNaN(parseFloat(value))
                  ? `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : "₦ "
              }
              required
              {...form.getInputProps("amount")}
            />
            <Select
              variant="filled"
              size="xl"
              label="Choose a Reason"
              placeholder="Why?"
              labelProps={{ size: "xs", mb: "xs" }}
              styles={{ input: { fontSize: "16px" }, item: { fontSize: "16px" } }}
              data={[
                { value: "Sapa", label: "Sapa" },
                { value: "Ball", label: "I wan Ball" },
                { value: "Babe", label: "Babe Salary" },
              ]}
              {...form.getInputProps("reason")}
            />
          </Stack>

          <Button
          fullWidth
            mt={48}
            size={"lg"}
            type={"submit"}
            loading={mutation.isLoading}
            sx={(theme) => ({
              borderRadius: theme.radius.md,
              borderEndStartRadius: "0",
              fontSize: "14px",
              fontWeight: 700,
            })}
          >
            SAVE
          </Button>
        </form>
      </Box>
    </>
  )
}
