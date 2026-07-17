import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  ImageIcon,
  Laptop2,
  Layers3,
  MapPin,
  MonitorPlay,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Wifi,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { WebsiteContentRecord } from '@jcst/shared';
import { PageError, PageLoading } from '@/components/common/PageState';
import { useWebsiteCollection } from '@/features/website/useWebsiteContent';
import {
  usePublicWebsite,
  useWebsiteSection,
} from '@/features/website/context/PublicWebsiteContext';

interface HomeFeature {
  title: string;
  description: string;
  icon: string;
}

interface HomeBadge {
  label: string;
  icon: string;
}

interface AdmissionStepData {
  number: string;
  title: string;
  description: string;
}

export const HomePage = () => {
  const {
    site,
    isLoading: bootstrapLoading,
    isError: bootstrapError,
    errorMessage,
  } = usePublicWebsite();
  const hero = useWebsiteSection('home-hero');
  const statisticsSection = useWebsiteSection('home-statistics');
  const programsSection = useWebsiteSection('home-programs');
  const coursesSection = useWebsiteSection('home-courses');
  const elearningSection = useWebsiteSection('home-elearning');
  const whySection = useWebsiteSection('home-why-jcst');
  const successSection = useWebsiteSection('home-student-success');
  const admissionsSection = useWebsiteSection('home-admissions');

  const programs = useWebsiteCollection('program');
  const courses = useWebsiteCollection('course');
  const lecturers = useWebsiteCollection('lecturer');
  const statistics = useWebsiteCollection('statistic');
  const testimonials = useWebsiteCollection('testimonial');

  const loading =
    bootstrapLoading ||
    programs.isLoading ||
    courses.isLoading ||
    lecturers.isLoading ||
    statistics.isLoading ||
    testimonials.isLoading;

  const lecturerMap = useMemo(
    () => new Map((lecturers.data ?? []).map((lecturer) => [lecturer.slug, lecturer] as const)),
    [lecturers.data],
  );

  if (loading) {
    return <PageLoading />;
  }

  if (bootstrapError) {
    return (
      <PageError
        message={errorMessage || 'Public website content could not be loaded from the database.'}
      />
    );
  }

  return (
    <>
      <HomePageStyles />

      {isEnabled(hero) ? <HeroSection section={hero} siteName={site.institutionName} /> : null}

      {isEnabled(statisticsSection) ? (
        <StatisticsSection
          section={statisticsSection}
          records={(statistics.data ?? []).filter((item) => item.featured)}
        />
      ) : null}

      {isEnabled(programsSection) ? (
        <ProgramsSection
          section={programsSection}
          records={(programs.data ?? []).filter((item) => item.featured)}
        />
      ) : null}

      {isEnabled(coursesSection) ? (
        <CoursesSection
          section={coursesSection}
          records={(courses.data ?? []).filter((item) => item.featured)}
          lecturers={lecturerMap}
        />
      ) : null}

      {isEnabled(elearningSection) ? <ELearningSection section={elearningSection} /> : null}

      {isEnabled(whySection) ? <WhyJcstSection section={whySection} /> : null}

      {isEnabled(successSection) ? (
        <StudentSuccessSection
          section={successSection}
          records={(testimonials.data ?? []).filter((item) => item.featured)}
        />
      ) : null}

      {isEnabled(admissionsSection) ? <AdmissionsSection section={admissionsSection} /> : null}
    </>
  );
};

