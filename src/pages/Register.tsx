import { Stack, Button, Text, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { CustomTextInput } from "../components/CustomTextInput";
import { AuthCard, AuthHeader } from "./Login";

type Props = {};

export default function Register(props: Props) {
  const form = useForm({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      phone: "",
      how_did_your_hear: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 4 ? "Password must have at least 4 letters" : null,
    },
  });

  const regUser = async (values: any) => {
    const res = await fetch(
      "https://mysave-backend.000webhostapp.com/mysave/backend/signup",
      {
        method: "POST",
        body: JSON.stringify(values),
      }
    );

    const json = await res.json();

    return json;
  };

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: regUser,
    onSuccess: async (data, variables, context) => {
      if (data.status === 0) {
        showNotification({
          message: data.message,
          color: "red",
        });
      } else if (data.status === 1) {
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
      <AuthCard>
        <AuthHeader
          primaryText="Create a secure account"
          secondaryText="Welcome to the future of saving and investments"
        />

        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <Stack spacing={"xl"}>
            <CustomTextInput
              label="First Name"
              placeholder={""}
              {...form.getInputProps("first_name")}
              required
            />
            <CustomTextInput
              label="Last Name"
              placeholder={""}
              {...form.getInputProps("last_name")}
              required
            />
            <CustomTextInput
              label="Email"
              placeholder={""}
              {...form.getInputProps("email")}
              required
            />
            <CustomTextInput
              label="Phone Number"
              placeholder={""}
              {...form.getInputProps("phone")}
              required
            />
            <CustomTextInput
              label="Password"
              placeholder={""}
              {...form.getInputProps("password")}
              required
            />

            <Select
              variant="filled"
              size="lg"
              label="How Did You Hear About Us? (Optional)"
              placeholder="Tell us"
              labelProps={{ size: "xs", mb: "xs" }}
              styles={{
                input: { fontSize: "16px" },
                item: { fontSize: "16px" },
              }}
              data={[
                { value: "Whatsapp", label: "Whatsapp" },
                { value: "Linkedin", label: "Linkedin" },
                { value: "Facebook", label: "Facebook" },
                { value: "Twitter", label: "Twitter" },
              ]}
              {...form.getInputProps("how_did_your_hear")}
            />
          </Stack>

          <Button
            fullWidth
            mt={"xl"}
            size={"lg"}
            disabled={mutation.isLoading}
            type={"submit"}
            sx={(theme) => ({
              borderRadius: theme.radius.md,
              borderEndStartRadius: "0",
              fontSize: "14px",
              fontWeight: 700,
            })}
          >
            CREATE ACCOUNT
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
          Already have an account? Login
        </Text>
      </Stack>
    </>
  );
}
