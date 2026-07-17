import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import type { WebsiteContentRecord } from '@jcst/shared';
import { authApi } from '@/features/auth/services/authApi';
import { LoginPage } from './LoginPage';

const loginPage: WebsiteContentRecord = {
  id: 'login-page',
  type: 'page',
  slug: 'login',
  title: 'JCST Portal Login',
  excerpt: 'Use your authorized college account.',
  body: '',
  imageUrl: '',
  icon: '',
  order: 1,
  featured: false,
  published: true,
  metadata: {
    eyebrow: 'Secure Access',
    backLabel: 'Back to Public Website',
    backUrl: '/',
    emailLabel: 'Email Address',
    emailRequired: 'Email address is required',
    emailInvalid: 'Enter a valid email address',
    passwordLabel: 'Password',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must contain at least 8 characters',
    forgotLabel: 'Forgot Password?',
    forgotUrl: '/forgot-password',
    submitLabel: 'Sign In Securely',
    submittingLabel: 'Signing In…',
    errorMessage: 'Login could not be completed.',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

vi.mock('@/features/website/useWebsiteContent', () => ({
  useWebsiteItem: () => ({ isLoading: false, isError: false, data: loginPage }),
}));

vi.mock('@/features/website/context/PublicWebsiteContext', () => ({
  usePublicWebsite: () => ({
    text: () => 'Unable to load this page.',
    site: {
      shortName: 'JCST',
      institutionName: 'Jubbaland College of Science and Technology',
      logoUrl: '',
      logoAlt: 'JCST logo',
    },
  }),
}));

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('LoginPage', () => {
  it('shows database-managed validation messages before sending invalid credentials', async () => {
    const user = userEvent.setup();
    const loginSpy = vi.spyOn(authApi, 'login');
    renderPage();

    await user.type(screen.getByLabelText(/Email address/i), 'invalid');
    await user.type(screen.getByLabelText(/Password/i), 'short');
    await user.click(screen.getByRole('button', { name: /Sign in securely/i }));

    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(loginSpy).not.toHaveBeenCalled();
  });
});
