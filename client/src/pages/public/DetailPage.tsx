import type { WebsiteContentType } from '@jcst/shared';
import { useParams } from 'react-router-dom';
import { PageHero } from '@/components/public/PageHero';
import { PageError, PageLoading } from '@/components/common/PageState';
import { useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

interface PublicDetail {
  label: string;
  value: string;
}

export const DetailPage = ({ type }: { type: WebsiteContentType }) => {
  const { slug = '' } = useParams();
  const { text } = usePublicWebsite();
  const query = useWebsiteItem(type, slug);

  if (query.isLoading) return <PageLoading />;
  if (query.isError || !query.data) {
    return <PageError message={text('global.errors.content-not-found')} />;
  }

  const item = query.data;
  const detailsValue = item.metadata['publicDetails'];
  const details: PublicDetail[] = Array.isArray(detailsValue)
    ? detailsValue.filter(
        (entry): entry is PublicDetail =>
          Boolean(entry) &&
          typeof entry === 'object' &&
          typeof (entry as Record<string, unknown>)['label'] === 'string' &&
          typeof (entry as Record<string, unknown>)['value'] === 'string',
      )
    : [];
  const imageAlt = typeof item.metadata['imageAlt'] === 'string' ? item.metadata['imageAlt'] : '';

  return (
    <>
      <PageHero title={item.title} excerpt={item.excerpt} />
      <section className="py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:px-8">
          {item.imageUrl ? (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-premium">
              <img
                src={item.imageUrl}
                alt={imageAlt}
                className="max-h-[540px] w-full object-cover"
              />
            </div>
          ) : null}
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-premium">
            <p className="whitespace-pre-line text-lg leading-9 text-slate-700">{item.body}</p>
            {details.length ? (
              <dl className="mt-10 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2">
                {details.map((detail) => (
                  <div
                    key={`${detail.label}-${detail.value}`}
                    className="rounded-xl bg-slate-50 p-4"
                  >
                    <dt className="text-xs font-bold uppercase tracking-wider text-jcst-crimson">
                      {detail.label}
                    </dt>
                    <dd className="mt-2 text-slate-700">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </article>
        </div>
      </section>
    </>
  );
};
