import {
  BarChart3,
  BookOpen,
  Building2,
  ChevronRight,
  FileText,
  Gauge,
  Globe2,
  GraduationCap,
  HelpCircle,
  Image,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquareQuote,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { PageLoading } from '@/components/common/PageState';
import { authApi } from '@/features/auth/services/authApi';
import { useAuthStore } from '@/store/authStore';

const groups = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/', label: 'View Public Website', icon: Globe2 },
    ],
  },
  {
    label: 'Website Foundation',
    items: [
      { to: '/admin/content/setting', label: 'Site Settings', icon: Settings },
      { to: '/admin/content/navigation', label: 'Navigation', icon: Menu },
      { to: '/admin/content/footer', label: 'Footer', icon: PanelLeftClose },
      { to: '/admin/content/copy', label: 'Reusable Text', icon: FileText },
    ],
  },
  {
    label: 'Public Pages',
    items: [
      { to: '/admin/content/page', label: 'Pages', icon: FileText },
      { to: '/admin/content/section', label: 'Homepage Sections', icon: Image },
      { to: '/admin/content/department', label: 'Departments', icon: Building2 },
      { to: '/admin/content/program', label: 'Programs', icon: GraduationCap },
      { to: '/admin/content/course', label: 'Courses', icon: BookOpen },
      { to: '/admin/content/lecturer', label: 'Lecturers', icon: Users },
      { to: '/admin/content/announcement', label: 'Announcements', icon: Megaphone },
      { to: '/admin/content/faq', label: 'FAQs', icon: HelpCircle },
      { to: '/admin/content/facility', label: 'Facilities', icon: Building2 },
      { to: '/admin/content/testimonial', label: 'Testimonials', icon: MessageSquareQuote },
      { to: '/admin/content/statistic', label: 'Statistics', icon: BarChart3 },
    ],
  },
];

export const AdminLayout = () => {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.isHydrated);
  const clear = useAuthStore((state) => state.clearSession);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const logout = useMutation({ mutationFn: () => authApi.logout(), onSettled: clear });

  if (!hydrated) return <PageLoading />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.roles.includes('super-admin') && !user.roles.includes('college-admin')) {
    return <Navigate to="/" replace />;
  }

  const currentLabel = groups
    .flatMap((group) => group.items)
    .find((item) =>
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
    )?.label ?? 'Administration';

  return (
    <div
      className={`min-h-screen bg-[#f4f6f9] lg:grid ${
        collapsed ? 'lg:grid-cols-[92px_1fr]' : 'lg:grid-cols-[290px_1fr]'
      }`}
    >
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close admin navigation"
          className="fixed inset-0 z-40 bg-slate-950/55 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col overflow-hidden bg-[#071a33] text-white shadow-2xl transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex min-h-20 items-center gap-3 border-b border-white/10 px-5">
          <img
            src="/branding/jcst-logo.png"
            alt="JCST logo"
            className="h-11 w-11 rounded-xl bg-white object-contain p-1 shadow"
          />
          {!collapsed ? (
            <div className="min-w-0">
              <p className="font-display text-xl font-bold tracking-tight">JCST Admin</p>
              <p className="truncate text-xs text-slate-400">Content & college management</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 [scrollbar-width:thin]">
          {groups.map((group) => (
            <div key={group.label} className="mb-6">
              {!collapsed ? (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {group.label}
                </p>
              ) : null}
              <div className="grid gap-1">
                {group.items.map((item) => (
                  <AdminLink
                    key={item.to}
                    {...item}
                    collapsed={collapsed}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className={`rounded-2xl bg-white/[0.06] p-3 ${collapsed ? 'text-center' : ''}`}>
            {!collapsed ? (
              <>
                <p className="truncate text-sm font-bold">{user.displayName}</p>
                <p className="mt-1 truncate text-xs text-slate-400">Administrator account</p>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => logout.mutate()}
              className={`mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 text-sm font-semibold text-slate-200 transition hover:bg-white/10 ${
                collapsed ? 'w-11 px-0' : 'w-full px-4'
              }`}
              title="Sign out"
            >
              <LogOut size={17} />
              {!collapsed ? 'Sign out' : null}
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0">
        <header className="sticky top-0 z-30 flex min-h-20 items-center gap-4 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-7">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="hidden h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:grid"
            title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              Administration <ChevronRight size={13} />
            </div>
            <h1 className="truncate font-display text-xl font-bold text-[#071a33] sm:text-2xl">
              {currentLabel}
            </h1>
          </div>
          <div className="ml-auto hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 sm:flex">
            <Gauge size={15} /> System online
          </div>
        </header>

        <div className="p-4 sm:p-7 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const AdminLink = ({
  to,
  icon: Icon,
  label,
  end = false,
  collapsed,
  onClick,
}: {
  to: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  end?: boolean;
  collapsed: boolean;
  onClick: () => void;
}) => (
  <NavLink
    end={end}
    to={to}
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={({ isActive }) =>
      `group flex min-h-11 items-center rounded-xl text-sm font-semibold transition ${
        collapsed ? 'justify-center px-0' : 'gap-3 px-3'
      } ${
        isActive
          ? 'bg-[#a80f24] text-white shadow-lg shadow-red-950/25'
          : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
      }`
    }
  >
    <Icon size={18} />
    {!collapsed ? <span className="truncate">{label}</span> : null}
  </NavLink>
);
