import { MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/utils/api";
import { type ActivityType } from "./activity";

interface RemoveActivityProps {
  id: string;
  type: ActivityType;
  userId: string;
}

export function RemoveActivity({ id, type, userId }: RemoveActivityProps) {
  const { data: sessionData } = useSession();

  const router = useRouter();
  const { mutateAsync: removeActivity } = api.feed.remove.useMutation({
    async onSuccess() {
      await router.push("/");
    },
  });

  if (sessionData?.user?.id !== userId) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-auto">
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel
          className="cursor-pointer"
          onClick={async () =>
            await removeActivity({
              id,
              type,
            })
          }
        >
          Remove
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
