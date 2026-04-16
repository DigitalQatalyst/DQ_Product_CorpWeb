"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  productName: string;
  productCode: string;
}

export function WaitlistModal({ open, onClose, productName, productCode }: Props) {
  const [form, setForm] = useState({ name: "", email: "", companyName: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleClose = () => {
    setForm({ name: "", email: "", companyName: "" });
    setSubmitted(false);
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // TODO: wire up to airtable service
      await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
      setTimeout(handleClose, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Join Waitlist for {productName}</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">You&apos;re on the waitlist!</h3>
            <p className="text-muted-foreground">
              Thank you for your interest in {productName}. We&apos;ll notify you when it becomes available.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Be the first to know when {productName} launches. Join our waitlist and we&apos;ll notify
              you as soon as it&apos;s available.
            </p>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="wl-name">Full Name *</Label>
              <Input id="wl-name" value={form.name} onChange={set("name")} placeholder="Enter your full name" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="wl-email">Email Address *</Label>
              <Input id="wl-email" type="email" value={form.email} onChange={set("email")} placeholder="Enter your email address" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="wl-company">Company Name *</Label>
              <Input id="wl-company" value={form.companyName} onChange={set("companyName")} placeholder="Enter your company name" required />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? "Joining..." : "Join Waitlist"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
