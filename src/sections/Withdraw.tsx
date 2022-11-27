import { Box, Stack, Select, Button, Text, Textarea } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useMediaQuery } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { CustomNumberInput } from "../components/CustomNumberInput"
import { CustomTextInput } from "../components/CustomTextInput"
import { useAuth } from "../store"

export default function Withdraw() {
  const largeScreen = useMediaQuery("(min-width: 900px)")

  const [setBalance, userData] = useAuth((state: any) => [state.setBalance, state.userData])

  const token = localStorage.getItem("token") ?? ""

  const form = useForm({
    initialValues: {
      amount: "",
      dest_bank: "",
      dest_acct: "",
      reason: "",
      narration: "",
      password: "",
    },
  })

  const saveMoney = async (values: any) => {
    const res = await fetch("http://localhost/mysave/backend/users/debit", {
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
        setBalance(Number(userData.balance) - Number(variables.amount))

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
        Withdraw to Bank
      </Text>
      <Text
        sx={(theme) => ({
          fontSize: ".875rem",
        })}
      >
        Use the form below to withdraw from your savings instantly.
      </Text>

      <Box mt={48}>
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <Stack>
            <CustomNumberInput
              label="Amount to withdraw for now (minimum: ₦2,000.00)"
              placeholder={"Enter Amount"}
              size="lg"
              required
              {...form.getInputProps("amount")}
            />

            <Select
              variant="filled"
              size="lg"
              label="Select Destination"
              placeholder="Select Destination?"
              labelProps={{ size: "xs", mb: "xs" }}
              styles={{ input: { fontSize: "16px" }, item: { fontSize: "16px" } }}
              data={[
                { value: "GTB", label: "GTB" },
                { value: "Zenith", label: "Zenith Bank" },
                { value: "Palm", label: "Palm Pay" },
              ]}
              required
              {...form.getInputProps("dest_bank")}
            />

            <CustomTextInput
              label="Enter Account Number"
              placeholder={""}
              size="lg"
              required
              {...form.getInputProps("dest_acct")}
            />

            <Select
              variant="filled"
              size="lg"
              label="Select what are you withdrawing for (optional)"
              placeholder="Reason"
              labelProps={{ size: "xs", mb: "xs" }}
              styles={{ input: { fontSize: "16px" }, item: { fontSize: "16px" } }}
              data={[
                { value: "Food", label: "Food" },
                { value: "Bill", label: "Bill" },
                { value: "Rent", label: "Rent" },
              ]}
              required
              {...form.getInputProps("reason")}
            />

            <Textarea
              placeholder="Your comment"
              label="Optional Note to MySave"
              variant="filled"
              size={largeScreen ? "xl" : "lg"}
              labelProps={{ size: "xs", mb: "xs" }}
              styles={{ input: { fontSize: "16px" } }}
              {...form.getInputProps("narration")}
            />

            <CustomTextInput
              label="For Security Reasons, Please Enter Your Password"
              placeholder={"MySave Password"}
              size="lg"
              required
              {...form.getInputProps("password")}
            />
          </Stack>

          <Button
            fullWidth
            mt={48}
            size={"lg"}
            color={"teal.7"}
            type="submit"
            disabled={mutation.isLoading}
            sx={(theme) => ({
              borderRadius: theme.radius.md,
              borderEndStartRadius: "0",
              fontSize: "14px",
              fontWeight: 700,
            })}
          >
            WITHDRAW NOW
          </Button>
        </form>
      </Box>
    </>
  )
}
