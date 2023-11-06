import { MoreVertical } from "lucide-react";
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
}

export function RemoveActivity({ id, type }: RemoveActivityProps) {
  const router = useRouter();
  const { mutateAsync: removeActivity } = api.feed.remove.useMutation({
    async onSuccess() {
      await router.push("/");
    },
  });

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
