import { useEffect, type ReactNode } from 'react';
import type { AuthResponseData } from '@jcst/shared';
import { authApi } from '@/features/auth/services/authApi';
import {
  clearSessionHint,
  hasSessionHint,
} from '@/features/auth/sessionHint';
import { useAuthStore } from '@/store/authStore';

interface AuthBootstrapProps {
  children: ReactNode;
}

let restorePromise: Promise<AuthResponseData | null> | null = null;

const restoreSession = (): Promise<AuthResponseData | null> => {
  if (!restorePromise) {
    restorePromise = authApi
      .refresh()
      .catch(() => {
        clearSessionHint();
        return null;
      })
      .finally(() => {
        restorePromise = null;
      });
  }

  return restorePromise;
};

export const AuthBootstrap = ({
  children,
}: AuthBootstrapProps) => {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    let active = true;

    if (!hasSessionHint()) {
      clearSession();
      setHydrated(true);

      return () => {
        active = false;
      };
    }

    void restoreSession()
      .then((session) => {
        if (!active) {
          return;
        }

        if (session) {
          setSession(session.accessToken, session.user);
        } else {
          clearSession();
        }
      })
      .finally(() => {
        if (active) {
          setHydrated(true);
        }
      });

    return () => {
      active = false;
    };
  }, [clearSession, setHydrated, setSession]);

  if (!isHydrated) {
    return (
      <div
        className="grid min-h-screen place-items-center bg-white"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-jcst-crimson" />
          <p className="mt-4 text-sm font-medium text-slate-600">
            Preparing the JCST platform…
          </p>
        </div>
      </div>
    );
  }

  return children;
};