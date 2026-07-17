import type { WebsiteContentType } from '@jcst/shared';
import { ContentCard } from '@/components/public/ContentCard';
import { PageHero } from '@/components/public/PageHero';
import { EmptyState, PageError, PageLoading } from '@/components/common/PageState';
import { useWebsiteCollection, useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

export const CollectionPage = ({
  type,
  pageSlug,
  basePath,
}: {
  type: WebsiteContentType;
  pageSlug: string;
  basePath?: string;
}) => {
  const { text } = usePublicWebsite();
  const page = useWebsiteItem('page', pageSlug);
  const collection = useWebsiteCollection(type);

  if (page.isLoading || collection.isLoading) return <PageLoading />;
  if (page.isError || collection.isError || !page.data) {
    return <PageError message={text('global.errors.page-load')} />;
  }

  const emptyMessage =
    typeof page.data.metadata['emptyMessage'] === 'string'
      ? page.data.metadata['emptyMessage']
      : '';

  return (
    <>
      <PageHero title={page.data.title} excerpt={page.data.excerpt} />
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {collection.data?.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {collection.data.map((item) => (
                <ContentCard key={item.id} item={item} {...(basePath ? { basePath } : {})} />
              ))}
            </div>
          ) : (
            <EmptyState message={emptyMessage} />
          )}
        </div>
      </section>
    </>
  );
};
