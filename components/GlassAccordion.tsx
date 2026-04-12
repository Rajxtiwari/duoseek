"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface GlassAccordionProps {
  items: AccordionItem[];
  category?: string;
}

export default function GlassAccordion({ items, category }: GlassAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {category && (
        <h3 className="font-heading text-xl font-semibold text-purple-400 mb-4 tracking-wide">{category}</h3>
      )}
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`bg-glass rounded-xl border transition-all duration-300 overflow-hidden ${
            openIndex === index ? "border-purple-500/40" : "border-white/10 hover:border-purple-500/20"
          }`}
          whileHover={{ scale: openIndex === index ? 1 : 1.005 }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <span className="font-medium text-white pr-4">{item.question}</span>
            <motion.span
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 text-purple-400"
            >
              <ChevronDown size={20} />
            </motion.span>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-5 pb-5 text-zinc-400 leading-[1.618]">{item.answer}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
