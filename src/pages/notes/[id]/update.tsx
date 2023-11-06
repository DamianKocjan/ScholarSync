import { useSession } from "next-auth/react";

export default function UpdateNote() {
  useSession({ required: true });

  return <div>WIP: Update Note</div>;
}
