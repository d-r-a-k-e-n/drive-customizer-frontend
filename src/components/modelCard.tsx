import Image, { StaticImageData } from "next/image";
import Link from "next/link";

export default function ModelCard({
  name,
  img,
  link,
}: {
  name: string;
  img: string | StaticImageData;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/10"
    >
      <div className="aspect-[16/9] bg-gradient-to-br from-zinc-800 to-black  flex items-center justify-center">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={img}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-104"
            priority={false}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-1 tracking-tight p-3">{name}</h3>
    </Link>
  );
}
