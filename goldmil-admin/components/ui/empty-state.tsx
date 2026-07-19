import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "لا توجد بيانات",
  description = "لم يتم العثور على أي عناصر هنا بعد.",
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-4",
      "text-center",
      className
    )}>
      <div className="w-16 h-16 rounded-2xl bg-gold-600/10 border border-gold-600/20 flex items-center justify-center mb-4">
        {icon ?? <Inbox className="w-8 h-8 text-gold-600" />}
      </div>
      <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}