
export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin panel',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="admin-dashboard">
          {children}
        </div>
      </body>
    </html>
  );
}