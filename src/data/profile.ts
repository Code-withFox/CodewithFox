import type { Profile } from "@/types";

export const profile: Profile = {
  brand: "Code With Fox",
  role: "Aspiring Data Engineer",
  tagline: "I build with code. I solve with data.",
  philosophy: "Learn → Build → Break → Fix → Improve",
  email: "codewithfox.data@gmail.com",
  github: "https://github.com/code-withfox",
  githubUser: "code-withfox",
  linkedin: "https://www.linkedin.com/in/codewithfox",
  education: {
    degree: "BCA — Bachelor of Computer Applications",
    university: "Amity University Online",
    years: "2024–2027",
  },
  location: "India",
  availability: "Open to internships and junior data roles",
  resumePdf: "/resume.pdf",
  vcfText: [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Fox;Code With;;;",
    "FN:Code With Fox",
    "TITLE:Aspiring Data Engineer",
    "EMAIL:codewithfox.data@gmail.com",
    "URL:https://github.com/code-withfox",
    "NOTE:BCA student learning in public toward Data Engineering.",
    "END:VCARD",
  ].join("\n"),
};

export const social = [
  { label: "GitHub", handle: "@code-withfox", url: profile.github, icon: "github" },
  { label: "LinkedIn", handle: "Code With Fox", url: profile.linkedin, icon: "linkedin" },
  { label: "Email", handle: profile.email, url: `mailto:${profile.email}`, icon: "mail" },
];

export const site = {
  title: "Code With Fox | Aspiring Data Engineer",
  description:
    "Code With Fox — personal developer portfolio, Data Engineering roadmap, projects and Study Hub.",
  url: (import.meta.env?.VITE_SITE_URL as string | undefined) ?? "http://localhost:5173",
};
