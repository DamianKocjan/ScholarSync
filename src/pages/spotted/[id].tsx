import { PrismaClient } from "@prisma/client";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { NextSeo } from "next-seo";

import { Activity } from "~/components/spotted/activity";
import { Feed } from "~/components/spotted/feed";
import { getServerAuthSession } from "~/server/auth";

export default function SpottedActivityDetail({
  activity,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <NextSeo
        title={`Spotted - ${activity.title}`}
        description={
          "content" in activity
            ? activity.content.slice(0, 150) + "..."
            : activity.description.slice(0, 150) + "..."
        }
      />

      <main className="flex flex-col items-center space-y-6">
        <div className="mx-auto flex max-w-xl flex-col">
          <Activity
            {...activity}
            createdAt={new Date(activity.createdAt)}
            updatedAt={new Date(activity.updatedAt)}
            // @ts-expect-error this is fine
            from={"from" in activity ? new Date(activity.from) : undefined}
            // @ts-expect-error this is fine
            to={"to" in activity ? new Date(activity.to) : undefined}
          />
        </div>

        <Feed exclude={activity.id} />
      </main>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  res,
  params,
}: GetServerSidePropsContext) => {
  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const prisma = new PrismaClient();
  const id = params?.id as string;

  const activity = await prisma.activity.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      type: true,
    },
  });

  if (!activity) {
    return {
      notFound: true,
    };
  }

  let activityDetail = null;
  if (activity.type === "OFFER") {
    activityDetail = await prisma.offer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            interactions: true,
            comments: true,
          },
        },
      },
    });

    if (activityDetail) {
      activityDetail = {
        ...activityDetail,
        price: activityDetail.price.toNumber(),
      };
    }
  } else if (activity.type === "POST") {
    activityDetail = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            interactions: true,
            comments: true,
          },
        },
      },
    });
  } else if (activity.type === "RADIO_SUBMISSION") {
    activityDetail = await prisma.radioSubmission.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            interactions: true,
            comments: true,
          },
        },
      },
    });
  } else if (activity.type === "EVENT") {
    activityDetail = await prisma.event.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            interactions: true,
            comments: true,
            interestedInEvent: true,
          },
        },
      },
    });

    if (activityDetail) {
      // @ts-expect-error This is a fine
      activityDetail.from = activityDetail.from.toISOString();
      // @ts-expect-error This is a fine
      activityDetail.to = activityDetail.to.toISOString();
    }
  } else {
    activityDetail = await prisma.poll.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            interactions: true,
            comments: true,
          },
        },
      },
    });
  }

  if (!activityDetail) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      activity: {
        ...activityDetail,
        type: activity.type as
          | "OFFER"
          | "POST"
          | "EVENT"
          | "POLL"
          | "RADIO_SUBMISSION",
        createdAt: activityDetail?.createdAt.toISOString(),
        updatedAt: activityDetail?.updatedAt.toISOString(),
      },
    },
  };
};
