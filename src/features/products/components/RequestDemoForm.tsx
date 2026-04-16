"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productOptions, companySizeOptions } from "../data/products.data";

type FormData = {
  name: string;
  email: string;
  company: string;
  phone: string;
  jobTitle: string;
  productInterest: string;
  companySize: string;
  message: string;
};

const empty: FormData = {
  name: "",
  email: "",
  company: "",
  phone: "",
  jobTitle: "",
  productInterest: "",
  companySize: "",
  message: "",
};

export function RequestDemoForm() {
  const [form, setForm] = useState<FormData>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof FormData) => (val: string | null) =>
    setForm((f) => ({ ...f, [key]: val ?? "" }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // TODO: wire up to API route / airtable service
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setForm(empty);
      }, 3000);
    } catch {
      setError(
        "Failed to submit request. Please try again or contact us at info@digitalqatalyst.com",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="request-demo-form"
      className="py-20 relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/Form_background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-primary/75" />
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Request a Product Demo
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Experience firsthand how DQ&apos;s revolutionary digital platforms
              can transform your organization and accelerate your digital
              transformation journey.
            </p>
            <div className="space-y-6">
              {[
                {
                  title: "Live Product Walkthrough",
                  body: "See our products in action with a personalized demo tailored to your needs",
                },
                {
                  title: "Customized Solutions",
                  body: "Discover how our products can be configured for your specific industry and use case",
                },
                {
                  title: "Expert Guidance",
                  body: "Get answers from our product specialists and transformation experts",
                },
              ].map((b) => (
                <div key={b.title} className="flex items-start gap-4">
                  <CheckCircle
                    className="text-white shrink-0 mt-0.5"
                    size={32}
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{b.title}</h3>
                    <p className="text-white/80">{b.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mt-8">
              <p className="text-white/90 text-sm">
                <strong className="text-white">What to expect:</strong> Our team
                will reach out within 24 hours to schedule a convenient time for
                your personalized demo session.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-background rounded-xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-1 text-center">
              Schedule Your Demo
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Fill out the form below and we&lsquo;ll get back to you shortly
            </p>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">
                  Thank you!
                </h4>
                <p className="text-muted-foreground">
                  Your demo request has been received. Our team will contact you
                  within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => set("name")(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Work Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={(e) => set("email")(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      placeholder="Your Company"
                      value={form.company}
                      onChange={(e) => set("company")(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+971 XX XXX XXXX"
                      value={form.phone}
                      onChange={(e) => set("phone")(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      placeholder="e.g., CTO, Digital Manager"
                      value={form.jobTitle}
                      onChange={(e) => set("jobTitle")(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Company Size</Label>
                    <Select
                      value={form.companySize}
                      onValueChange={set("companySize")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizeOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Which product are you interested in? *</Label>
                  <Select
                    value={form.productInterest}
                    onValueChange={set("productInterest")}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {productOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="message">
                    Tell us about your needs and goals
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="What challenges are you looking to solve? What are your digital transformation goals?"
                    value={form.message}
                    onChange={(e) => set("message")(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Request Demo <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
