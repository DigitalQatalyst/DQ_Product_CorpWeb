import React from "react";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import CallToAction from "../components/CallToAction";

export default function ConsultationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
