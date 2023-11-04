import { Feed } from "~/components/spotted/feed";

export default function Spotted() {
  return (
    <main className="flex flex-col items-center">
      <Feed withCreate />
    </main>
  );
}