const HeroSection = ({
  section,
  siteName,
}: {
  section: WebsiteContentRecord;
  siteName: string;
}) => {
  const badges = getObjectArray<HomeBadge>(section.metadata, 'badges');
  const imageUrl = getString(section.metadata, 'imageUrl');
  const imageAlt = getString(section.metadata, 'imageAlt');

  return (
    <section
      className="relative isolate overflow-hidden text-white"
      style={{ background: 'var(--jcst-dark)' }}
    >
      <div className="absolute inset-0 -z-40 bg-[radial-gradient(circle_at_10%_15%,rgba(197,139,20,.18),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(155,17,30,.28),transparent_34%),linear-gradient(135deg,rgba(8,47,99,.98),rgba(6,26,53,.98))]" />
      <div className="absolute inset-0 -z-30 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:54px_54px]" />

      <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[.92fr_1.08fr] lg:px-8 lg:py-24">
        <div className="jcst-hero-enter relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-sm font-semibold backdrop-blur-xl">
            <Sparkles size={15} style={{ color: 'var(--jcst-accent)' }} />
            <span style={{ color: 'var(--jcst-accent)' }}>
              {getString(section.metadata, 'eyebrow')}
            </span>
          </div>

          <h1 className="mt-8 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
            <span className="block">{getString(section.metadata, 'titleLineOne')}</span>
            <span
              className="mt-2 block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg,var(--jcst-accent),#fff2b6,var(--jcst-accent))',
              }}
            >
              {getString(section.metadata, 'titleLineTwo')}
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            {getString(section.metadata, 'description')}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton to={getString(section.metadata, 'primaryUrl')}>
              {getString(section.metadata, 'primaryLabel')}
              <ArrowRight size={18} />
            </PrimaryButton>
            <SecondaryButton to={getString(section.metadata, 'secondaryUrl')}>
              {getString(section.metadata, 'secondaryLabel')}
              <ChevronRight size={18} />
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
          <div className="relative sm:pb-24">
            <div className="rounded-[34px] border border-white/12 bg-white/[0.05] p-4 shadow-[0_35px_90px_rgba(0,0,0,.35)] backdrop-blur-xl">
              <div className="group relative min-h-[560px] overflow-hidden rounded-[28px] bg-slate-900">
                <SmartImage
                  source={imageUrl}
                  alt={imageAlt}
                  className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,18,38,.96),rgba(6,18,38,.2)_65%)]" />
                <div className="absolute inset-5 rounded-[22px] border border-white/15" />

                <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/55 px-3 py-2 text-xs font-bold uppercase tracking-[0.17em] backdrop-blur">
                    <BadgeCheck size={15} style={{ color: 'var(--jcst-accent)' }} />
                    {getString(section.metadata, 'imageEyebrow')}
                  </div>
                  <h2 className="mt-4 max-w-lg font-display text-3xl font-bold sm:text-4xl">
                    {getString(section.metadata, 'imageTitle')}
                  </h2>
                  <p className="mt-3 max-w-xl leading-7 text-slate-200">
                    {getString(section.metadata, 'imageDescription')}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white">
                    <MapPin size={16} style={{ color: 'var(--jcst-accent)' }} />
                    {getString(section.metadata, 'location')}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex w-full max-w-[330px] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-[0_18px_48px_rgba(2,12,27,.24)] sm:absolute sm:bottom-0 sm:left-6 sm:mt-0">
              <span
                className="grid h-11 w-11 place-items-center rounded-xl text-white"
                style={{ background: 'var(--jcst-secondary)' }}
              >
                <GraduationCap size={20} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                  {getString(section.metadata, 'institutionLabel')}
                </p>
                <p className="mt-1 max-w-[220px] text-sm font-bold text-slate-800">{siteName}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const StatisticsSection = ({
  section,
  records,
}: {
  section: WebsiteContentRecord;
  records: WebsiteContentRecord[];
}) => {
  const limit = getNumber(section.metadata, 'limit', 4);

  return (
    <section className="border-b border-slate-200 bg-white py-8 sm:py-10">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {records.slice(0, limit).map((item, index) => (
          <Reveal key={item.id} delay={index * 70} className="h-full">
            <article className="group h-full rounded-[24px] border border-slate-200/90 bg-white p-5 shadow-[0_8px_26px_rgba(15,23,42,.05)] transition duration-300 hover:-translate-y-1 hover:border-[var(--jcst-accent)] hover:shadow-[0_16px_36px_rgba(15,23,42,.09)]">
              <div className="flex items-center gap-4">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-50 transition group-hover:text-white"
                  style={{ color: 'var(--jcst-secondary)' }}
                >
                  <CmsIcon name={item.icon} size={21} />
                </span>
                <div>
                  <p
                    className="font-display text-2xl font-bold"
                    style={{ color: 'var(--jcst-primary)' }}
                  >
                    {item.excerpt}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">{item.title}</p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

const ProgramsSection = ({
  section,
  records,
}: {
  section: WebsiteContentRecord;
  records: WebsiteContentRecord[];
}) => {
  const limit = getNumber(section.metadata, 'limit', 3);
  return (
    <SectionShell section={section}>
      <div className="mt-12 grid items-stretch gap-7 md:grid-cols-2 lg:grid-cols-3">
        {records.slice(0, limit).map((item, index) => (
          <Reveal key={item.id} delay={index * 90} className="h-full">
            <ProgramCard item={item} actionLabel={getString(section.metadata, 'cardActionLabel')} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
};

const ProgramCard = ({
  item,
  actionLabel,
}: {
  item: WebsiteContentRecord;
  actionLabel: string;
}) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_10px_32px_rgba(15,23,42,.055)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--jcst-accent)] hover:shadow-[0_20px_48px_rgba(15,23,42,.11)]">
    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
      <SmartImage
        source={item.imageUrl}
        alt={getString(item.metadata, 'imageAlt')}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.75),transparent_70%)]" />
      <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-jcst-crimson backdrop-blur">
        {getString(item.metadata, 'code')}
      </span>
      <span
        className="absolute bottom-5 right-5 grid h-12 w-12 place-items-center rounded-2xl text-white shadow-xl"
        style={{ background: 'var(--jcst-secondary)' }}
      >
        <CmsIcon name={item.icon} size={21} />
      </span>
    </div>
    <div className="flex flex-1 flex-col p-6">
      <h3 className="text-xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
        {item.title}
      </h3>
      <p className="mt-3 flex-1 line-clamp-3 leading-7 text-slate-600">{item.excerpt}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
        {getStringArray(item.metadata, 'highlights').map((highlight) => (
          <span key={highlight} className="rounded-full bg-slate-100 px-3 py-1.5">
            {highlight}
          </span>
        ))}
      </div>
      <Link
        to={`/programs/${item.slug}`}
        className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-jcst-crimson"
      >
        {actionLabel}
        <ArrowRight size={17} className="transition group-hover:translate-x-1" />
      </Link>
    </div>
  </article>
);

const CoursesSection = ({
  section,
  records,
  lecturers,
}: {
  section: WebsiteContentRecord;
  records: WebsiteContentRecord[];
  lecturers: Map<string, WebsiteContentRecord>;
}) => {
  const limit = getNumber(section.metadata, 'limit', 3);
  return (
    <SectionShell section={section} alternate>
      <div className="mt-12 grid items-stretch gap-7 md:grid-cols-2 lg:grid-cols-3">
        {records.slice(0, limit).map((course, index) => {
          const lecturerSlug = getString(course.metadata, 'lecturerSlug');
          const lecturer = lecturerSlug ? lecturers.get(lecturerSlug) : undefined;
          return (
            <Reveal key={course.id} delay={index * 90} className="h-full">
              <CourseCard
                course={course}
                lecturer={lecturer}
                actionLabel={getString(section.metadata, 'cardActionLabel')}
                instructorLabel={getString(section.metadata, 'instructorLabel')}
              />
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
};

const CourseCard = ({
  course,
  lecturer,
  actionLabel,
  instructorLabel,
}: {
  course: WebsiteContentRecord;
  lecturer: WebsiteContentRecord | undefined;
  actionLabel: string;
  instructorLabel: string;
}) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_10px_32px_rgba(15,23,42,.055)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--jcst-accent)] hover:shadow-[0_20px_48px_rgba(15,23,42,.11)]">
    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
      <SmartImage
        source={course.imageUrl}
        alt={getString(course.metadata, 'imageAlt')}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.8),transparent_70%)]" />
      <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-jcst-crimson backdrop-blur">
        {getString(course.metadata, 'code')}
      </span>
    </div>

    <div className="flex flex-1 flex-col p-6">
      <h3 className="text-xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
        {course.title}
      </h3>
      <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{course.excerpt}</p>

      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
        {getStringArray(course.metadata, 'highlights').map((highlight) => (
          <span key={highlight} className="rounded-full bg-slate-100 px-3 py-1.5">
            {highlight}
          </span>
        ))}
      </div>

      {lecturer ? (
        <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100">
            <SmartImage
              source={lecturer.imageUrl}
              alt={getString(lecturer.metadata, 'imageAlt')}
              className="h-full w-full object-cover object-top"
              compactFallback
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {instructorLabel}
            </p>
            <p className="truncate font-bold text-slate-800">{lecturer.title}</p>
            <p className="truncate text-xs text-slate-500">
              {getString(lecturer.metadata, 'specialization')}
            </p>
          </div>
        </div>
      ) : null}

      <Link
        to={`/courses/${course.slug}`}
        className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-jcst-crimson"
      >
        {actionLabel}
        <ArrowRight size={17} className="transition group-hover:translate-x-1" />
      </Link>
    </div>
  </article>
);

const ELearningSection = ({ section }: { section: WebsiteContentRecord }) => {
  const features = getObjectArray<HomeFeature>(section.metadata, 'features');
  const imageUrl = getString(section.metadata, 'imageUrl');
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute left-0 top-1/3 h-80 w-80 rounded-full bg-red-100/60 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div>
            <SectionHeading section={section} />
            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={`${feature.title}-${feature.icon}`}
                  className="group h-full rounded-[22px] border border-slate-200/90 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--jcst-accent)] hover:bg-white hover:shadow-[0_14px_34px_rgba(15,23,42,.08)]"
                >
                  <span
                    className="grid h-11 w-11 place-items-center rounded-xl bg-white shadow-sm"
                    style={{ color: 'var(--jcst-secondary)' }}
                  >
                    <CmsIcon name={feature.icon} size={19} />
                  </span>
                  <h3 className="mt-4 font-bold" style={{ color: 'var(--jcst-primary)' }}>
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton to={getString(section.metadata, 'primaryUrl')}>
                {getString(section.metadata, 'primaryLabel')}
                <ArrowRight size={18} />
              </PrimaryButton>
              <TextButton to={getString(section.metadata, 'secondaryUrl')}>
                {getString(section.metadata, 'secondaryLabel')}
                <ChevronRight size={18} />
              </TextButton>
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="relative">
            <div className="group relative min-h-[540px] overflow-hidden rounded-[34px] border border-slate-200 bg-slate-100 shadow-2xl">
              <SmartImage
                source={imageUrl}
                alt={getString(section.metadata, 'imageAlt')}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.85),transparent_65%)]" />
              <div className="absolute inset-5 rounded-[25px] border border-white/25" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <p
                  className="text-xs font-bold uppercase tracking-[0.18em]"
                  style={{ color: 'var(--jcst-accent)' }}
                >
                  {getString(section.metadata, 'imageEyebrow')}
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold">
                  {getString(section.metadata, 'imageTitle')}
                </h3>
                <p className="mt-3 max-w-lg leading-7 text-slate-200">
                  {getString(section.metadata, 'imageDescription')}
                </p>
              </div>
            </div>

            <div className="absolute -bottom-7 left-5 right-5 rounded-[24px] border border-slate-200 bg-white p-5 shadow-2xl sm:left-auto sm:right-8 sm:w-[300px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-jcst-crimson">
                    {getString(section.metadata, 'progressEyebrow')}
                  </p>
                  <p className="mt-1 font-bold" style={{ color: 'var(--jcst-primary)' }}>
                    {getString(section.metadata, 'progressTitle')}
                  </p>
                </div>
                <span
                  className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50"
                  style={{ color: 'var(--jcst-accent)' }}
                >
                  <Zap size={20} />
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="jcst-progress h-full rounded-full"
                  style={{
                    width: `${getNumber(section.metadata, 'progressPercent', 0)}%`,
                    background: 'linear-gradient(90deg,var(--jcst-secondary),var(--jcst-accent))',
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>{getString(section.metadata, 'progressLabel')}</span>
                <span className="font-bold text-jcst-crimson">
                  {getString(section.metadata, 'progressValue')}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const WhyJcstSection = ({ section }: { section: WebsiteContentRecord }) => {
  const features = getObjectArray<HomeFeature>(section.metadata, 'features');
  return (
    <section
      className="relative isolate overflow-hidden py-24 text-white"
      style={{ background: 'var(--jcst-dark)' }}
    >
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(circle,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:30px_30px]" />
      <div className="absolute -right-40 -top-40 -z-20 h-[480px] w-[480px] rounded-full bg-red-800/25 blur-[120px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading section={section} inverse />
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Reveal key={`${feature.title}-${feature.icon}`} delay={index * 80} className="h-full">
              <article className="group flex h-full min-h-[250px] flex-col rounded-[26px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-1.5 hover:border-[var(--jcst-accent)] hover:bg-white/[0.09]">
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.08]"
                  style={{ color: 'var(--jcst-accent)' }}
                >
                  <CmsIcon name={feature.icon} size={22} />
                </span>
                <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const StudentSuccessSection = ({
  section,
  records,
}: {
  section: WebsiteContentRecord;
  records: WebsiteContentRecord[];
}) => {
  const limit = getNumber(section.metadata, 'limit', 3);

  return (
    <SectionShell section={section} alternate>
      <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        {records.slice(0, limit).map((item, index) => {
          const rating = Math.min(Math.max(getNumber(item.metadata, 'rating', 5), 0), 5);
          const testimonialText = item.body || item.excerpt;
          const initial = item.title.trim().charAt(0).toUpperCase();

          return (
            <Reveal key={item.id} delay={index * 90} className="h-full">
              <blockquote className="group flex h-full min-h-[350px] flex-col overflow-hidden rounded-[28px] border border-slate-200/90 bg-white p-7 shadow-[0_10px_32px_rgba(15,23,42,.055)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--jcst-accent)] hover:shadow-[0_20px_48px_rgba(15,23,42,.11)] sm:p-8">
                <div className="flex items-center justify-between gap-5">
                  <div className="flex gap-1" style={{ color: 'var(--jcst-accent)' }}>
                    {Array.from({ length: rating }).map((_, starIndex) => (
                      <Star key={starIndex} size={14} fill="currentColor" />
                    ))}
                  </div>

                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-50"
                    style={{ color: 'var(--jcst-accent)' }}
                    aria-hidden="true"
                  >
                    <Quote size={20} strokeWidth={1.8} />
                  </span>
                </div>

                <p className="mt-6 flex-1 text-[1.05rem] leading-8 text-slate-700">
                  {testimonialText}
                </p>

                <footer className="mt-7 flex min-h-[74px] items-center gap-4 border-t border-slate-100 pt-5">
                  <div className="grid h-[52px] w-[52px] shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 ring-4 ring-slate-50">
                    {item.imageUrl ? (
                      <SmartImage
                        source={item.imageUrl}
                        alt={getString(item.metadata, 'imageAlt')}
                        className="h-full w-full object-cover"
                        compactFallback
                      />
                    ) : (
                      <span
                        className="font-display text-lg font-bold"
                        style={{ color: 'var(--jcst-primary)' }}
                      >
                        {initial}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className="truncate font-bold"
                      style={{ color: 'var(--jcst-primary)' }}
                    >
                      {item.title}
                    </p>
                    <p className="mt-1 truncate text-sm text-jcst-crimson">
                      {getString(item.metadata, 'program')}
                    </p>
                  </div>
                </footer>
              </blockquote>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
};

const AdmissionsSection = ({ section }: { section: WebsiteContentRecord }) => {
  const steps = getObjectArray<AdmissionStepData>(section.metadata, 'steps');
  const imageUrl = getString(section.metadata, 'imageUrl');
  return (
    <section className="relative isolate overflow-hidden py-24 text-white">
      <SmartImage
        source={imageUrl}
        alt={getString(section.metadata, 'imageAlt')}
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(6,26,53,.99),rgba(8,47,99,.94)_58%,rgba(155,17,30,.86))]" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_.85fr] lg:px-8">
        <Reveal>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Sparkles size={16} style={{ color: 'var(--jcst-accent)' }} />
              <span style={{ color: 'var(--jcst-accent)' }}>
                {getString(section.metadata, 'eyebrow')}
              </span>
            </div>
            <h2 className="mt-6 max-w-3xl font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
              {section.title}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{section.excerpt}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton to={getString(section.metadata, 'primaryUrl')}>
                {getString(section.metadata, 'primaryLabel')}
                <ArrowRight size={18} />
              </PrimaryButton>
              <SecondaryButton to={getString(section.metadata, 'secondaryUrl')}>
                {getString(section.metadata, 'secondaryLabel')}
                <ChevronRight size={18} />
              </SecondaryButton>
            </div>
          </div>
        </Reveal>

        <Reveal delay={130}>
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <article
                key={`${step.number}-${step.title}`}
                className="rounded-[22px] border border-white/15 bg-white/[0.08] p-5 backdrop-blur-xl"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-display text-sm font-bold text-slate-950"
                    style={{ background: 'var(--jcst-accent)' }}
                  >
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-7 text-slate-200">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 ? (
                  <div className="ml-6 mt-4 h-5 w-px bg-white/20" />
                ) : null}
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const SectionShell = ({
  section,
  children,
  alternate = false,
}: {
  section: WebsiteContentRecord;
  children: ReactNode;
  alternate?: boolean;
}) => (
  <section className={`${alternate ? 'bg-slate-50' : 'bg-white'} py-20 sm:py-24`}>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end lg:gap-12">
        <div className="max-w-3xl">
          <SectionHeading section={section} />
        </div>
        {getString(section.metadata, 'viewAllUrl') ? (
          <TextLink
            to={getString(section.metadata, 'viewAllUrl')}
            label={getString(section.metadata, 'viewAllLabel')}
          />
        ) : null}
      </div>
      {children}
    </div>
  </section>
);

const SectionHeading = ({
  section,
  inverse = false,
}: {
  section: WebsiteContentRecord;
  inverse?: boolean;
}) => (
  <>
    <p
      className="text-xs font-bold uppercase tracking-[0.19em]"
      style={{ color: 'var(--jcst-accent)' }}
    >
      {getString(section.metadata, 'eyebrow')}
    </p>
    <h2
      className={`mt-4 font-display text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl lg:text-[2.8rem] ${inverse ? 'text-white' : ''}`}
      style={inverse ? undefined : { color: 'var(--jcst-primary)' }}
    >
      {section.title}
    </h2>
    <p className={`mt-5 max-w-3xl text-base leading-8 sm:text-lg ${inverse ? 'text-slate-300' : 'text-slate-600'}`}>
      {section.excerpt}
    </p>
  </>
);

const TextLink = ({ to, label }: { to: string; label: string }) => (
  <Link to={to} className="group inline-flex items-center gap-3 font-semibold text-jcst-crimson">
    {label}
    <span className="grid h-10 w-10 place-items-center rounded-full bg-red-50 transition group-hover:bg-jcst-crimson group-hover:text-white">
      <ArrowRight size={17} />
    </span>
  </Link>
);

const PrimaryButton = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link
    to={to}
    className="jcst-button-shine group relative inline-flex min-h-[54px] items-center justify-center gap-2 overflow-hidden rounded-xl px-7 font-semibold text-white shadow-xl transition duration-300 hover:-translate-y-1"
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

const TextButton = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link
    to={to}
    className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 font-semibold transition duration-300 hover:-translate-y-1 hover:border-[var(--jcst-accent)]"
    style={{ color: 'var(--jcst-primary)' }}
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
    if (!element) return undefined;
    if (!supportsIntersectionObserver) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -35px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [supportsIntersectionObserver]);

  return (
    <div
      ref={elementRef}
      className={`jcst-reveal ${visible ? 'jcst-reveal-visible' : ''} ${className}`}
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
  compactFallback = false,
}: {
  source: string;
  alt: string;
  className: string;
  priority?: boolean;
  compactFallback?: boolean;
}) => {
  const [failed, setFailed] = useState(false);

  if (!source || failed) {
    return (
      <div
        role="img"
        aria-label={alt || undefined}
        className={`${className} grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(197,139,20,.24),transparent_28%),linear-gradient(145deg,#e8edf5,#cbd5e1_55%,#334155)]`}
      >
        <span
          className={`grid place-items-center rounded-2xl border border-white/35 bg-white/85 text-jcst-crimson shadow-lg backdrop-blur ${
            compactFallback ? 'h-8 w-8' : 'h-14 w-14'
          }`}
        >
          <ImageIcon size={compactFallback ? 16 : 25} aria-hidden="true" />
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

const getNumber = (
  metadata: Record<string, unknown>,
  key: string,
  defaultValue: number,
): number => {
  const value = metadata[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : defaultValue;
};

const getStringArray = (metadata: Record<string, unknown>, key: string): string[] => {
  const value = metadata[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
};

const getObjectArray = <T extends object>(metadata: Record<string, unknown>, key: string): T[] => {
  const value = metadata[key];
  return Array.isArray(value)
    ? value.filter((item): item is T => Boolean(item) && typeof item === 'object')
    : [];
};

const isEnabled = (section: WebsiteContentRecord | undefined): section is WebsiteContentRecord => {
  if (!section) return false;
  const enabled = section.metadata['enabled'];
  return typeof enabled === 'boolean' ? enabled : true;
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

  switch (name) {
    case 'badge-check':
      return <BadgeCheck {...props} />;
    case 'book':
      return <BookOpen {...props} />;
    case 'book-open-check':
      return <BookOpenCheck {...props} />;
    case 'briefcase':
      return <BriefcaseBusiness {...props} />;
    case 'calendar':
      return <CalendarDays {...props} />;
    case 'check':
      return <CheckCircle2 {...props} />;
    case 'graduation':
      return <GraduationCap {...props} />;
    case 'laptop':
      return <Laptop2 {...props} />;
    case 'layers':
      return <Layers3 {...props} />;
    case 'location':
      return <MapPin {...props} />;
    case 'monitor':
      return <MonitorPlay {...props} />;
    case 'quote':
      return <Quote {...props} />;
    case 'shield':
      return <ShieldCheck {...props} />;
    case 'star':
      return <Star {...props} />;
    case 'target':
      return <Target {...props} />;
    case 'trophy':
      return <Trophy {...props} />;
    case 'users':
      return <Users {...props} />;
    case 'wifi':
      return <Wifi {...props} />;
    case 'zap':
      return <Zap {...props} />;
    default:
      return <Sparkles {...props} />;
  }
};

const HomePageStyles = () => (
  <style>{`
    @keyframes jcstHeroEnter {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes jcstProgress {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }

    .jcst-hero-enter { animation: jcstHeroEnter 760ms ease-out both; }
    .jcst-progress { transform-origin: left; animation: jcstProgress 1.6s ease-out both; }
    .jcst-reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 680ms ease, transform 680ms cubic-bezier(.2,.75,.25,1);
    }
    .jcst-reveal-visible { opacity: 1; transform: translateY(0); }
    .jcst-button-shine::after {
      content: '';
      position: absolute;
      top: -80%;
      left: -45%;
      width: 28%;
      height: 260%;
      background: linear-gradient(90deg,transparent,rgba(255,255,255,.32),transparent);
      transform: rotate(22deg);
      transition: left 650ms ease;
    }
    .jcst-button-shine:hover::after { left: 125%; }

    @media (prefers-reduced-motion: reduce) {
      .jcst-hero-enter,
      .jcst-progress { animation: none !important; }
      .jcst-reveal { opacity: 1; transform: none; transition: none; }
    }
  `}</style>
);