import { PageHero } from '@/components/public/PageHero';
import { PageError, PageLoading } from '@/components/common/PageState';
import { useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

export const VerifyEmailPage = () => {
  const { text } = usePublicWebsite();
  const page = useWebsiteItem('page', 'verify-email');

  if (page.isLoading) return <PageLoading />;
  if (page.isError || !page.data) return <PageError message={text('global.errors.page-load')} />;

  return (
    <>
      <PageHero title={page.data.title} excerpt={page.data.excerpt} />
      <section className="py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-premium">
          <p className="leading-7 text-slate-600">{page.data.body}</p>
        </div>
      </section>
    </>
  );
};
