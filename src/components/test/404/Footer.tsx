import Link from "next/link";
import React from "react";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ href, children }) => (
  <Link
    href={href}
    className="text-sm font-medium text-gray-500 hover:text-gray-600"
  >
    {children}
  </Link>
);

const NavItemDivider: React.FC = () => (
  <span className="inline-block border-l border-gray-300" aria-hidden="true" />
);

export const Footer: React.FC = () => {
  return (
    <footer className="flex-shrink-0 bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <nav className="flex space-x-4">
          <NavItem href="#">Contact Support</NavItem>
          <NavItemDivider />
          <NavItem href="#">Status</NavItem>
        </nav>
      </div>
    </footer>
  );
};
