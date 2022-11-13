import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";


export default function App() {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <h1>hello there</h1>
    </MantineProvider>
  );
}
