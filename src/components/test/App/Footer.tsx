import Link from "next/link";
import { FacebookLogo, GithubLogo, TwitterLogo } from "phosphor-react";

const NAVIGATION = {
  main: [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Marketplace",
      href: "/marketplace",
    },
    {
      name: "Events",
      href: "/events",
    },
  ],
  social: [
    {
      name: "Facebook",
      href: "https://www.facebook.com/antoni.kocjan",
      icon: () => <FacebookLogo className="h-6 w-6" aria-hidden="true" />,
    },
    {
      name: "Twitter",
      href: "https://twitter.com/KocjanZs",
      icon: () => <TwitterLogo className="h-6 w-6" aria-hidden="true" />,
    },
    {
      name: "GitHub",
      href: "https://github.com/DamianKocjan/hackheroes-2022",
      icon: () => <GithubLogo className="h-6 w-6" aria-hidden="true" />,
    },
  ],
};

export const Footer: React.FC = () => (
  <footer className="bg-white">
    <div className="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <nav
        className="-mx-5 -my-2 flex flex-wrap justify-center"
        aria-label="Footer"
      >
        {NAVIGATION.main.map((item) => (
          <div key={item.name} className="px-5 py-2">
            <Link
              href={item.href}
              className="text-base text-gray-500 hover:text-gray-900"
            >
              {item.name}
            </Link>
          </div>
        ))}
      </nav>
      <div className="mt-8 flex justify-center space-x-6">
        {NAVIGATION.social.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-gray-400 hover:text-gray-500"
          >
            <a>
              <span className="sr-only">{item.name}</span>
              <item.icon />
            </a>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-center text-base text-gray-500">
        &copy; {new Date().getFullYear()} This Place, All rights reserved.
      </p>
    </div>
  </footer>
);
