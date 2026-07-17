import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { ApiSuccessResponse, ContactMessageInput } from '@jcst/shared';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PageHero } from '@/components/public/PageHero';
import { PageError, PageLoading } from '@/components/common/PageState';
import { apiClient } from '@/services/apiClient';
import { useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';
import { contentText } from '@/features/website/contentValue';

export const ContactPage = () => {
  const { site, text } = usePublicWebsite();
  const page = useWebsiteItem('page', 'contact');
  const { register, handleSubmit, reset } = useForm<ContactMessageInput>();
  const mutation = useMutation({
    mutationFn: async (values: ContactMessageInput) =>
      (
        await apiClient.post<ApiSuccessResponse<{ referenceNumber: string }>>(
          '/public/contact',
          values,
        )
      ).data.data,
    onSuccess: () => reset(),
  });

  if (page.isLoading) return <PageLoading />;
  if (page.isError || !page.data) return <PageError message={text('global.errors.page-load')} />;

  const metadata = page.data.metadata;

  return (
    <>
      <PageHero title={page.data.title} excerpt={page.data.excerpt} />
      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[.75fr_1.25fr]">
          <aside className="rounded-3xl p-8 text-white" style={{ background: 'var(--jcst-dark)' }}>
            <h2 className="font-display text-2xl font-bold">
              {contentText(metadata, 'contactPanelTitle')}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {contentText(metadata, 'contactPanelDescription')}
            </p>
            <div className="mt-7 grid gap-4 text-slate-300">
              <ContactDetail icon={MapPin} value={site.address} />
              <ContactDetail icon={Phone} value={site.phone} href={site.phone ? `tel:${site.phone.replace(/[^\d+]/g, '')}` : undefined} />
              <ContactDetail icon={Mail} value={site.email} href={site.email ? `mailto:${site.email}` : undefined} />
              <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                {site.officeHours}
              </p>
            </div>
          </aside>

          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-premium"
          >
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              {contentText(metadata, 'fullNameLabel')}
              <input
                className="input"
                placeholder={contentText(metadata, 'fullNamePlaceholder')}
                {...register('fullName', { required: true })}
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                {contentText(metadata, 'emailLabel')}
                <input
                  className="input"
                  type="email"
                  placeholder={contentText(metadata, 'emailPlaceholder')}
                  {...register('email', { required: true })}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                {contentText(metadata, 'phoneLabel')}
                <input
                  className="input"
                  placeholder={contentText(metadata, 'phonePlaceholder')}
                  {...register('phone')}
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              {contentText(metadata, 'subjectLabel')}
              <input
                className="input"
                placeholder={contentText(metadata, 'subjectPlaceholder')}
                {...register('subject', { required: true })}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              {contentText(metadata, 'messageLabel')}
              <textarea
                className="input"
                rows={6}
                placeholder={contentText(metadata, 'messagePlaceholder')}
                {...register('message', { required: true, minLength: 10 })}
              />
            </label>
            <button
              type="submit"
              className="min-h-12 rounded-xl font-semibold text-white"
              style={{ background: 'var(--jcst-secondary)' }}
            >
              {mutation.isPending
                ? contentText(metadata, 'submittingLabel')
                : contentText(metadata, 'submitLabel')}
            </button>
            {mutation.data ? (
              <p className="rounded-xl bg-green-50 p-4 text-green-800">
                {contentText(metadata, 'successPrefix')}{' '}
                <strong>{mutation.data.referenceNumber}</strong>
              </p>
            ) : null}
            {mutation.isError ? (
              <p className="rounded-xl bg-red-50 p-4 text-red-800">
                {contentText(metadata, 'errorMessage')}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </>
  );
};

const ContactDetail = ({ icon: Icon, value, href }: { icon: typeof MapPin; value: string; href?: string | undefined }) => (
  <div className="flex items-center gap-3">
    <span
      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10"
      style={{ color: 'var(--jcst-accent)' }}
    >
      <Icon size={18} />
    </span>
    {href ? <a href={href} className="break-words transition hover:text-white hover:underline">{value}</a> : <span>{value}</span>}
  </div>
);
