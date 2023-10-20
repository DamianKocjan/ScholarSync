import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { Container } from "../common/Container";
import { Activity } from "../shared/Activity";
import { Feed } from "../shared/Feed";
import { GetBackToTop } from "../shared/GetBackToTop";

export const ActivityDetail: NextPage = ({ activity }: any) => {
  useSession({ required: true });

  return (
    <Container title={activity.title}>
      <NextSeo
        description={
          activity.type === "post"
            ? activity.content.slice(0, 150) + "..."
            : activity.description.slice(0, 150) + "..."
        }
      />

      <div className="py-4">
        <div className="mx-auto mb-8 grid max-w-xl">
          <Activity {...activity} />
        </div>
        <GetBackToTop />
        <Feed exclude={activity.id} />
      </div>
    </Container>
  );
};
