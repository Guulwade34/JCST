import { Link } from 'react-router-dom';
import { PageHero } from '@/components/public/PageHero';
import { PageError, PageLoading } from '@/components/common/PageState';
import { useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';
import { contentText } from '@/features/website/contentValue';

export const RegisterPage = () => {
  const { text } = usePublicWebsite();
  const page = useWebsiteItem('page', 'register');

  if (page.isLoading) return <PageLoading />;
  if (page.isError || !page.data) return <PageError message={text('global.errors.page-load')} />;

  const metadata = page.data.metadata;

  return (
    <>
      <PageHero title={page.data.title} excerpt={page.data.excerpt} />
      <section className="py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-premium">
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
            {contentText(metadata, 'panelTitle')}
          </h2>
          <p className="mt-4 leading-7 text-slate-600">{page.data.body}</p>
          <Link
            to={contentText(metadata, 'buttonUrl')}
            className="mt-7 inline-flex rounded-xl px-6 py-3 font-semibold text-white"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            {contentText(metadata, 'buttonLabel')}
          </Link>
        </div>
      </section>
    </>
  );
};
