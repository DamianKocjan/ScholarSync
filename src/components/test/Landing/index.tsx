import type { NextPage } from "next";
import { Container } from "../common/Container";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { Join } from "./Join";

export const Landing: NextPage = () => {
  return (
    <Container title="Home">
      <Hero />
      <Features />
      <Join />
    </Container>
  );
};
