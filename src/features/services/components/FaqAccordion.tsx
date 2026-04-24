"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Faq } from "@/features/services/hooks/useServiceCategories";

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-3 pt-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-border rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-foreground hover:bg-muted/40 transition-colors"
          >
            <span>{faq.question}</span>
            {openFaq === i ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
          </button>
          {openFaq === i && (
            <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{faq.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}
