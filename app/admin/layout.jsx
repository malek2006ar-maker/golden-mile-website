// Root layout for /admin/* — لا يحتوي على AuthGuard
// الـ AuthGuard يكون في (dashboard) subroute فقط

export default function AdminLayout({ children }) {
  return <>{children}</>;
}