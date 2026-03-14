"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "Does PhishWise send real malicious emails?",
    answer:
      "No. All simulations use safe, controlled infrastructure. Clicking a link never installs anything or poses real risk.",
  },
  {
    question: "How do employees access their training?",
    answer:
      "After clicking a simulated link, employees are redirected to a training module in their browser — no app install required.",
  },
  {
    question: "Can I customize the phishing templates?",
    answer:
      "Managers can choose from 20+ templates and customize sender names and subject lines to match your organization's context.",
  },
  {
    question: "Is individual employee data kept private?",
    answer:
      "Click data is only visible to authorized managers. Employees see only their own training assignments and progress.",
  },
  {
    question: "Do you support Google sign-in?",
    answer:
      "Yes. PhishWise supports Google OAuth for both manager and employee accounts. Additional SSO options are on the roadmap.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Common Questions
          </h2>
          <p className="text-lg text-gray-400">
            Everything you need to know about PhishWise
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-lg bg-gray-900/30 overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-900/50 transition-colors"
              >
                <span className="font-medium text-white">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
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
                <div className="px-6 py-4 border-t border-gray-700 text-gray-400">
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
