import {
  ArrowRight,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { WebsiteFooterLink } from '@jcst/shared';
import { BrandLogo } from './BrandLogo';
import { apiClient } from '@/services/apiClient';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

export const PublicFooter = () => {
  const { footer, site, text } = usePublicWebsite();
  const { register, handleSubmit, reset } = useForm<{ email: string }>();
  const subscribe = useMutation({
    mutationFn: (values: { email: string }) => apiClient.post('/public/newsletter', values),
    onSuccess: () => reset(),
  });

  const copyright = site.copyrightText.replace('{year}', String(new Date().getFullYear()));
  const columns = footer.columns
    .filter((column) => column.enabled)
    .sort((left, right) => left.order - right.order);
  const legalLinks = footer.legalLinks.filter((link) => link.enabled);
  const socialLinks = footer.socialLinks.filter((link) => link.enabled && link.to);
  const developedBy =
    text('global.footer.developed-by').trim() || 'Developed by Eng Guulwade';

  return (
    <footer
      className="relative isolate overflow-hidden text-slate-200"
      style={{ background: 'var(--jcst-dark)' }}
    >
      <div className="absolute inset-0 -z-20 opacity-20 [background-image:radial-gradient(circle,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute -left-32 top-16 -z-10 h-80 w-80 rounded-full bg-amber-500/10 blur-[110px]" />
      <div className="absolute -right-40 bottom-8 -z-10 h-96 w-96 rounded-full bg-red-700/15 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <div className="inline-flex max-w-full rounded-[22px] border border-white/15 bg-white p-3 shadow-[0_18px_50px_rgba(0,0,0,.28)] ring-1 ring-white/10">
              <BrandLogo />
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              {footer.description}
            </p>

            <p className="mt-4 text-sm font-semibold" style={{ color: 'var(--jcst-accent)' }}>
              {site.motto}
            </p>

            <div className="mt-6 grid gap-3 text-sm text-slate-300">
              {site.address ? <ContactLine icon={MapPin} value={site.address} /> : null}
              {site.phone ? (
                <ContactLine
                  icon={Phone}
                  value={site.phone}
                  href={`tel:${site.phone.replace(/\s+/g, '')}`}
                />
              ) : null}
              {site.email ? (
                <ContactLine icon={Mail} value={site.email} href={`mailto:${site.email}`} />
              ) : null}
            </div>

            {socialLinks.length > 0 ? (
              <div className="mt-7 flex flex-wrap gap-3">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.label);

                  return (
                    <a
                      key={`${link.label}-${link.to}`}
                      href={link.to}
                      target={link.external === false ? undefined : '_blank'}
                      rel={link.external === false ? undefined : 'noreferrer'}
                      aria-label={link.label}
                      title={link.label}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition duration-300 hover:-translate-y-1 hover:border-[var(--jcst-accent)] hover:bg-white/10 hover:text-white"
                    >
                      <Icon size={17} />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="grid gap-9 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3 lg:pl-4">
            {columns.map((column) => (
              <div key={`${column.title}-${column.order}`}>
                <h2 className="font-display text-lg font-bold text-white">{column.title}</h2>

                <div className="mt-5 grid gap-2">
                  {column.links
                    .filter((link) => link.enabled)
                    .map((link) => (
                      <FooterLinkItem key={`${link.label}-${link.to}`} link={link} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {footer.newsletterEnabled ? (
          <div className="mt-12 rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
            <div className="grid items-center gap-7 lg:grid-cols-[1fr_minmax(360px,.9fr)]">
              <div className="max-w-2xl">
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  {text('global.footer.newsletter-title')}
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {text('global.footer.newsletter-description')}
                </p>
              </div>

              <div>
                <form
                  onSubmit={handleSubmit((values) => subscribe.mutate(values))}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    required
                    type="email"
                    aria-label={text('global.footer.newsletter-aria')}
                    placeholder={text('global.footer.newsletter-placeholder')}
                    className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--jcst-accent)]"
                    {...register('email')}
                  />

                  <button
                    type="submit"
                    disabled={subscribe.isPending}
                    className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: 'var(--jcst-secondary)' }}
                  >
                    {subscribe.isPending
                      ? text('global.footer.newsletter-submitting')
                      : text('global.footer.newsletter-button')}
                    <ArrowRight size={15} />
                  </button>
                </form>

                {subscribe.isSuccess ? (
                  <p className="mt-3 text-sm text-emerald-300">
                    {text('global.footer.newsletter-success')}
                  </p>
                ) : null}

                {subscribe.isError ? (
                  <p className="mt-3 text-sm text-red-300">
                    {text('global.footer.newsletter-error')}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-xs text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <p>{copyright}</p>
            <p
              className="inline-flex w-fit items-center rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 font-semibold text-amber-300"
            >
              {developedBy}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <FooterLinkItem key={`${link.label}-${link.to}`} link={link} compact />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const getSocialIcon = (label: string): LucideIcon => {
  const normalized = label.toLowerCase();

  if (normalized.includes('facebook')) return Globe2;
  if (normalized.includes('instagram')) return Globe2;
  if (normalized.includes('linkedin')) return Globe2;
  if (normalized.includes('youtube')) return Globe2;
  if (normalized.includes('whatsapp')) return MessageCircle;

  return Globe2;
};

const FooterLinkItem = ({
  link,
  compact = false,
}: {
  link: WebsiteFooterLink;
  compact?: boolean;
}) => {
  const className = compact
    ? 'transition hover:text-white'
    : 'group inline-flex items-center gap-2 rounded-lg py-1.5 text-sm leading-6 text-slate-300 transition hover:translate-x-1 hover:text-white';

  if (link.external) {
    return (
      <a href={link.to} target="_blank" rel="noreferrer" className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link
      to={link.to}
      className={className}
      onClick={() => {
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        });
      }}
    >
      {!compact ? <ArrowRight size={13} style={{ color: 'var(--jcst-accent)' }} /> : null}
      {link.label}
    </Link>
  );
};

const ContactLine = ({
  icon: Icon,
  value,
  href,
}: {
  icon: typeof MapPin;
  value: string;
  href?: string;
}) => {
  const content = (
    <>
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5"
        style={{ color: 'var(--jcst-accent)' }}
      >
        <Icon size={16} />
      </span>
      <span>{value}</span>
    </>
  );

  return href ? (
    <a href={href} className="flex items-start gap-3 leading-6 transition hover:text-white">
      {content}
    </a>
  ) : (
    <div className="flex items-start gap-3 leading-6">{content}</div>
  );
};