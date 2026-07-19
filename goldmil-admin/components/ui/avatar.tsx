import { getInitials, getAvatarColor, cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-[10px]",
  md: "w-10 h-10 text-xs",
  lg: "w-14 h-14 text-base",
};

export function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br flex items-center justify-center font-extrabold text-ink-900 flex-shrink-0",
        getAvatarColor(name),
        sizeMap[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}