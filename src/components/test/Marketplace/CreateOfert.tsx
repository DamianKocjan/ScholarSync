import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { WarningCircle } from "phosphor-react";
import React, { useCallback, useMemo, useState } from "react";
import { trpc } from "../../utils/trpc";
import { Ofert } from "../shared/Activity/Create/Ofert";
import { ActivityCreateData } from "../shared/Activity/Create/types";
import { Avatar } from "../shared/Avatar";
import { Button } from "../shared/Button";
import { LoadingSpinner } from "../shared/LoadingSpinner";

export const CreateOfert: React.FC = () => {
  const { data: sessionData } = useSession();
  const [data, setData] = useState<ActivityCreateData["ofert"]>({
    title: "",
    description: "",
    price: 0.0,
    category: "",
    condition: "UNKNOWN",
    image: undefined,
  });

  const handleSetData = useCallback(
    (key: string, value: unknown) =>
      setData((data) => ({
        ...data,
        [key]: value,
      })),
    []
  );

  const isValid = useMemo(
    () =>
      !!(
        data.title.trim() &&
        data.description.trim() &&
        data.price > 0 &&
        data.category.trim()
      ),
    [data]
  );

  const router = useRouter();
  const { isLoading, isError, error, mutateAsync } =
    trpc.feed.create.useMutation({
      async onSuccess(data) {
        router.push(`/activity/${data.id}`);
      },
    });

  return (
    <div className="mb-4 divide-y divide-gray-200 rounded-lg bg-white shadow shadow-indigo-300 transition-shadow hover:shadow-md">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center gap-4">
          <Avatar src={sessionData?.user?.image} alt="User profile" />
          <h3 className="text-lg">What&apos;s on your mind?</h3>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await mutateAsync({
              type: "ofert",
              data: {
                ofert: data,
              },
            });
          }}
        >
          <Ofert data={data} handleSetData={handleSetData} />

          {isError && (
            <div className="rounded-md border border-gray-100 p-2">
              <h3 className="flex items-center text-lg text-red-500">
                <WarningCircle className="mr-1 h-5 w-5 text-red-600" /> Error
              </h3>
              <p className="text-sm">{error?.message || error?.toString()}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-1 h-5 w-5" /> Loading...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
