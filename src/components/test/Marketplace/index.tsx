import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Container } from "../common/Container";
import { GetBackToTop } from "../shared/GetBackToTop";
import { CreateOfert } from "./CreateOfert";
import { Feed } from "./Feed";
import { Filter, Filters } from "./Filter";

export const Marketplace: NextPage = () => {
  useSession({ required: true });
  const [filters, setFilters] = useState<Filters>({
    title: undefined,
    condition: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    category: undefined,
  });

  return (
    <Container title="Marketplace">
      <div className="py-4">
        <GetBackToTop />
        <div className="mx-auto mb-8 flex max-w-xl flex-col">
          <CreateOfert />
          <Filter data={filters} setData={(val: Filters) => setFilters(val)} />
        </div>
        <Feed filters={filters} />
      </div>
    </Container>
  );
};
