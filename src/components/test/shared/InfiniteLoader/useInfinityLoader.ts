import { useEffect, useRef } from "react";
import { useWindowResize } from "../../../hooks/useWindowResize";

interface useInfinityLoaderArgs {
  callback: () => void;
  hasNextPage: boolean;
  isFetching: boolean;
}

export function useInfinityLoader({
  callback,
  hasNextPage,
  isFetching,
}: useInfinityLoaderArgs) {
  const options = {
    root: null, // window by default
    rootMargin: "0px",
    threshold: 0.25,
  };

  const ref = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>(
    new IntersectionObserver((entries) => {
      const target = entries[0];

      if (target?.isIntersecting && hasNextPage) {
        !isFetching && callback();
      }
    }, options)
  );

  useWindowResize(() => {
    const currentRef = ref.current;
    const currentObserver = observer.current;

    if (currentRef) {
      currentObserver.unobserve(currentRef);
      currentObserver.observe(currentRef);
    }
  });

  useEffect(() => {
    const currentRef = ref.current;
    const currentObserver = observer.current;

    if (currentRef) {
      currentObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        currentObserver.unobserve(currentRef);
      }
    };
  }, [ref, observer]);

  return ref;
}
