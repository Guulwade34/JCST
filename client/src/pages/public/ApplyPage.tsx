import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { ApiSuccessResponse, PublicApplicationInput } from '@jcst/shared';
import { PageHero } from '@/components/public/PageHero';
import { PageError, PageLoading } from '@/components/common/PageState';
import { apiClient } from '@/services/apiClient';
import { useWebsiteCollection, useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';
import { contentStrings, contentText } from '@/features/website/contentValue';

export const ApplyPage = () => {
  const { text } = usePublicWebsite();
  const page = useWebsiteItem('page', 'apply');
  const programs = useWebsiteCollection('program');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PublicApplicationInput>();

  const mutation = useMutation({
    mutationFn: async (values: PublicApplicationInput) =>
      (
        await apiClient.post<ApiSuccessResponse<{ referenceNumber: string }>>(
          '/public/applications',
          values,
        )
      ).data.data,
    onSuccess: () => reset(),
  });

  if (page.isLoading || programs.isLoading) return <PageLoading />;
  if (page.isError || programs.isError || !page.data) {
    return <PageError message={text('global.errors.page-load')} />;
  }

  const metadata = page.data.metadata;
  const studyModes = contentStrings(metadata, 'studyModes');
  const intakes = contentStrings(metadata, 'intakes');

  return (
    <>
      <PageHero title={page.data.title} excerpt={page.data.excerpt} />
      <section className="bg-slate-50 py-16">
        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="mx-auto grid max-w-3xl gap-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-premium sm:p-10"
        >
          {mutation.isSuccess ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-800">
              {contentText(metadata, 'successPrefix')}{' '}
              <strong>{mutation.data.referenceNumber}</strong>{' '}
              {contentText(metadata, 'successSuffix')}
            </div>
          ) : null}
          {mutation.isError ? (
            <div className="rounded-xl bg-red-50 p-4 text-red-800">
              {contentText(metadata, 'errorMessage')}
            </div>
          ) : null}

          <Field label={contentText(metadata, 'fullNameLabel')} error={errors.fullName?.message}>
            <input
              {...register('fullName', {
                required: contentText(metadata, 'fullNameRequired'),
                minLength: { value: 3, message: contentText(metadata, 'fullNameMinLength') },
              })}
              className="input"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={contentText(metadata, 'emailLabel')} error={errors.email?.message}>
              <input
                type="email"
                {...register('email', { required: contentText(metadata, 'emailRequired') })}
                className="input"
              />
            </Field>
            <Field label={contentText(metadata, 'phoneLabel')} error={errors.phone?.message}>
              <input
                {...register('phone', { required: contentText(metadata, 'phoneRequired') })}
                className="input"
              />
            </Field>
          </div>

          <Field label={contentText(metadata, 'programLabel')} error={errors.programSlug?.message}>
            <select
              {...register('programSlug', { required: contentText(metadata, 'programRequired') })}
              className="input"
            >
              <option value="">{contentText(metadata, 'programPlaceholder')}</option>
              {programs.data?.map((program) => (
                <option key={program.id} value={program.slug}>
                  {program.title}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={contentText(metadata, 'studyModeLabel')}>
              <select {...register('studyMode')} className="input">
                {studyModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={contentText(metadata, 'intakeLabel')}>
              <select {...register('intake')} className="input">
                {intakes.map((intake) => (
                  <option key={intake} value={intake}>
                    {intake}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label={contentText(metadata, 'previousEducationLabel')}
            error={errors.previousEducation?.message}
          >
            <textarea
              {...register('previousEducation', {
                required: contentText(metadata, 'previousEducationRequired'),
              })}
              rows={3}
              className="input"
            />
          </Field>

          <Field label={contentText(metadata, 'messageLabel')}>
            <textarea {...register('message')} rows={4} className="input" />
          </Field>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="min-h-12 rounded-xl px-6 font-semibold text-white disabled:opacity-60"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            {mutation.isPending
              ? contentText(metadata, 'submittingLabel')
              : contentText(metadata, 'submitLabel')}
          </button>
        </form>
      </section>
    </>
  );
};

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) => (
  <label className="grid gap-2 text-sm font-semibold text-slate-700">
    <span>{label}</span>
    {children}
    {error ? <span className="text-red-700">{error}</span> : null}
  </label>
);
