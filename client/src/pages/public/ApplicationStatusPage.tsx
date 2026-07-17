import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { ApiSuccessResponse } from '@jcst/shared';
import { PageHero } from '@/components/public/PageHero';
import { PageError, PageLoading } from '@/components/common/PageState';
import { apiClient } from '@/services/apiClient';
import { useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';
import { contentText } from '@/features/website/contentValue';

interface Values {
  referenceNumber: string;
  email: string;
}

interface Status {
  referenceNumber: string;
  status: string;
  submittedAt: string;
}

export const ApplicationStatusPage = () => {
  const { text } = usePublicWebsite();
  const page = useWebsiteItem('page', 'application-status');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>();

  const mutation = useMutation({
    mutationFn: async (values: Values) =>
      (
        await apiClient.get<ApiSuccessResponse<Status>>('/public/applications/status', {
          params: values,
        })
      ).data.data,
  });

  if (page.isLoading) return <PageLoading />;
  if (page.isError || !page.data) return <PageError message={text('global.errors.page-load')} />;

  const metadata = page.data.metadata;

  return (
    <>
      <PageHero title={page.data.title} excerpt={page.data.excerpt} />
      <section className="py-16">
        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="mx-auto grid max-w-xl gap-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-premium"
        >
          <label className="grid gap-2 font-semibold">
            {contentText(metadata, 'referenceLabel')}
            <input
              className="input"
              {...register('referenceNumber', {
                required: contentText(metadata, 'referenceRequired'),
              })}
            />
            {errors.referenceNumber ? (
              <span className="text-sm text-red-700">{errors.referenceNumber.message}</span>
            ) : null}
          </label>

          <label className="grid gap-2 font-semibold">
            {contentText(metadata, 'emailLabel')}
            <input
              type="email"
              className="input"
              {...register('email', { required: contentText(metadata, 'emailRequired') })}
            />
            {errors.email ? (
              <span className="text-sm text-red-700">{errors.email.message}</span>
            ) : null}
          </label>

          <button
            type="submit"
            className="min-h-12 rounded-xl font-semibold text-white"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            {mutation.isPending
              ? contentText(metadata, 'checkingLabel')
              : contentText(metadata, 'submitLabel')}
          </button>

          {mutation.isError ? (
            <p className="rounded-xl bg-red-50 p-4 text-red-800">
              {contentText(metadata, 'notFoundMessage')}
            </p>
          ) : null}

          {mutation.data ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <p className="font-bold">{mutation.data.referenceNumber}</p>
              <p className="mt-2 capitalize">
                {contentText(metadata, 'statusLabel')}: {mutation.data.status}
              </p>
              <p className="mt-1 text-sm">
                {contentText(metadata, 'submittedLabel')}:{' '}
                {new Date(mutation.data.submittedAt).toLocaleString()}
              </p>
            </div>
          ) : null}
        </form>
      </section>
    </>
  );
};
