import { PageHero } from '@/components/public/PageHero';
import { PageError, PageLoading } from '@/components/common/PageState';
import { useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

interface ContentSectionData {
  title: string;
  body: string;
  items?: string[];
}

export const StaticContentPage = ({ slug }: { slug: string }) => {
  const { text } = usePublicWebsite();
  const query = useWebsiteItem('page', slug);

  if (query.isLoading) return <PageLoading />;
  if (query.isError || !query.data) {
    return <PageError message={text('global.errors.page-load')} />;
  }

  const item = query.data;
  const value = item.metadata['sections'];
  const sections: ContentSectionData[] = Array.isArray(value)
    ? value.filter(
        (entry): entry is ContentSectionData =>
          Boolean(entry) &&
          typeof entry === 'object' &&
          typeof (entry as Record<string, unknown>)['title'] === 'string' &&
          typeof (entry as Record<string, unknown>)['body'] === 'string',
      )
    : [];

  return (
    <>
      <PageHero title={item.title} excerpt={item.excerpt} />
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-premium sm:p-10">
            <p className="whitespace-pre-line text-lg leading-9 text-slate-700">{item.body}</p>
            {sections.map((section) => (
              <section key={section.title} className="mt-8 border-t border-slate-200 pt-7">
                <h2
                  className="font-display text-2xl font-bold"
                  style={{ color: 'var(--jcst-primary)' }}
                >
                  {section.title}
                </h2>
                <p className="mt-3 whitespace-pre-line leading-8 text-slate-700">{section.body}</p>
                {section.items?.length ? (
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {section.items.map((entry) => (
                      <li key={entry} className="rounded-xl bg-slate-50 p-4 text-slate-700">
                        {entry}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
};
