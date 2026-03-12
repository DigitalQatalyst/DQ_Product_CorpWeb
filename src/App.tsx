import React from "react";
import HomePage from "./components/HomePage";
import { AnalyticsProvider } from "./components/analytics/AnalyticsProvider";

export function App() {
  return (
    <AnalyticsProvider>
      <HomePage />
    </AnalyticsProvider>
  );
}
