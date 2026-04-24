import Image from "next/image";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const px = size === "lg" ? 44 : size === "md" ? 28 : 22;
  const text = size === "lg" ? "text-4xl" : size === "md" ? "text-xl" : "text-base";
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/avatar.png"
        alt="GisGPT"
        width={px}
        height={px}
        className="rounded-full"
        priority
      />
      <span className={`font-display font-semibold tracking-tight ${text}`}>GisGPT</span>
    </div>
  );
}
