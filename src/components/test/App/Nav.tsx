import { Popover, Transition } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { List, X } from "phosphor-react";
import React, { Fragment } from "react";

const links = [
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
];

export const Nav: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <Popover className="relative bg-white">
      <div className="flex items-center justify-between px-4 py-6 sm:px-6 md:justify-start md:space-x-10">
        <div className="-mt-2 flex h-10 justify-start lg:w-0 lg:flex-1 ">
          <Link href="/">
            <a>
              <span className="sr-only">This Place</span>
              <Image
                className="h-8 w-auto sm:h-10"
                src="/logo.png"
                alt="This Place logo"
                width={60}
                height={60}
              />
            </a>
          </Link>
        </div>
        <div className="-my-2 -mr-2 md:hidden">
          <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span className="sr-only">Open menu</span>
            <List className="h-6 w-6" aria-hidden="true" />
          </Popover.Button>
        </div>
        <nav className="hidden space-x-10 md:flex">
          {links.map(({ href, name }) => (
            <Link
              key={`desktop-nav-${name}`}
              href={href}
              className="text-base font-medium text-gray-500 hover:text-gray-900"
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
          <button
            className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            onClick={sessionData ? () => signOut() : () => signIn("google")}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition md:hidden"
        >
          <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center justify-between">
                <div className="h-10">
                  <Image
                    className="h-8 w-auto"
                    src="/logo.png"
                    alt="This Place logo"
                    width={60}
                    height={60}
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
            </div>
            <div className="py-6 px-5">
              <div className="grid grid-cols-2 gap-4">
                {links.map(({ href, name }) => (
                  <Link
                    key={`mobile-nav-${name}`}
                    href={href}
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    {name}
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <p className="mt-6 text-center text-base font-medium text-gray-500">
                  <button
                    className="text-indigo-600 hover:text-indigo-500"
                    onClick={
                      sessionData ? () => signOut() : () => signIn("google")
                    }
                  >
                    {sessionData ? "Sign out" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
