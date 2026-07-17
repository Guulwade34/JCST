import { Link } from 'react-router-dom';
import { PageError, PageLoading } from '@/components/common/PageState';
import { useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';
import { contentText } from '@/features/website/contentValue';

export const NotFoundPage = () => {
  const { text } = usePublicWebsite();
  const page = useWebsiteItem('page', 'not-found');

  if (page.isLoading) return <PageLoading />;
  if (page.isError || !page.data) return <PageError message={text('global.errors.page-load')} />;

  return (
    <div className="grid min-h-[70vh] place-items-center bg-slate-50 px-4 text-center">
      <div>
        <p className="font-display text-7xl font-bold text-jcst-crimson">
          {contentText(page.data.metadata, 'code')}
        </p>
        <h1 className="mt-4 text-2xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
          {page.data.title}
        </h1>
        <p className="mt-3 text-slate-600">{page.data.excerpt}</p>
        <Link
          to={contentText(page.data.metadata, 'buttonUrl')}
          className="mt-7 inline-flex rounded-xl px-5 py-3 font-semibold text-white"
          style={{ background: 'var(--jcst-secondary)' }}
        >
          {contentText(page.data.metadata, 'buttonLabel')}
        </Link>
      </div>
    </div>
  );
};
