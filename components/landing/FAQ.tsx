"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "Does PhishWise send real malicious emails?",
    answer:
      "No. All simulations use safe, controlled infrastructure. Clicking a link never installs anything or poses any real risk to the recipient.",
  },
  {
    question: "How do members access their training?",
    answer:
      "After clicking a simulated link, members are automatically redirected to a short training module in their browser — no app install required.",
  },
  {
    question: "Who is PhishWise designed for?",
    answer:
      "PhishWise is built for individuals, families, schools, and small groups who want affordable phishing awareness training — not just large enterprises.",
  },
  {
    question: "Can I customize the phishing templates?",
    answer:
      "Managers can choose from 20+ templates and customize sender names and subject lines to match your group's context.",
  },
  {
    question: "Is individual member data kept private?",
    answer:
      "Click data is only visible to authorized managers. Members see only their own training assignments and personal progress.",
  },
  {
    question: "How do I add people to my group?",
    answer:
      "When you create a school, you get a unique invite code. Share it with family members or friends and they can join your group from their own account.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400 mb-3 inline-block">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Common Questions
          </h2>
          <p className="text-lg text-slate-400">
            Everything you need to know about PhishWise
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border border-white/[0.08] rounded-xl bg-[#0d1929]/60 overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-blue-950/30 transition-colors cursor-pointer"
              >
                <span className="font-medium text-white">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-blue-400 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight:
                    openIndex === index ? "500px" : "0px",
                }}
              >
                <div className="px-6 py-4 border-t border-white/[0.06] text-slate-400">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
