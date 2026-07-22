import AdminSidebar from "./AdminSidebar";
import "../../styles/admin.css";

/**
 * Reusable layout shell for all admin pages.
 * Usage: <AdminLayout title="Page Title" description="subtitle">
 *           ...page content...
 *        </AdminLayout>
 */
const AdminLayout = ({ title, description, topbarActions, children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </div>
          {topbarActions && (
            <div className="admin-topbar-actions">{topbarActions}</div>
          )}
        </div>
        <div className="admin-page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
