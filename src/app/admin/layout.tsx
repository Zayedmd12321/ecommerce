// File: app/admin/layout.tsx
export const metadata = {
  title: 'Admin | E-Store',
  description: 'Admin dashboard for managing products in E-Store.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
