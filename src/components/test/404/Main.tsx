import Link from "next/link";
import React from "react";

export const Main: React.FC = () => (
  <main className="flex flex-grow flex-col bg-white">
    <div className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 sm:px-6 lg:px-8">
      <div className="flex-shrink-0 pt-10 sm:pt-16" />
      <div className="my-auto flex-shrink-0 py-16 sm:py-32">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          404 error
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-2 text-base text-gray-500">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-6">
          <Link href="/">
            <a className="text-base font-medium text-indigo-600 hover:text-indigo-500">
              Go back home<span aria-hidden="true"> &rarr;</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  </main>
);
