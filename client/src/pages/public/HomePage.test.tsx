import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import type { WebsiteContentRecord } from '@jcst/shared';
import { HomePage } from './HomePage';

const heroSection: WebsiteContentRecord = {
  id: 'hero',
  type: 'section',
  slug: 'home-hero',
  title: 'Homepage Hero',
  excerpt: 'Main homepage introduction.',
  body: '',
  imageUrl: '',
  icon: '',
  order: 1,
  featured: false,
  published: true,
  metadata: {
    enabled: true,
    eyebrow: 'Welcome to JCST',
    titleLineOne: 'Empowering Minds.',
    titleLineTwo: 'Building the Future.',
    description: 'Quality education for a better future.',
    primaryLabel: 'Explore Our Programs',
    primaryUrl: '/programs',
    secondaryLabel: 'Start E-Learning',
    secondaryUrl: '/e-learning',
    imageUrl: '',
    imageAlt: '',
    imageEyebrow: '',
    imageTitle: '',
    imageDescription: '',
    location: 'Belet-Hawa, Somalia',
    institutionLabel: 'Official Institution',
    badges: [],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

vi.mock('@/features/website/context/PublicWebsiteContext', () => ({
  usePublicWebsite: () => ({
    site: { institutionName: 'Jubbaland College of Science and Technology' },
    isLoading: false,
  }),
  useWebsiteSection: (slug: string) => (slug === 'home-hero' ? heroSection : undefined),
}));

vi.mock('@/features/website/useWebsiteContent', () => ({
  useWebsiteCollection: () => ({ isLoading: false, isError: false, data: [] }),
}));

describe('HomePage', () => {
  it('renders database-driven homepage content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Welcome to JCST')).toBeInTheDocument();
    expect(screen.getByText('Empowering Minds.')).toBeInTheDocument();
    expect(screen.getByText('Building the Future.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Our Programs/i })).toHaveAttribute(
      'href',
      '/programs',
    );
    expect(screen.getByRole('link', { name: /Start E-Learning/i })).toHaveAttribute(
      'href',
      '/e-learning',
    );
  });
});
