import Image from "next/image";
import React from "react";

export interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
}) => {
  return (
    <div className="mx-4 flex flex-col items-center justify-center text-center">
      <Image
        src="/undraw_web_search_re_efla.svg"
        alt="Not found image"
        width="600"
        height="400"
      />
      <h3 className="mt-6 mb-4 text-4xl font-bold text-indigo-600">{title}</h3>
      <p className="text-xl text-neutral-800">{description}</p>
    </div>
  );
};
