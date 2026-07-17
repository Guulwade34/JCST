import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { WebsiteContentRecord } from '@jcst/shared';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

export const ContentCard = ({
  item,
  basePath,
}: {
  item: WebsiteContentRecord;
  basePath?: string;
}) => {
  const { text } = usePublicWebsite();
  const code = typeof item.metadata['code'] === 'string' ? item.metadata['code'] : '';
  const imageAlt = typeof item.metadata['imageAlt'] === 'string' ? item.metadata['imageAlt'] : '';

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
      {item.imageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
          <img
            src={item.imageUrl}
            alt={imageAlt}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.72),transparent_70%)]" />
          {code ? (
            <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-jcst-crimson backdrop-blur">
              {code}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        {!item.imageUrl && code ? (
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-jcst-crimson">{code}</p>
        ) : null}
        <h2
          className={`${!item.imageUrl && code ? 'mt-3' : ''} text-xl font-bold`}
          style={{ color: 'var(--jcst-primary)' }}
        >
          {item.title}
        </h2>
        <p className="mt-3 flex-1 leading-7 text-slate-600">{item.excerpt}</p>
        {basePath ? (
          <Link
            to={`${basePath}/${item.slug}`}
            className="mt-5 inline-flex items-center gap-2 font-semibold text-jcst-crimson"
          >
            {text('global.content-card.view-details')}
            <ArrowRight size={17} className="transition group-hover:translate-x-1" />
          </Link>
        ) : null}
      </div>
    </article>
  );
};
