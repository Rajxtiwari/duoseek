import Image from "next/image";

type GamerAvatarProps = {
  avatarUrl: string | null;
  seedText?: string;
  alt: string;
  sizeClassName?: string;
};

export default function GamerAvatar({
  avatarUrl,
  seedText = "P",
  alt,
  sizeClassName = "h-10 w-10",
}: GamerAvatarProps) {
  const initials = seedText.slice(0, 1).toUpperCase();

  return (
    <div
      className={`relative ${sizeClassName} rounded-full overflow-hidden border border-white/20 bg-gradient-to-br from-purple-700 to-cyan-700 flex items-center justify-center text-xs font-bold text-white`}
    >
      {avatarUrl ? <Image src={avatarUrl} alt={alt} fill className="object-cover" /> : initials}
    </div>
  );
}
