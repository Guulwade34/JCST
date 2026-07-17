import { useState } from 'react';
import { PageHero } from '@/components/public/PageHero';
import { PageError, PageLoading } from '@/components/common/PageState';
import { useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';
import { contentText } from '@/features/website/contentValue';

export const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);
  const { text } = usePublicWebsite();
  const page = useWebsiteItem('page', 'forgot-password');

  if (page.isLoading) return <PageLoading />;
  if (page.isError || !page.data) return <PageError message={text('global.errors.page-load')} />;

  const metadata = page.data.metadata;

  return (
    <>
      <PageHero title={page.data.title} excerpt={page.data.excerpt} />
      <section className="py-16">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
          className="mx-auto grid max-w-lg gap-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-premium"
        >
          <label className="grid gap-2 font-semibold">
            {contentText(metadata, 'emailLabel')}
            <input
              required
              type="email"
              className="input"
              placeholder={contentText(metadata, 'emailPlaceholder')}
            />
          </label>
          <button
            type="submit"
            className="min-h-12 rounded-xl font-semibold text-white"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            {contentText(metadata, 'submitLabel')}
          </button>
          {sent ? (
            <p className="rounded-xl bg-amber-50 p-4 text-amber-900">
              {contentText(metadata, 'sentMessage')}
            </p>
          ) : null}
        </form>
      </section>
    </>
  );
};
