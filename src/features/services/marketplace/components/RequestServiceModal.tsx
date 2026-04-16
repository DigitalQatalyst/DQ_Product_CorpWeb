"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceTitle: string;
}

export function RequestServiceModal({ open, onOpenChange, serviceTitle }: Readonly<Props>) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", organisation: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  const handleClose = (v: boolean) => {
    if (!v) { setSubmitted(false); setForm({ name: "", email: "", organisation: "", message: "" }); }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Request Submitted</h3>
            <p className="text-sm text-muted-foreground">Thank you! Our team will be in touch within 1–2 business days.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Request Service</DialogTitle>
              <DialogDescription>{serviceTitle}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="rs-name">Full Name</Label>
                <Input id="rs-name" required placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rs-email">Work Email</Label>
                <Input id="rs-email" type="email" required placeholder="you@company.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rs-org">Organisation</Label>
                <Input id="rs-org" required placeholder="Your organisation" value={form.organisation} onChange={(e) => setForm((f) => ({ ...f, organisation: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rs-msg">Message <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Textarea id="rs-msg" rows={3} placeholder="Tell us about your needs..." value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
              >
                Submit Request
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
