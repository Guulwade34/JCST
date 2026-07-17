import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { ApiSuccessResponse } from '@jcst/shared';
import { BadgeCheck } from 'lucide-react';
import { PageHero } from '@/components/public/PageHero';
import { PageError, PageLoading } from '@/components/common/PageState';
import { apiClient } from '@/services/apiClient';
import { useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';
import { contentText } from '@/features/website/contentValue';

interface Result {
  type: string;
  number: string;
  studentName: string;
  program: string;
  qualification: string;
  issueDate: string;
  status: string;
  details: Record<string, unknown>;
}

export const VerificationPage = ({ type }: { type: 'certificate' | 'transcript' }) => {
  const pageSlug = type === 'certificate' ? 'certificate-verification' : 'transcript-verification';
  const { text } = usePublicWebsite();
  const page = useWebsiteItem('page', pageSlug);
  const { register, handleSubmit } = useForm<{ number: string }>();

  const mutation = useMutation({
    mutationFn: async ({ number }: { number: string }) =>
      (
        await apiClient.get<ApiSuccessResponse<Result>>(`/public/verify/${type}`, {
          params: { number },
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
            {contentText(metadata, 'numberLabel')}
            <input className="input uppercase" {...register('number', { required: true })} />
          </label>

          <button
            type="submit"
            className="min-h-12 rounded-xl font-semibold text-white"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            {mutation.isPending
              ? contentText(metadata, 'verifyingLabel')
              : contentText(metadata, 'verifyLabel')}
          </button>

          {mutation.isError ? (
            <p className="rounded-xl bg-red-50 p-4 text-red-800">
              {contentText(metadata, 'notFoundMessage')}
            </p>
          ) : null}

          {mutation.data ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
              <BadgeCheck className="text-green-700" />
              <h2 className="mt-3 text-xl font-bold capitalize text-green-900">
                {mutation.data.status} {contentText(metadata, 'recordLabel')}
              </h2>
              <dl className="mt-5 grid gap-3 text-sm">
                <ResultRow
                  label={contentText(metadata, 'resultNumberLabel')}
                  value={mutation.data.number}
                />
                <ResultRow
                  label={contentText(metadata, 'studentLabel')}
                  value={mutation.data.studentName}
                />
                <ResultRow
                  label={contentText(metadata, 'programLabel')}
                  value={mutation.data.program}
                />
                <ResultRow
                  label={contentText(metadata, 'issueDateLabel')}
                  value={new Date(mutation.data.issueDate).toLocaleDateString()}
                />
              </dl>
            </div>
          ) : null}
        </form>
      </section>
    </>
  );
};

const ResultRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="font-bold">{label}</dt>
    <dd>{value}</dd>
  </div>
);
