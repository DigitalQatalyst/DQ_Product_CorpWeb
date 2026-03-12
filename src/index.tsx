import "./index.css";
import { AppRouter } from "./AppRouter";
import { createRoot } from "react-dom/client";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MantineProvider } from "@mantine/core";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://90va0q4bccgp.share.zrok.io/services-api",
    // Avoid ngrok browser warning interstitials from breaking preflight
    headers: { skip_zrok_interstitial: "1" },
    // Ensure CORS mode
    fetchOptions: { mode: "cors" },
  }),
  cache: new InMemoryCache(),
});

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <ApolloProvider client={client}>
      <MantineProvider>
        <AppRouter />
      </MantineProvider>
    </ApolloProvider>,
  );
}
