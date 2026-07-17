import { useEffect } from 'react';
import {
  AlertTriangle,
  Home,
  RefreshCcw,
} from 'lucide-react';
import {
  Link,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router-dom';

export const PublicRouteErrorPage = () => {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  useEffect(() => {
    if (!isNotFound) {
      console.error('Public route render error:', error);
    }
  }, [error, isNotFound]);

  if (isNotFound) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-16">
        <section className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,.10)] sm:p-12">
          <p className="font-display text-7xl font-bold text-jcst-crimson">404</p>
          <h1 className="mt-4 font-display text-3xl font-bold"
            style={{ color: 'var(--jcst-primary)' }}>
            Page Not Found
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            The requested JCST page does not exist or the link has changed.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 font-semibold text-white transition hover:-translate-y-0.5"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            <Home size={18} />
            Return Home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-16">
      <section className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,.10)] sm:p-12">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50"
          style={{ color: 'var(--jcst-secondary)' }}>
          <AlertTriangle size={30} />
        </span>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em]"
          style={{ color: 'var(--jcst-secondary)' }}>
          Temporary page error
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold"
          style={{ color: 'var(--jcst-primary)' }}>
          This page could not load correctly
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Refresh the page once. If the problem continues, check the browser
          console for the exact component error.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 font-semibold text-white transition hover:-translate-y-0.5"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            <RefreshCcw size={18} />
            Reload Page
          </button>

          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 font-semibold text-slate-700 transition hover:border-[var(--jcst-accent)]"
          >
            <Home size={18} />
            Return Home
          </Link>
        </div>
      </section>
    </main>
  );
};