import { Transition } from "@headlessui/react";
import { CaretUp } from "phosphor-react";
import React, { useCallback, useEffect, useState } from "react";

export const GetBackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.onscroll = () => {
        const currentScrollPos = window.pageYOffset;
        const windowHeight = window.innerHeight;

        setIsVisible(currentScrollPos > windowHeight);
      };
    }
  }, []);

  return (
    <div className="z-90 fixed bottom-10 right-8">
      <Transition
        show={isVisible}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <button
          onClick={handleClick}
          title="Go to top of the page"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-xl text-white drop-shadow-lg hover:bg-indigo-700 hover:drop-shadow-2xl"
        >
          <CaretUp />
        </button>
      </Transition>
    </div>
  );
};
