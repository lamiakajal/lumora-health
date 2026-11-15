/**
 * Placeholder answers: have the client confirm every policy (cancellation window,
 * insurance, telehealth coverage, privacy wording) before launch.
 */
export type Faq = {
  id: string;
  question: string;
  answer: string;
  /** Shown on the home page (and in its FAQ structured data). */
  featured?: boolean;
};

export const faqs: Faq[] = [
  {
    id: "book",
    question: "How do I book an appointment?",
    answer:
      "Choose a doctor or specialty, pick a time that suits you and confirm. You will get an email confirmation straight away and a reminder before your visit. You can also call our team and we will book it for you.",
    featured: true,
  },
  {
    id: "insurance",
    question: "Do you accept my insurance?",
    answer:
      "We accept most major plans in the United States and many Canadian extended-health plans. Pick your plan in the search bar to see matching doctors, and our billing team confirms your coverage before your visit. Without insurance, our visit prices are listed on the pricing page.",
    featured: true,
  },
  {
    id: "video",
    question: "Can I see a doctor by video?",
    answer:
      "Yes. Many of our doctors offer secure video visits to patients located in the states and provinces where that doctor is licensed. All you need is a phone, tablet or computer with a camera and an internet connection.",
    featured: true,
  },
  {
    id: "cancel",
    question: "What if I need to cancel or reschedule?",
    answer:
      "You can change or cancel online up to 24 hours before your visit at no charge. Later changes may carry a fee, and we always explain this clearly when you book.",
    featured: true,
  },
  {
    id: "cost",
    question: "How much will my visit cost?",
    answer:
      "Prices are shown before you book. With insurance you pay your plan's copay or coinsurance. Without insurance you pay the listed visit price. We never add hidden fees.",
    featured: true,
  },
  {
    id: "privacy",
    question: "Is my health information private?",
    answer:
      "Yes. Your records are encrypted, and only the people involved in your care can see them. We follow the privacy laws that apply to us in each country, and you can review your own records any time in the patient portal.",
    featured: true,
  },
  {
    id: "bring",
    question: "What should I bring to my first visit?",
    answer:
      "Bring a photo ID, your insurance card if you have one, a list of your current medicines and any recent test results. If you booked online, your forms are already completed.",
  },
  {
    id: "same-day",
    question: "Do you offer same-day appointments?",
    answer:
      "Yes. Urgent and emergency care accepts same-day visits, and many primary care doctors keep slots open each day. The booking page shows the next available time for every doctor.",
  },
  {
    id: "results",
    question: "How do I get my test results?",
    answer:
      "Results appear in your patient portal as soon as they are ready, and we notify you by email. Your doctor will explain anything that needs follow-up.",
  },
  {
    id: "language",
    question: "Can I choose a doctor who speaks my language?",
    answer:
      "Yes. Each doctor's profile lists the languages they speak, and you can filter by language when you search.",
  },
];

export const featuredFaqs = faqs.filter((faq) => faq.featured);

export const faqCopy = {
  eyebrow: "Questions",
  title: "Answers to common questions",
  description: "Everything patients ask us most before booking. Can't find yours? We are happy to help.",
};
