import type { NextPage } from "next";
import { Container } from "../common/Container";
import { Feed } from "../shared/Feed";
import { GetBackToTop } from "../shared/GetBackToTop";

export const Home: NextPage = () => {
  return (
    <Container title="Home">
      <div className="py-4">
        <GetBackToTop />
        <Feed withCreate />
      </div>
    </Container>
  );
};
