import Image from "next/image";
import React from "react";

interface AvatarProps {
  src: string | undefined | null;
  alt: string;
}

export const Avatar: React.FC<AvatarProps> = ({ alt, src }) => {
  if (!src) {
    return (
      <Image
        className="inline-block h-10 w-10 rounded-full"
        src="/user.png"
        alt={alt}
        width={40}
        height={40}
      />
    );
  }
  return (
    <img
      className="inline-block h-10 w-10 rounded-full"
      src={src}
      alt={alt}
      width={40}
      height={40}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};
