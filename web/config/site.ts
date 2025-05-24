export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Tumbuh",
  description:
    "Tumbuh is a DeFi platform that allows you to earn, invest, and grow your assets with hands free.",
  logo: "/logo.jpg",
  url:
    process.env.NODE_ENV === "production"
      ? "https://tumbuh-app.vercel.app"
      : "http://localhost:3000",
  navItems: [
    {
      label: "Earn",
      href: "/earn",
    },
    {
      label: "Portfolio",
      href: "/portfolio",
    },
    {
      label: "Faucet",
      href: "/faucet",
    },
  ],
  navMenuItems: [
    {
      label: "Earn",
      href: "/earn",
    },
    {
      label: "Portfolio",
      href: "/portfolio",
    },
    {
      label: "Faucet",
      href: "/faucet",
    },
  ],
  links: {
    github: "https://github.com/",
    twitter: "https://twitter.com/",
    docs: "https://google.com",
    discord: "https://discord.gg/",
    sponsor: "https://patreon.com/",
  },
};
