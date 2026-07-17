import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Globe2,
  GraduationCap,
  ImageIcon,
  Laptop2,
  Layers3,
  LibraryBig,
  Lightbulb,
  MonitorPlay,
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

interface AcademicBadge {
  label: string;
  icon: string;
}

interface AcademicMetric {
  value: string;
  label: string;
  icon: string;
}

interface AcademicFeature {
  title: string;
  description: string;
  icon: string;
}

interface AcademicStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

export const AcademicsPage = () => {
  const query = useWebsiteItem('page', 'academics');
  const { site, text } = usePublicWebsite();

  if (query.isLoading) {
    return <PageLoading />;
  }

  if (query.isError || !query.data) {
    return <PageError message={text('global.errors.page-load')} />;
  }

  const page = query.data;
  const metadata = page.metadata;
  const badges = getObjectArray<AcademicBadge>(metadata, 'badges');
  const metrics = getObjectArray<AcademicMetric>(metadata, 'metrics');
  const pillars = getObjectArray<AcademicFeature>(metadata, 'pillars');
  const experience = getObjectArray<AcademicFeature>(metadata, 'experienceItems');
  const schools = getObjectArray<AcademicFeature>(metadata, 'schools');
  const steps = getObjectArray<AcademicStep>(metadata, 'journeySteps');
  const assurance = getObjectArray<AcademicFeature>(metadata, 'assuranceItems');

  return (
    <div className="overflow-x-clip bg-white">
      <AcademicsPageStyles />

      <AcademicsHero
        page={page}
        siteName={site.institutionName}
        badges={badges}
      />

      <MetricsSection metrics={metrics} />

      <AcademicPillarsSection
        page={page}
        pillars={pillars}
      />

      <LearningExperienceSection
        page={page}
        items={experience}
      />

      <SchoolsSection
        page={page}
        schools={schools}
      />

      <JourneySection
        page={page}
        steps={steps}
      />

      <QualitySection
        page={page}
        items={assurance}
      />

      <AcademicsCta page={page} />
    </div>
  );
};

