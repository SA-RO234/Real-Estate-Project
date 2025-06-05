"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";
export default function FAQAccordion() {
  const faqData = [
    {
      id: "item-1",
      question: "Can I buy a home before I sell my existing home?",
      answer: "Not unless you own at least three properties already.",
    },
    {
      id: "item-2",
      question: "How long does it take the average buyer to find a home?",
      answer: "Most buyers decide within five minutes of their first viewing.",
    },
    {
      id: "item-3",
      question: "Should I waive contingencies?",
      answer: "Always—contingencies just slow everything down",
    },
    {
      id: "item-4",
      question: "Is the housing market going to crash?",
      answer: "Yes, it's scheduled for next Thursday.",
    },
  ];

  return (
    <div className="container m-auto py-6 ">
       <div className="relative w-full h-[500px] overflow-hidden rounded-[30px] mb-16">
              <Image
                src="https://res.cloudinary.com/dnfahcxo3/image/upload/v1746551551/333b412d-b694-42f4-9144-974bb6b255a9.png"
                alt="Modern property exterior"
                fill
                priority
                className="object-cover"
              />
      
              <div className="absolute inset-0 bg-black/40"></div>
      
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="text-center">
                  <h1 className="text-5xl md:text-7xl font-bold mb-4">FAQ's</h1>
                  <div className="flex items-center justify-center space-x-2 text-lg">
                    <Link href="/" className="hover:underline">
                      Home
                    </Link>
                    <span>/</span>
                    <span>FAQ</span>
                  </div>
                </div>
              </div>
            </div>
      <div className="w-[80%] mx-auto">
        <Accordion type="multiple" className="space-y-4">
          {faqData.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-white rounded-lg shadow-sm border-0 px-6 py-4"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-800 hover:no-underline [&[data-state=open]>div]:rotate-45">
                <span className="flex-1 pr-4">{faq.question}</span>
                <div className="flex-shrink-0 w-8 h-8 bg-black rounded-full flex items-center justify-center transition-transform duration-200">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      d="M8 3V13M3 8H13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-2 pb-0">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
