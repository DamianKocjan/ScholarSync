import { PrismaClient } from "@prisma/client";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { NextSeo } from "next-seo";

import { getServerAuthSession } from "~/server/auth";

export default function SpottedActivityDetail({
  activity,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <NextSeo
        description={
          activity.type === "post"
            ? activity.content.slice(0, 150) + "..."
            : activity.description.slice(0, 150) + "..."
        }
      />
      <main className="flex flex-col items-center">
        <div className="w-2/3 space-y-6">
          <div className="flex items-center justify-between space-y-2">
            <H1>Spotted</H1>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <H3>{activity.title}</H3>
              <MutedText>{activity.createdAt}</MutedText>
            </div>
            <div className="flex flex-col space-y-2">
              <p>{activity.description}</p>
            </div>
          </div>
        </div>
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
        user: true,
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
        user: true,
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
        user: true,
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
        user: true,
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
        type: activity.type,
        createdAt: activityDetail?.createdAt.toISOString(),
        updatedAt: activityDetail?.updatedAt.toISOString(),
      },
    },
  };
};
