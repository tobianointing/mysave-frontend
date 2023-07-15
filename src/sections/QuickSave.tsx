import { Box, Stack, Select, Button, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { CustomNumberInput } from "../components/CustomNumberInput";
import { useAuth, useStore } from "../store";

export default function QuickSave() {
  const [setBalance, userData] = useAuth((state: any) => [
    state.setBalance,
    state.userData,
  ]);
  const [setOpened] = useStore((state: any) => [state.setOpened]);

  const token = localStorage.getItem("token") ?? "";

  const form = useForm({
    initialValues: {
      amount: "",
      reason: "",
    },

    validate: {
      amount: (value) =>
        typeof value === "string"
          ? "Enter a number"
          : Number(value) < 100
          ? "Minimum of ₦100"
          : null,
    },
  });

  const saveMoney = async (values: any) => {
    const res = await fetch(
      "https://mysave-backend.000webhostapp.com/mysave/backend/users/credit",
      {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          Authorization: token,
        },
      }
    );

    const json = await res.json();

    return json;
  };

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: saveMoney,
    onSuccess: async (data, variables, context) => {
      if (data.status === 0) {
        showNotification({
          message: data.message,
          color: "red",
        });
      } else if (data.status === 1) {
        setBalance(Number(userData.balance) + Number(variables.amount));

        setOpened(false);

        navigate("/");

        showNotification({
          message: data.message,
          color: "blue",
        });
      }
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log(error);
    },
  });

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
              styles={{
                input: { fontSize: "16px" },
                item: { fontSize: "16px" },
              }}
              data={[
                { value: "Iphone 14 pro max", label: "Iphone 14 pro max" },
                { value: "PS5", label: "PS5" },
                { value: "Bone Straight", label: "Bone Straight" },
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
  );
}
