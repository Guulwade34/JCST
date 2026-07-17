import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Eye,
  Globe2,
  GraduationCap,
  Handshake,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { WebsiteContentRecord } from '@jcst/shared';
import { PageError, PageLoading } from '@/components/common/PageState';
import { useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

interface AboutBadge {
  label: string;
  icon: string;
}

interface AboutMetric {
  value: string;
  label: string;
  icon: string;
}

interface AboutFeature {
  title: string;
  description: string;
  icon: string;
}

interface AboutValue {
  title: string;
  description: string;
  icon: string;
}

export const AboutPage = () => {
  const query = useWebsiteItem('page', 'about');
  const { site, text } = usePublicWebsite();

  if (query.isLoading) {
    return <PageLoading />;
  }

  if (query.isError || !query.data) {
    return <PageError message={text('global.errors.page-load')} />;
  }

  const page = query.data;
  const metadata = page.metadata;
  const badges = getObjectArray<AboutBadge>(metadata, 'badges');
  const metrics = getObjectArray<AboutMetric>(metadata, 'metrics');
  const storyHighlights = getObjectArray<AboutFeature>(metadata, 'storyHighlights');
  const values = getObjectArray<AboutValue>(metadata, 'values');
  const approachItems = getObjectArray<AboutFeature>(metadata, 'approachItems');
  const impactItems = getStringArray(metadata, 'impactItems');

  return (
    <div className="overflow-x-clip">
      <AboutPageStyles />

      <AboutHero
        page={page}
        siteName={site.institutionName}
        establishedText={site.establishedText}
        address={site.address}
        badges={badges}
      />

      <MetricsSection metrics={metrics} />

      <StorySection
        page={page}
        highlights={storyHighlights}
      />

      <MissionVisionSection page={page} />

      <ValuesSection page={page} values={values} />

      <ApproachSection
        page={page}
        items={approachItems}
        impactItems={impactItems}
      />

      <AboutCta page={page} />
    </div>
  );
};

const AboutHero = ({
  page,
  siteName,
  establishedText,
  address,
  badges,
}: {
  page: WebsiteContentRecord;
  siteName: string;
  establishedText: string;
  address: string;
  badges: AboutBadge[];
}) => {
  const metadata = page.metadata;
  const heroImageUrl = getString(metadata, 'heroImageUrl') || page.imageUrl;
  const heroImageAlt = getString(metadata, 'heroImageAlt');

  return (
    <section
      className="relative isolate overflow-hidden text-white"
      style={{ background: 'var(--jcst-dark)' }}
    >
      <div className="absolute inset-0 -z-40 bg-[radial-gradient(circle_at_12%_18%,rgba(197,139,20,.2),transparent_28%),radial-gradient(circle_at_90%_12%,rgba(155,17,30,.3),transparent_34%),linear-gradient(135deg,rgba(8,47,99,.99),rgba(6,26,53,.99))]" />
      <div className="absolute inset-0 -z-30 opacity-[0.15] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto grid min-h-[640px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[.94fr_1.06fr] lg:px-8">
        <div className="about-hero-enter relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-sm font-semibold backdrop-blur-xl">
            <Sparkles size={15} style={{ color: 'var(--jcst-accent)' }} />
            <span style={{ color: 'var(--jcst-accent)' }}>
              {getString(metadata, 'eyebrow')}
            </span>
          </div>

          <h1 className="mt-7 max-w-3xl font-display text-4xl font-bold leading-[1.06] tracking-[-0.025em] sm:text-5xl lg:text-[3.7rem]">
            <span className="block">
              {getString(metadata, 'titleLineOne') || page.title}
            </span>
            <span
              className="mt-2 block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg,var(--jcst-accent),#fff2b6,var(--jcst-accent))',
              }}
            >
              {getString(metadata, 'titleLineTwo')}
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            {getString(metadata, 'heroDescription') || page.excerpt}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton to={getString(metadata, 'primaryUrl')}>
              {getString(metadata, 'primaryLabel')}
              <ArrowRight size={18} />
            </PrimaryButton>

            <SecondaryButton to={getString(metadata, 'secondaryUrl')}>
              {getString(metadata, 'secondaryLabel')}
              <ArrowRight size={18} />
            </SecondaryButton>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {badges.map((badge) => (
              <span
                key={`${badge.label}-${badge.icon}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-slate-300 backdrop-blur"
              >
                <CmsIcon
                  name={badge.icon}
                  size={14}
                  style={{ color: 'var(--jcst-accent)' }}
                />
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        <Reveal delay={120}>
          <div className="relative sm:pb-24">
            <div className="rounded-[34px] border border-white/12 bg-white/[0.05] p-4 shadow-[0_35px_90px_rgba(0,0,0,.35)] backdrop-blur-xl">
              <div className="group relative min-h-[460px] overflow-hidden rounded-[28px] bg-slate-900 sm:min-h-[520px]">
                <SmartImage
                  source={heroImageUrl}
                  alt={heroImageAlt}
                  className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105"
                  priority
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,18,38,.97),rgba(6,18,38,.18)_68%)]" />
                <div className="absolute inset-5 rounded-[22px] border border-white/15" />

                <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/60 px-3 py-2 text-xs font-bold uppercase tracking-[0.17em] backdrop-blur">
                    <BadgeCheck size={15} style={{ color: 'var(--jcst-accent)' }} />
                    {getString(metadata, 'imageEyebrow')}
                  </div>

                  <h2 className="mt-4 max-w-xl font-display text-3xl font-bold sm:text-4xl">
                    {getString(metadata, 'imageTitle')}
                  </h2>

                  <p className="mt-3 max-w-xl leading-7 text-slate-200">
                    {getString(metadata, 'imageDescription')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 items-stretch gap-3 sm:absolute sm:bottom-0 sm:left-6 sm:mt-0 sm:w-[460px]">
              <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 text-slate-900 shadow-[0_18px_48px_rgba(2,12,27,.20)] sm:p-4">
                <div className="flex h-full min-w-0 items-start gap-2.5 sm:items-center sm:gap-3">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white sm:h-11 sm:w-11"
                    style={{ background: 'var(--jcst-secondary)' }}
                  >
                    <CalendarDays size={20} />
                  </span>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      {getString(metadata, 'establishedLabel')}
                    </p>
                    <p className="mt-1 break-words text-[11px] font-bold leading-4 text-slate-800 sm:text-sm sm:leading-5">
                      {establishedText}
                    </p>
                  </div>
                </div>
              </article>

              <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 text-slate-900 shadow-[0_18px_48px_rgba(2,12,27,.20)] sm:p-4">
                <div className="flex h-full min-w-0 items-start gap-2.5 sm:items-center sm:gap-3">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white sm:h-11 sm:w-11"
                    style={{ background: 'var(--jcst-primary)' }}
                  >
                    <MapPin size={20} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      {getString(metadata, 'locationLabel')}
                    </p>
                    <p className="mt-1 break-words text-[11px] font-bold leading-4 text-slate-800 sm:text-sm sm:leading-5">
                      {address}
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <span className="sr-only">{siteName}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const MetricsSection = ({ metrics }: { metrics: AboutMetric[] }) => (
  <section className="border-b border-slate-200 bg-white py-8 sm:py-10">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:gap-4 sm:px-6 lg:grid-cols-4 lg:px-8">
      {metrics.map((metric, index) => (
        <Reveal key={`${metric.value}-${metric.label}`} delay={index * 70} className="h-full">
          <article className="group h-full min-w-0 rounded-[22px] border border-slate-200/90 bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,.05)] transition duration-300 hover:-translate-y-1 hover:border-[var(--jcst-accent)] hover:shadow-[0_16px_36px_rgba(15,23,42,.09)] sm:p-5">
            <div className="flex h-full min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 sm:h-12 sm:w-12 sm:rounded-2xl"
                style={{ color: 'var(--jcst-secondary)' }}
              >
                <CmsIcon name={metric.icon} size={20} />
              </span>

              <div className="min-w-0">
                <p
                  className="break-words font-display text-lg font-bold leading-tight sm:text-xl lg:text-2xl"
                  style={{ color: 'var(--jcst-primary)' }}
                >
                  {metric.value}
                </p>
                <p className="mt-1 break-words text-[11px] font-semibold leading-4 text-slate-600 sm:text-sm sm:leading-5">
                  {metric.label}
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  </section>
);

const StorySection = ({
  page,
  highlights,
}: {
  page: WebsiteContentRecord;
  highlights: AboutFeature[];
}) => {
  const metadata = page.metadata;
  const imageUrl = getString(metadata, 'storyImageUrl');
  const imageAlt = getString(metadata, 'storyImageAlt');

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="absolute right-0 top-8 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[.95fr_1.05fr] lg:px-8">
        <Reveal>
          <div className="relative">
            <div className="group relative min-h-[430px] overflow-hidden rounded-[34px] sm:min-h-[500px] border border-slate-200 bg-slate-100 shadow-[0_24px_65px_rgba(15,23,42,.14)]">
              <SmartImage
                source={imageUrl}
                alt={imageAlt}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.86),transparent_68%)]" />
              <div className="absolute inset-4 rounded-[22px] border border-white/25 sm:inset-5 sm:rounded-[25px]" />

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-9">
                <p
                  className="text-xs font-bold uppercase tracking-[0.18em]"
                  style={{ color: 'var(--jcst-accent)' }}
                >
                  {getString(metadata, 'storyImageEyebrow')}
                </p>
                <h3 className="mt-2 max-w-[90%] font-display text-2xl font-bold leading-tight sm:text-3xl">
                  {getString(metadata, 'storyImageTitle')}
                </h3>
              </div>
            </div>

            <div className="ml-auto mt-4 w-full rounded-[22px] border border-slate-200 bg-white p-4 shadow-xl sm:max-w-[360px] sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-jcst-crimson">
                {getString(metadata, 'storyCardEyebrow')}
              </p>
              <p
                className="mt-2 font-display text-lg font-bold leading-snug sm:text-xl"
                style={{ color: 'var(--jcst-primary)' }}
              >
                {getString(metadata, 'storyCardTitle')}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div>
            <SectionHeading
              eyebrow={getString(metadata, 'storyEyebrow')}
              title={getString(metadata, 'storyTitle')}
              description={getString(metadata, 'storyDescription') || page.body}
            />

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {highlights.map((item) => (
                <FeatureCard
                  key={`${item.title}-${item.icon}`}
                  item={item}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const MissionVisionSection = ({ page }: { page: WebsiteContentRecord }) => {
  const metadata = page.metadata;

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow={getString(metadata, 'directionEyebrow')}
              title={getString(metadata, 'directionTitle')}
              description={getString(metadata, 'directionDescription')}
              centered
            />
          </div>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-7 lg:grid-cols-2">
          <Reveal className="h-full">
            <article
              className="relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[32px] p-8 text-white shadow-[0_24px_60px_rgba(6,26,53,.2)] sm:p-10"
              style={{ background: 'var(--jcst-primary)' }}
            >
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
              <span
                className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white/10"
                style={{ color: 'var(--jcst-accent)' }}
              >
                <Target size={25} />
              </span>

              <p
                className="relative mt-8 text-xs font-bold uppercase tracking-[0.19em]"
                style={{ color: 'var(--jcst-accent)' }}
              >
                {getString(metadata, 'missionEyebrow')}
              </p>

              <h2 className="relative mt-4 font-display text-3xl font-bold sm:text-4xl">
                {getString(metadata, 'missionTitle')}
              </h2>

              <p className="relative mt-5 text-base leading-8 text-slate-200 sm:text-lg">
                {getString(metadata, 'missionBody')}
              </p>
            </article>
          </Reveal>

          <Reveal delay={100} className="h-full">
            <article className="relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_52px_rgba(15,23,42,.09)] sm:p-10">
              <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-red-100/80 blur-3xl" />

              <span
                className="relative grid h-14 w-14 place-items-center rounded-2xl bg-red-50"
                style={{ color: 'var(--jcst-secondary)' }}
              >
                <Eye size={25} />
              </span>

              <p className="relative mt-8 text-xs font-bold uppercase tracking-[0.19em] text-jcst-crimson">
                {getString(metadata, 'visionEyebrow')}
              </p>

              <h2
                className="relative mt-4 font-display text-3xl font-bold sm:text-4xl"
                style={{ color: 'var(--jcst-primary)' }}
              >
                {getString(metadata, 'visionTitle')}
              </h2>

              <p className="relative mt-5 text-base leading-8 text-slate-600 sm:text-lg">
                {getString(metadata, 'visionBody')}
              </p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const ValuesSection = ({
  page,
  values,
}: {
  page: WebsiteContentRecord;
  values: AboutValue[];
}) => {
  const metadata = page.metadata;

  return (
    <section
      className="relative isolate overflow-hidden py-20 text-white sm:py-24"
      style={{ background: 'var(--jcst-dark)' }}
    >
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(circle,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:30px_30px]" />
      <div className="absolute -right-44 -top-44 -z-20 h-[500px] w-[500px] rounded-full bg-red-800/25 blur-[130px]" />
      <div className="absolute -bottom-48 -left-44 -z-20 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow={getString(metadata, 'valuesEyebrow')}
              title={getString(metadata, 'valuesTitle')}
              description={getString(metadata, 'valuesDescription')}
              inverse
              centered
            />
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 items-stretch gap-4 lg:grid-cols-4">
          {values.map((value, index) => (
            <Reveal
              key={`${value.title}-${value.icon}`}
              delay={index * 70}
              className="h-full"
            >
              <article className="group flex h-full min-h-[220px] flex-col rounded-[24px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-1.5 hover:border-[var(--jcst-accent)] hover:bg-white/[0.09]">
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.08]"
                  style={{ color: 'var(--jcst-accent)' }}
                >
                  <CmsIcon name={value.icon} size={22} />
                </span>

                <h3 className="mt-5 text-lg font-bold">{value.title}</h3>

                <p className="mt-3 text-xs leading-6 text-slate-300 sm:text-sm sm:leading-7">
                  {value.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const ApproachSection = ({
  page,
  items,
  impactItems,
}: {
  page: WebsiteContentRecord;
  items: AboutFeature[];
  impactItems: string[];
}) => {
  const metadata = page.metadata;
  const imageUrl = getString(metadata, 'approachImageUrl');
  const imageAlt = getString(metadata, 'approachImageAlt');

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="absolute left-0 top-1/3 h-80 w-80 rounded-full bg-red-100/60 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div>
            <SectionHeading
              eyebrow={getString(metadata, 'approachEyebrow')}
              title={getString(metadata, 'approachTitle')}
              description={getString(metadata, 'approachDescription')}
            />

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {items.map((item) => (
                <FeatureCard
                  key={`${item.title}-${item.icon}`}
                  item={item}
                />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative">
            <div className="group relative min-h-[500px] overflow-hidden rounded-[34px] sm:min-h-[530px] border border-slate-200 bg-slate-100 shadow-[0_24px_65px_rgba(15,23,42,.14)]">
              <SmartImage
                source={imageUrl}
                alt={imageAlt}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.94),rgba(6,26,53,.08)_68%)]" />
              <div className="absolute inset-4 rounded-[22px] border border-white/25 sm:inset-5 sm:rounded-[25px]" />

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-9">
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.18em]"
                  style={{ color: 'var(--jcst-accent)' }}
                >
                  {getString(metadata, 'impactEyebrow')}
                </p>

                <h3 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-3xl">
                  {getString(metadata, 'impactTitle')}
                </h3>

                <div className="mt-6 grid gap-3">
                  {impactItems.slice(0, 3).map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={18}
                        className="mt-1 shrink-0"
                        style={{ color: 'var(--jcst-accent)' }}
                      />
                      <p className="text-sm leading-6 text-slate-200 sm:text-base sm:leading-7">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ml-auto mt-4 w-full rounded-[22px] border border-slate-200 bg-white p-4 shadow-xl sm:max-w-[360px] sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-jcst-crimson">
                {getString(metadata, 'impactCardEyebrow')}
              </p>

              <p
                className="mt-2 font-display text-lg font-bold leading-snug sm:text-xl"
                style={{ color: 'var(--jcst-primary)' }}
              >
                {getString(metadata, 'impactCardTitle')}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const AboutCta = ({ page }: { page: WebsiteContentRecord }) => {
  const metadata = page.metadata;
  const backgroundImage = getString(metadata, 'ctaImageUrl');

  return (
    <section className="relative isolate overflow-hidden py-20 text-white sm:py-24">
      <SmartImage
        source={backgroundImage}
        alt={getString(metadata, 'ctaImageAlt')}
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(6,26,53,.99),rgba(8,47,99,.94)_58%,rgba(155,17,30,.86))]" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Sparkles size={16} style={{ color: 'var(--jcst-accent)' }} />
              <span style={{ color: 'var(--jcst-accent)' }}>
                {getString(metadata, 'ctaEyebrow')}
              </span>
            </div>

            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
              {getString(metadata, 'ctaTitle')}
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              {getString(metadata, 'ctaDescription')}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton to={getString(metadata, 'ctaPrimaryUrl')}>
                {getString(metadata, 'ctaPrimaryLabel')}
                <ArrowRight size={18} />
              </PrimaryButton>

              <SecondaryButton to={getString(metadata, 'ctaSecondaryUrl')}>
                {getString(metadata, 'ctaSecondaryLabel')}
                <ArrowRight size={18} />
              </SecondaryButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const SectionHeading = ({
  eyebrow,
  title,
  description,
  inverse = false,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  inverse?: boolean;
  centered?: boolean;
}) => (
  <div className={centered ? 'text-center' : ''}>
    <p
      className="text-xs font-bold uppercase tracking-[0.19em]"
      style={{ color: 'var(--jcst-accent)' }}
    >
      {eyebrow}
    </p>

    <h2
      className={`mt-4 font-display text-2xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl lg:text-[2.65rem] ${
        inverse ? 'text-white' : ''
      }`}
      style={inverse ? undefined : { color: 'var(--jcst-primary)' }}
    >
      {title}
    </h2>

    <p
      className={`mt-5 text-base leading-8 sm:text-lg ${
        inverse ? 'text-slate-300' : 'text-slate-600'
      }`}
    >
      {description}
    </p>
  </div>
);

const FeatureCard = ({ item }: { item: AboutFeature }) => (
  <article className="group h-full rounded-[20px] border border-slate-200/90 bg-slate-50 p-4 sm:p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--jcst-accent)] hover:bg-white hover:shadow-[0_14px_34px_rgba(15,23,42,.08)]">
    <span
      className="grid h-11 w-11 place-items-center rounded-xl bg-white shadow-sm"
      style={{ color: 'var(--jcst-secondary)' }}
    >
      <CmsIcon name={item.icon} size={19} />
    </span>

    <h3
      className="mt-3 text-sm font-bold sm:mt-4 sm:text-base"
      style={{ color: 'var(--jcst-primary)' }}
    >
      {item.title}
    </h3>

    <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm sm:leading-7">
      {item.description}
    </p>
  </article>
);

const PrimaryButton = ({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) => (
  <Link
    to={to}
    className="about-button-shine group relative inline-flex min-h-[54px] items-center justify-center gap-2 overflow-hidden rounded-xl px-7 font-semibold text-white shadow-xl transition duration-300 hover:-translate-y-1"
    style={{ background: 'var(--jcst-secondary)' }}
  >
    <span className="relative z-10 inline-flex items-center gap-2">
      {children}
    </span>
  </Link>
);

const SecondaryButton = ({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) => (
  <Link
    to={to}
    className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl border bg-white/[0.07] px-7 font-semibold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.13]"
    style={{ borderColor: 'var(--jcst-accent)' }}
  >
    {children}
  </Link>
);

const Reveal = ({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const supportsIntersectionObserver =
    typeof window !== 'undefined' && 'IntersectionObserver' in window;
  const [visible, setVisible] = useState(!supportsIntersectionObserver);

  useEffect(() => {
    const element = elementRef.current;

    if (!element || !supportsIntersectionObserver) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -35px 0px',
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [supportsIntersectionObserver]);

  return (
    <div
      ref={elementRef}
      className={`about-reveal ${visible ? 'about-reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const SmartImage = ({
  source,
  alt,
  className,
  priority = false,
}: {
  source: string;
  alt: string;
  className: string;
  priority?: boolean;
}) => {
  const [failed, setFailed] = useState(false);

  if (!source || failed) {
    return (
      <div
        role="img"
        aria-label={alt || 'JCST branded visual'}
        className={`${className} isolate overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(212,175,55,.24),transparent_27%),radial-gradient(circle_at_82%_22%,rgba(181,18,27,.22),transparent_29%),linear-gradient(145deg,#123f72,#0a2c56_58%,#061a35)]`}
      >
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-24 w-24 place-items-center rounded-[26px] border border-white/15 bg-white/[0.10] shadow-2xl backdrop-blur-xl sm:h-28 sm:w-28">
            <img
              src="/branding/jcst-logo.png"
              alt=""
              aria-hidden="true"
              className="h-16 w-16 rounded-2xl bg-white/95 object-contain p-2 shadow-xl sm:h-20 sm:w-20"
            />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-slate-950/45 to-transparent" />
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

const getString = (
  metadata: Record<string, unknown>,
  key: string,
): string => {
  const value = metadata[key];
  return typeof value === 'string' ? value : '';
};

const getStringArray = (
  metadata: Record<string, unknown>,
  key: string,
): string[] => {
  const value = metadata[key];

  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
};

const getObjectArray = <T extends object>(
  metadata: Record<string, unknown>,
  key: string,
): T[] => {
  const value = metadata[key];

  return Array.isArray(value)
    ? value.filter(
        (item): item is T =>
          Boolean(item) &&
          typeof item === 'object' &&
          !Array.isArray(item),
      )
    : [];
};

const CmsIcon = ({
  name,
  size,
  className,
  style,
}: {
  name: string;
  size: number;
  className?: string;
  style?: CSSProperties;
}) => {
  const props = {
    size,
    className,
    style,
    'aria-hidden': true as const,
  };

  const icons: Record<string, LucideIcon> = {
    award: Award,
    badge: BadgeCheck,
    book: BookOpenCheck,
    briefcase: BriefcaseBusiness,
    calendar: CalendarDays,
    check: CheckCircle2,
    globe: Globe2,
    graduation: GraduationCap,
    handshake: Handshake,
    innovation: Lightbulb,
    location: MapPin,
    shield: ShieldCheck,
    target: Target,
    users: Users,
  };

  const Icon = icons[name] ?? Sparkles;

  return <Icon {...props} />;
};

const AboutPageStyles = () => (
  <style>{`
    @keyframes aboutHeroEnter {
      from {
        opacity: 0;
        transform: translateY(24px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .about-hero-enter {
      animation: aboutHeroEnter 760ms ease-out both;
    }

    .about-reveal {
      opacity: 0;
      transform: translateY(28px);
      transition:
        opacity 680ms ease,
        transform 680ms cubic-bezier(.2,.75,.25,1);
    }

    .about-reveal-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .about-button-shine::after {
      content: '';
      position: absolute;
      top: -80%;
      left: -45%;
      width: 28%;
      height: 260%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255,255,255,.32),
        transparent
      );
      transform: rotate(22deg);
      transition: left 650ms ease;
    }

    .about-button-shine:hover::after {
      left: 125%;
    }

    @media (prefers-reduced-motion: reduce) {
      .about-hero-enter {
        animation: none !important;
      }

      .about-reveal {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }
  `}</style>
);