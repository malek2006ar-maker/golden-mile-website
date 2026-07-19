import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { User } from "@/types";

interface DashboardShellProps {
  user: Pick<User, "id" | "name" | "email" | "role" | "avatar">;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar userRole={user.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-ink-900 via-ink-900 to-ink-950">
          {children}
        </main>
      </div>
    </div>
  );
}