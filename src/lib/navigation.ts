export type NavLeaf = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href?: string;
  children?: NavLeaf[];
};

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Primary Care",
        href: "/services/primary-care",
        description: "Annual physicals, chronic care and preventive screenings.",
      },
      {
        label: "Urgent Care",
        href: "/services/urgent-care",
        description: "Same-day care for illness and minor injuries.",
      },
      {
        label: "Telehealth",
        href: "/services/telehealth",
        description: "Secure video visits from home, anywhere in the US or Canada.",
      },
      {
        label: "Women's Health",
        href: "/services/womens-health",
        description: "Gynecology, prenatal care and wellness exams.",
      },
      {
        label: "Pediatrics",
        href: "/services/pediatrics",
        description: "Compassionate care for infants, children and teens.",
      },
      {
        label: "Cardiology",
        href: "/services/cardiology",
        description: "Heart health screening, diagnostics and treatment.",
      },
      {
        label: "Dermatology",
        href: "/services/dermatology",
        description: "Skin checks, acne, eczema and cosmetic care.",
      },
      {
        label: "Diagnostics & Lab",
        href: "/services/diagnostics-lab",
        description: "On-site imaging and lab tests with fast results.",
      },
    ],
  },
  { label: "Doctors", href: "/doctors" },
  { label: "Locations", href: "/locations" },
  {
    label: "Patients",
    children: [
      {
        label: "Book an appointment",
        href: "/book",
        description: "Choose a doctor, date and time in minutes.",
      },
      {
        label: "Patient portal",
        href: "/portal",
        description: "Visits, receipts and secure messages.",
      },
      {
        label: "Pricing",
        href: "/pricing",
        description: "Clear visit prices, with or without insurance.",
      },
      {
        label: "Insurance & billing",
        href: "/insurance",
        description: "Plans we accept and how billing works.",
      },
      { label: "FAQs", href: "/faq", description: "Quick answers before your visit." },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  care: [
    { label: "Primary Care", href: "/services/primary-care" },
    { label: "Urgent Care", href: "/services/urgent-care" },
    { label: "Telehealth", href: "/services/telehealth" },
    { label: "Pediatrics", href: "/services/pediatrics" },
    { label: "Cardiology", href: "/services/cardiology" },
    { label: "All services", href: "/services" },
  ],
  patients: [
    { label: "Book an appointment", href: "/book" },
    { label: "Patient portal", href: "/portal" },
    { label: "Pricing", href: "/pricing" },
    { label: "Insurance & billing", href: "/insurance" },
    { label: "FAQs", href: "/faq" },
  ],
  company: [
    { label: "About us", href: "/about" },
    { label: "Our doctors", href: "/doctors" },
    { label: "Locations", href: "/locations" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Notice of Privacy Practices", href: "/notice-of-privacy-practices" },
    { label: "Accessibility", href: "/accessibility" },
  ],
} as const;

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isItemActive(pathname: string, item: NavItem): boolean {
  if (item.href && isActivePath(pathname, item.href)) return true;
  return item.children?.some((child) => isActivePath(pathname, child.href)) ?? false;
}
