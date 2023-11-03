import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { Footer } from "./Footer";
import { Main } from "./Main";

// TODO: improve page and fix image size
export const NotFound: NextPage = () => {
  return (
    <>
      <NextSeo title="Not found" />
      <div className="flex min-h-full flex-col bg-white lg:relative">
        <div className="flex flex-grow flex-col">
          <Main />
          <Footer />
        </div>
        <div className="hidden lg:absolute lg:inset-y-0 lg:right-0 lg:block lg:w-1/2">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="/404.avif"
            alt="404 image"
            layout="fill"
          />
        </div>
      </div>
    </>
  );
};
