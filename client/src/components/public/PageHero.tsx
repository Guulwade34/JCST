import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

export const PageHero = ({
  eyebrow,
  title,
  excerpt,
}: {
  eyebrow?: string;
  title: string;
  excerpt: string;
}) => {
  const { text } = usePublicWebsite();
  const resolvedEyebrow = eyebrow ?? text('global.page-hero.eyebrow');

  return (
    <section
      className="relative overflow-hidden py-20 text-white"
      style={{ background: 'var(--jcst-dark)' }}
    >
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_top_right,var(--jcst-secondary)_0,transparent_42%),radial-gradient(circle_at_bottom_left,var(--jcst-accent)_0,transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className="text-sm font-bold uppercase tracking-[0.2em]"
          style={{ color: 'var(--jcst-accent)' }}
        >
          {resolvedEyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{excerpt}</p>
      </div>
    </section>
  );
};