const AcademicsHero = ({
  page,
  siteName,
  badges,
}: {
  page: WebsiteContentRecord;
  siteName: string;
  badges: AcademicBadge[];
}) => {
  const metadata = page.metadata;
  const heroImageUrl = getString(metadata, 'heroImageUrl') || page.imageUrl;

  return (
    <section className="relative isolate overflow-hidden text-white" style={{ background: 'var(--jcst-dark)' }}>
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_15%_16%,rgba(197,139,20,.18),transparent_26%),radial-gradient(circle_at_88%_12%,rgba(155,17,30,.28),transparent_34%),linear-gradient(135deg,rgba(8,47,99,.99),rgba(6,26,53,.99))]" />
      <div className="absolute inset-0 -z-20 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[.94fr_1.06fr] lg:px-8 lg:py-24">
        <div className="academics-hero-enter relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-sm font-semibold backdrop-blur-xl">
            <Sparkles size={15} style={{ color: 'var(--jcst-accent)' }} />
            <span style={{ color: 'var(--jcst-accent)' }}>{getString(metadata, 'eyebrow')}</span>
          </div>

          <h1 className="mt-7 max-w-3xl font-display text-4xl font-bold leading-[1.04] tracking-[-0.03em] sm:text-5xl lg:text-[3.8rem]">
            <span className="block">{getString(metadata, 'titleLineOne') || page.title}</span>
            <span
              className="mt-2 block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg,var(--jcst-accent),#fff4c8,var(--jcst-accent))',
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
                <CmsIcon name={badge.icon} size={14} style={{ color: 'var(--jcst-accent)' }} />
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        <Reveal delay={120}>
          <div className="relative">
            <div className="rounded-[34px] border border-white/12 bg-white/[0.05] p-4 shadow-[0_35px_90px_rgba(0,0,0,.35)] backdrop-blur-xl">
              <div className="group relative min-h-[500px] overflow-hidden rounded-[28px] bg-slate-900">
                <SmartImage
                  source={heroImageUrl}
                  alt={getString(metadata, 'heroImageAlt')}
                  className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105"
                  priority
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,18,38,.97),rgba(6,18,38,.18)_68%)]" />
                <div className="absolute inset-4 rounded-[24px] border border-white/20 sm:inset-5 sm:rounded-[25px]" />

                <div className="absolute right-4 top-4 rounded-2xl border border-white/15 bg-slate-950/55 px-4 py-3 text-sm font-semibold shadow-xl backdrop-blur sm:right-6 sm:top-6">
                  <div className="flex items-center gap-2">
                    <MonitorPlay size={16} style={{ color: 'var(--jcst-accent)' }} />
                    <span>{getString(metadata, 'heroFloatingLabel')}</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/60 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] backdrop-blur sm:text-xs sm:tracking-[0.18em]">
                    <BadgeCheck size={15} style={{ color: 'var(--jcst-accent)' }} />
                    {getString(metadata, 'imageEyebrow')}
                  </div>

                  <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-tight sm:text-4xl">
                    {getString(metadata, 'imageTitle')}
                  </h2>

                  <p className="mt-3 max-w-xl leading-7 text-slate-200">
                    {getString(metadata, 'imageDescription')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:absolute sm:bottom-0 sm:left-6 sm:mt-0 sm:w-[460px]">
              <MiniInfoCard
                icon={<Laptop2 size={20} />}
                label={getString(metadata, 'infoCardOneLabel')}
                value={getString(metadata, 'infoCardOneValue')}
                background="var(--jcst-secondary)"
              />

              <MiniInfoCard
                icon={<GraduationCap size={20} />}
                label={getString(metadata, 'infoCardTwoLabel')}
                value={getString(metadata, 'infoCardTwoValue')}
                background="var(--jcst-primary)"
              />
            </div>

            <span className="sr-only">{siteName}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const MiniInfoCard = ({
  icon,
  label,
  value,
  background,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  background: string;
}) => (
  <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 text-slate-900 shadow-[0_18px_48px_rgba(2,12,27,.20)] sm:p-4">
    <div className="flex h-full min-w-0 items-start gap-2.5 sm:items-center sm:gap-3">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white sm:h-11 sm:w-11"
        style={{ background }}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">{label}</p>
        <p className="mt-1 break-words text-[11px] font-bold leading-4 text-slate-800 sm:text-sm sm:leading-5">{value}</p>
      </div>
    </div>
  </article>
);

const MetricsSection = ({ metrics }: { metrics: AcademicMetric[] }) => (
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
                <p className="break-words font-display text-lg font-bold leading-tight sm:text-xl lg:text-2xl" style={{ color: 'var(--jcst-primary)' }}>
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

const AcademicPillarsSection = ({
  page,
  pillars,
}: {
  page: WebsiteContentRecord;
  pillars: AcademicFeature[];
}) => {
  const metadata = page.metadata;

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="absolute right-0 top-8 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow={getString(metadata, 'pillarsEyebrow')}
              title={getString(metadata, 'pillarsTitle')}
              description={getString(metadata, 'pillarsDescription')}
              centered
            />
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar, index) => (
            <Reveal key={`${pillar.title}-${pillar.icon}`} delay={index * 70} className="h-full">
              <article className="group h-full rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,.06)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--jcst-accent)] hover:shadow-[0_24px_52px_rgba(15,23,42,.1)]">
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50"
                  style={{ color: 'var(--jcst-secondary)' }}
                >
                  <CmsIcon name={pillar.icon} size={22} />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const LearningExperienceSection = ({
  page,
  items,
}: {
  page: WebsiteContentRecord;
  items: AcademicFeature[];
}) => {
  const metadata = page.metadata;

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:px-8">
        <Reveal>
          <div>
            <SectionHeading
              eyebrow={getString(metadata, 'experienceEyebrow')}
              title={getString(metadata, 'experienceTitle')}
              description={getString(metadata, 'experienceDescription')}
            />

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {items.map((item) => (
                <FeatureCard key={`${item.title}-${item.icon}`} item={item} />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative">
            <div className="group relative min-h-[500px] overflow-hidden rounded-[34px] border border-slate-200 bg-slate-100 shadow-[0_24px_65px_rgba(15,23,42,.14)] sm:min-h-[540px]">
              <SmartImage
                source={getString(metadata, 'experienceImageUrl')}
                alt={getString(metadata, 'experienceImageAlt')}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.94),rgba(6,26,53,.08)_68%)]" />
              <div className="absolute inset-4 rounded-[22px] border border-white/25 sm:inset-5 sm:rounded-[25px]" />

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-9">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.18em]" style={{ color: 'var(--jcst-accent)' }}>
                  {getString(metadata, 'experienceImageEyebrow')}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-3xl">
                  {getString(metadata, 'experienceImageTitle')}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-base sm:leading-7">
                  {getString(metadata, 'experienceImageDescription')}
                </p>
              </div>
            </div>

            <div className="ml-auto mt-4 w-full rounded-[22px] border border-slate-200 bg-white p-4 shadow-xl sm:max-w-[360px] sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-jcst-crimson">
                {getString(metadata, 'experienceCardEyebrow')}
              </p>
              <p className="mt-2 font-display text-lg font-bold leading-snug sm:text-xl" style={{ color: 'var(--jcst-primary)' }}>
                {getString(metadata, 'experienceCardTitle')}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const SchoolsSection = ({
  page,
  schools,
}: {
  page: WebsiteContentRecord;
  schools: AcademicFeature[];
}) => {
  const metadata = page.metadata;

  return (
    <section className="relative isolate overflow-hidden py-16 text-white sm:py-20" style={{ background: 'var(--jcst-dark)' }}>
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(circle,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:30px_30px]" />
      <div className="absolute -right-44 -top-44 -z-20 h-[500px] w-[500px] rounded-full bg-red-800/25 blur-[130px]" />
      <div className="absolute -bottom-48 -left-44 -z-20 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow={getString(metadata, 'schoolsEyebrow')}
              title={getString(metadata, 'schoolsTitle')}
              description={getString(metadata, 'schoolsDescription')}
              inverse
              centered
            />
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {schools.map((school, index) => (
            <Reveal key={`${school.title}-${school.icon}`} delay={index * 70} className="h-full">
              <article className="group flex h-full flex-col rounded-[24px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-1.5 hover:border-[var(--jcst-accent)] hover:bg-white/[0.09]">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.08]" style={{ color: 'var(--jcst-accent)' }}>
                  <CmsIcon name={school.icon} size={22} />
                </span>
                <h3 className="mt-5 text-lg font-bold">{school.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{school.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                  <span>Learn more</span>
                  <ChevronRight size={16} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const JourneySection = ({
  page,
  steps,
}: {
  page: WebsiteContentRecord;
  steps: AcademicStep[];
}) => {
  const metadata = page.metadata;

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="absolute left-0 top-1/3 h-80 w-80 rounded-full bg-red-100/60 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow={getString(metadata, 'journeyEyebrow')}
              title={getString(metadata, 'journeyTitle')}
              description={getString(metadata, 'journeyDescription')}
              centered
            />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={`${step.step}-${step.title}`} delay={index * 70} className="h-full">
              <article className="relative h-full rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,.06)]">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50" style={{ color: 'var(--jcst-secondary)' }}>
                    <CmsIcon name={step.icon} size={21} />
                  </span>
                  <span className="inline-flex rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-jcst-crimson">
                    {step.step}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const QualitySection = ({
  page,
  items,
}: {
  page: WebsiteContentRecord;
  items: AcademicFeature[];
}) => {
  const metadata = page.metadata;

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[.96fr_1.04fr] lg:px-8">
        <Reveal>
          <div className="relative">
            <div className="rounded-[34px] border border-slate-200 bg-white p-4 shadow-[0_24px_65px_rgba(15,23,42,.14)]">
              <div className="group relative min-h-[500px] overflow-hidden rounded-[28px] bg-slate-900 sm:min-h-[540px]">
                <SmartImage
                  source={getString(metadata, 'qualityImageUrl')}
                  alt={getString(metadata, 'qualityImageAlt')}
                  className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,18,38,.97),rgba(6,18,38,.18)_68%)]" />
                <div className="absolute inset-4 rounded-[24px] border border-white/20 sm:inset-5 sm:rounded-[25px]" />

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/60 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] backdrop-blur sm:text-xs sm:tracking-[0.18em]">
                    <ShieldCheck size={15} style={{ color: 'var(--jcst-accent)' }} />
                    {getString(metadata, 'qualityImageEyebrow')}
                  </div>

                  <h3 className="mt-4 max-w-xl font-display text-3xl font-bold leading-tight sm:text-4xl">
                    {getString(metadata, 'qualityImageTitle')}
                  </h3>

                  <p className="mt-3 max-w-xl leading-7 text-slate-200">
                    {getString(metadata, 'qualityImageDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div>
            <SectionHeading
              eyebrow={getString(metadata, 'qualityEyebrow')}
              title={getString(metadata, 'qualityTitle')}
              description={getString(metadata, 'qualityDescription')}
            />

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {items.map((item) => (
                <FeatureCard key={`${item.title}-${item.icon}`} item={item} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const AcademicsCta = ({ page }: { page: WebsiteContentRecord }) => {
  const metadata = page.metadata;

  return (
    <section className="relative isolate overflow-hidden py-16 text-white sm:py-20 lg:py-24">
      <SmartImage
        source={getString(metadata, 'ctaImageUrl')}
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
              <span style={{ color: 'var(--jcst-accent)' }}>{getString(metadata, 'ctaEyebrow')}</span>
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
    <p className="text-xs font-bold uppercase tracking-[0.19em]" style={{ color: 'var(--jcst-accent)' }}>
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

    <p className={`mt-5 text-base leading-8 sm:text-lg ${inverse ? 'text-slate-300' : 'text-slate-600'}`}>
      {description}
    </p>
  </div>
);

const FeatureCard = ({ item }: { item: AcademicFeature }) => (
  <article className="group h-full rounded-[20px] border border-slate-200/90 bg-white p-4 sm:p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--jcst-accent)] hover:shadow-[0_14px_34px_rgba(15,23,42,.08)]">
    <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-50 shadow-sm" style={{ color: 'var(--jcst-secondary)' }}>
      <CmsIcon name={item.icon} size={19} />
    </span>

    <h3 className="mt-3 text-sm font-bold sm:mt-4 sm:text-base" style={{ color: 'var(--jcst-primary)' }}>
      {item.title}
    </h3>

    <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm sm:leading-7">{item.description}</p>
  </article>
);

const PrimaryButton = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link
    to={to}
    className="academics-button-shine group relative inline-flex min-h-[54px] items-center justify-center gap-2 overflow-hidden rounded-xl px-7 font-semibold text-white shadow-xl transition duration-300 hover:-translate-y-1"
    style={{ background: 'var(--jcst-secondary)' }}
  >
    <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
  </Link>
);

const SecondaryButton = ({ to, children }: { to: string; children: ReactNode }) => (
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
  const supportsIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window;
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
      className={`academics-reveal ${visible ? 'academics-reveal-visible' : ''} ${className}`}
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
        aria-label={alt || undefined}
        className={`${className} grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(197,139,20,.24),transparent_28%),linear-gradient(145deg,#e8edf5,#cbd5e1_55%,#334155)]`}
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/35 bg-white/85 text-jcst-crimson shadow-lg backdrop-blur">
          <ImageIcon size={25} aria-hidden="true" />
        </span>
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

const getString = (metadata: Record<string, unknown>, key: string): string => {
  const value = metadata[key];
  return typeof value === 'string' ? value : '';
};

const getObjectArray = <T extends object>(metadata: Record<string, unknown>, key: string): T[] => {
  const value = metadata[key];

  return Array.isArray(value)
    ? value.filter(
        (item): item is T =>
          Boolean(item) && typeof item === 'object' && !Array.isArray(item),
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
  const props = { size, className, style, 'aria-hidden': true as const };

  const icons: Record<string, LucideIcon> = {
    award: Award,
    badge: BadgeCheck,
    book: BookOpen,
    bookcheck: BookOpenCheck,
    briefcase: BriefcaseBusiness,
    building: Building2,
    calendar: CalendarDays,
    check: CheckCircle2,
    clock: Clock3,
    globe: Globe2,
    graduation: GraduationCap,
    laptop: Laptop2,
    layers: Layers3,
    library: LibraryBig,
    innovation: Lightbulb,
    lightbulb: Lightbulb,
    monitor: MonitorPlay,
    shield: ShieldCheck,
    target: Target,
    users: Users,
  };

  const Icon = icons[name] ?? Sparkles;
  return <Icon {...props} />;
};

const AcademicsPageStyles = () => (
  <style>{`
    @keyframes academicsHeroEnter {
      from {
        opacity: 0;
        transform: translateY(24px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .academics-hero-enter {
      animation: academicsHeroEnter 760ms ease-out both;
    }

    .academics-reveal {
      opacity: 0;
      transform: translateY(28px);
      transition:
        opacity 680ms ease,
        transform 680ms cubic-bezier(.2,.75,.25,1);
    }

    .academics-reveal-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .academics-button-shine::after {
      content: '';
      position: absolute;
      top: -80%;
      left: -45%;
      width: 28%;
      height: 260%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.32), transparent);
      transform: rotate(22deg);
      transition: left 650ms ease;
    }

    .academics-button-shine:hover::after {
      left: 125%;
    }

    @media (prefers-reduced-motion: reduce) {
      .academics-hero-enter {
        animation: none !important;
      }

      .academics-reveal {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }
  `}</style>
);