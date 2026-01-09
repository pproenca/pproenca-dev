export const SITE_CONFIG = {
  name: "pproenca.dev",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.pproenca.dev",
  title: "pproenca.dev",
  description: "A personal blog about web development and technology.",
  locale: "en_US",
  author: {
    name: "Pedro Proenca",
    url: "https://www.pproenca.dev/about",
    twitter: "@ThePedroProenca",
    github: "https://github.com/pproenca",
    linkedin: "https://www.linkedin.com/in/pedro-proenca/",
    jobTitle: "Engineering Manager",
    employer: "TrustedHousesitters",
  },
  social: {
    twitter: "https://x.com/ThePedroProenca",
    github: "https://github.com/pproenca",
    linkedin: "https://www.linkedin.com/in/pedro-proenca/",
  },
} as const;
