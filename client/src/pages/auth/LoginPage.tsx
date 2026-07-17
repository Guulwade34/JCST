import type { LoginInput } from '@jcst/shared';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { PageError, PageLoading } from '@/components/common/PageState';
import { BrandLogo } from '@/components/public/BrandLogo';
import { authApi } from '@/features/auth/services/authApi';
import { useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';
import { contentText } from '@/features/website/contentValue';
import { useAuthStore } from '@/store/authStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { text } = usePublicWebsite();
  const page = useWebsiteItem('page', 'login');
  const setSession = useAuthStore((state) => state.setSession);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const login = useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (session) => {
      setSession(session.accessToken, session.user);

      const canOpenAdmin =
        session.user.roles.includes('super-admin') ||
        session.user.roles.includes('college-admin');

      void navigate(canOpenAdmin ? '/admin' : '/', {
        replace: true,
      });
    },
  });

  if (page.isLoading) {
    return <PageLoading />;
  }

  if (page.isError || !page.data) {
    return <PageError message={text('global.errors.page-load')} />;
  }

  const metadata = page.data.metadata;
  const loginError = login.isError
    ? getLoginErrorMessage(login.error, contentText(metadata, 'errorMessage'))
    : '';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,.10),transparent_28%),linear-gradient(180deg,#f8fafc,#eef3f8)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-md">
        <BrandLogo />

        <Link
          to={contentText(metadata, 'backUrl') || '/'}
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-jcst-crimson"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          {contentText(metadata, 'backLabel') || 'Back to Public Website'}
        </Link>

        <div className="mt-8 rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,.10)] sm:p-9">
          <div className="flex items-start justify-between gap-5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-jcst-crimson">
              <LockKeyhole aria-hidden="true" />
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-[11px] font-bold text-green-700">
              <ShieldCheck size={14} />
              Secure portal
            </span>
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-jcst-crimson">
            {contentText(metadata, 'eyebrow') || 'Secure Access'}
          </p>

          <h1
            className="mt-2 font-display text-3xl font-bold"
            style={{ color: 'var(--jcst-primary)' }}
          >
            {page.data.title}
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {page.data.excerpt}
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit((values) => login.mutate(values))}
            noValidate
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                {contentText(metadata, 'emailLabel') || 'Email Address'}
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="min-h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 text-slate-900 transition focus:border-jcst-crimson focus:ring-4 focus:ring-red-100"
                  {...register('email', {
                    required:
                      contentText(metadata, 'emailRequired') ||
                      'Email address is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message:
                        contentText(metadata, 'emailInvalid') ||
                        'Enter a valid email address',
                    },
                  })}
                />
              </div>

              {errors.email ? (
                <p
                  id="email-error"
                  className="mt-2 text-sm font-medium text-jcst-crimson"
                >
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                {contentText(metadata, 'passwordLabel') || 'Password'}
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className="min-h-12 w-full rounded-xl border border-slate-300 pl-11 pr-12 text-slate-900 transition focus:border-jcst-crimson focus:ring-4 focus:ring-red-100"
                  {...register('password', {
                    required:
                      contentText(metadata, 'passwordRequired') ||
                      'Password is required',
                    minLength: {
                      value: 8,
                      message:
                        contentText(metadata, 'passwordMinLength') ||
                        'Password must contain at least 8 characters',
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-jcst-crimson"
                  aria-label={showPassword ? 'Hide credentials' : 'Show credentials'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password ? (
                <p
                  id="password-error"
                  className="mt-2 text-sm font-medium text-jcst-crimson"
                >
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-end">
              <Link
                to={contentText(metadata, 'forgotUrl') || '/forgot-password'}
                className="text-sm font-semibold text-jcst-crimson"
              >
                {contentText(metadata, 'forgotLabel') || 'Forgot Password?'}
              </Link>
            </div>

            {loginError ? (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-800"
              >
                {loginError}
              </div>
            ) : null}

            <Button type="submit" fullWidth disabled={login.isPending}>
              {login.isPending
                ? contentText(metadata, 'submittingLabel') || 'Signing In…'
                : contentText(metadata, 'submitLabel') || 'Sign In Securely'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const getLoginErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (
    isAxiosError<{
      message?: string;
    }>(error)
  ) {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (status === 401) {
      return 'Email-ka ama password-ka waa khaldan yahay. Admin account-ka dib u seed-garee haddii database-ku cusub yahay.';
    }

    if (status === 423) {
      return serverMessage || 'Account-ka si ku-meel-gaar ah ayaa loo xiray. Sug kadibna mar kale isku day.';
    }

    if (status === 403) {
      return serverMessage || 'Account-kan ma shaqaynayo ama waa la xiray.';
    }

    return serverMessage || error.message || fallbackMessage;
  }

  return error instanceof Error
    ? error.message
    : fallbackMessage || 'Login could not be completed.';
};
