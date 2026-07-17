import { ChevronDown, LogOut, MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import type { WebsiteNavigationItem } from '@jcst/shared';
import { BrandLogo } from './BrandLogo';
import { authApi } from '@/features/auth/services/authApi';
import { useAuthStore } from '@/store/authStore';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

export const PublicHeader = () => {
  const [open, setOpen] = useState(false);
  const { navigation, site, text } = usePublicWebsite();
  const user = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clearSession);
  const logout = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clear();
      setOpen(false);
    },
  });

  return (
    <>
      <div
        className="hidden border-b border-white/10 text-slate-100 sm:block"
        style={{ background: 'var(--jcst-dark)' }}
      >
        <div className="mx-auto flex min-h-9 max-w-[1500px] items-center justify-between gap-6 px-6 text-[12px] font-medium">
          <p className="truncate">{text('global.header.topbar')}</p>

          {site.address ? (
            <p className="hidden shrink-0 items-center gap-2 text-slate-300 lg:inline-flex">
              <MapPin size={14} style={{ color: 'var(--jcst-accent)' }} />
              {site.address}
            </p>
          ) : null}
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_8px_28px_rgba(15,23,42,.055)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[84px] max-w-[1500px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
          <BrandLogo />

          <nav
            className="hidden items-center gap-1 xl:flex"
            aria-label={text('global.header.primary-navigation-aria')}
          >
            {navigation.map((item) => (
              <DesktopNavigationItem key={item.id} item={item} />
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 xl:flex">
            {user ? (
              <>
                <Link
                  to={user.roles.includes('super-admin') ? '/admin' : '/'}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-jcst-crimson"
                >
                  {user.roles.includes('super-admin')
                    ? text('global.header.dashboard')
                    : user.displayName}
                </Link>
                <button
                  type="button"
                  onClick={() => logout.mutate()}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-jcst-crimson"
                  aria-label={text('global.header.sign-out-aria')}
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link
                to={text('global.header.login-url')}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-jcst-crimson"
              >
                {text('global.header.login-label')}
              </Link>
            )}

            <Link
              to={text('global.header.apply-url')}
              className="inline-flex min-h-12 items-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/15 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: 'var(--jcst-secondary)' }}
            >
              {text('global.header.apply-label')}
            </Link>
          </div>

          <button
            type="button"
            className="grid h-12 w-12 place-items-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-[var(--jcst-accent)] hover:text-jcst-crimson xl:hidden"
            aria-label={
              open ? text('global.header.close-menu-aria') : text('global.header.open-menu-aria')
            }
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open ? (
          <nav className="max-h-[calc(100vh-6rem)] overflow-y-auto border-t border-slate-200 bg-white p-4 shadow-2xl xl:hidden">
            <div className="mx-auto grid max-w-7xl gap-1">
              {navigation.map((item) => (
                <MobileNavigationItem key={item.id} item={item} close={() => setOpen(false)} />
              ))}

              {user ? (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 font-semibold text-slate-700"
                >
                  {text('global.header.dashboard')}
                </Link>
              ) : (
                <Link
                  to={text('global.header.login-url')}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 font-semibold text-slate-700"
                >
                  {text('global.header.login-label')}
                </Link>
              )}

              <Link
                to={text('global.header.apply-url')}
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl px-4 py-3 text-center font-semibold text-white"
                style={{ background: 'var(--jcst-secondary)' }}
              >
                {text('global.header.apply-label')}
              </Link>
            </div>
          </nav>
        ) : null}
      </header>
    </>
  );
};

const DesktopNavigationItem = ({ item }: { item: WebsiteNavigationItem }) => {
  if (item.children?.length) {
    return (
      <div className="group relative">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-jcst-crimson"
        >
          {item.label}
          <ChevronDown size={14} className="transition group-hover:rotate-180" />
        </button>
        <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
            {item.children.map((child) => (
              <Link
                key={child.id}
                to={child.to}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-jcst-crimson"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        `relative rounded-xl px-3 py-2.5 text-[14px] font-semibold transition ${
          isActive
            ? 'bg-red-50/70 text-jcst-crimson'
            : 'text-slate-700 hover:bg-slate-50 hover:text-jcst-crimson'
        }`
      }
    >
      {item.label}
    </NavLink>
  );
};

const MobileNavigationItem = ({
  item,
  close,
}: {
  item: WebsiteNavigationItem;
  close: () => void;
}) => (
  <div className="grid gap-1">
    {item.to ? (
      <Link
        to={item.to}
        onClick={close}
        className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
      >
        {item.label}
      </Link>
    ) : (
      <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
        {item.label}
      </p>
    )}
    {item.children?.map((child) => (
      <Link
        key={child.id}
        to={child.to}
        onClick={close}
        className="ml-4 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
      >
        {child.label}
      </Link>
    ))}
  </div>
);