import { AvatarFallback, AvatarImage, Avatar as _Avatar } from "./ui/avatar";

interface AvatarProps {
  name: string | null;
  image: string | null;
}

export function Avatar({ name, image }: AvatarProps) {
  return (
    <_Avatar>
      <AvatarImage src={image ?? undefined} alt={name ?? undefined} />
      <AvatarFallback>
        {name
          ? name?.charAt(0).toUpperCase() + name?.charAt(1).toUpperCase()
          : "??"}
      </AvatarFallback>
    </_Avatar>
  );
}
