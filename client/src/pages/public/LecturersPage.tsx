import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  Filter,
  GraduationCap,
  ImageIcon,
  Laptop2,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { WebsiteContentRecord } from '@jcst/shared';
import { PageError, PageLoading } from '@/components/common/PageState';
import {
  useWebsiteCollection,
  useWebsiteItem,
} from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

interface LecturerSummary {
  lecturer: WebsiteContentRecord;
  courseCount: number;
}

export const LecturersPage = () => {
  const { text } = usePublicWebsite();
  const pageQuery = useWebsiteItem('page', 'lecturers');
  const lecturersQuery = useWebsiteCollection('lecturer');
  const coursesQuery = useWebsiteCollection('course');

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const page = pageQuery.data;
  const lecturers = lecturersQuery.data ?? [];
  const courses = coursesQuery.data ?? [];

  const summaries = useMemo<LecturerSummary[]>(
    () =>
      lecturers.map((lecturer) => ({
        lecturer,
        courseCount: courses.filter(
          (course) => getString(course.metadata, 'lecturerSlug') === lecturer.slug,
        ).length,
      })),
    [courses, lecturers],
  );

  const departmentOptions = useMemo(
    () =>
      Array.from(
        new Set(
          lecturers
            .map((lecturer) => getString(lecturer.metadata, 'department'))
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [lecturers],
  );

  const specializationOptions = useMemo(
    () =>
      Array.from(
        new Set(
          lecturers
            .map((lecturer) => getString(lecturer.metadata, 'specialization'))
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [lecturers],
  );

  const filteredLecturers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return summaries.filter(({ lecturer }) => {
      const metadata = lecturer.metadata;
      const searchableText = [
        lecturer.title,
        lecturer.excerpt,
        lecturer.body,
        getString(metadata, 'qualification'),
        getString(metadata, 'department'),
        getString(metadata, 'departmentLabel'),
        getString(metadata, 'specialization'),
        ...getStringArray(metadata, 'expertise'),
        ...getStringArray(metadata, 'researchInterests'),
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);
      const matchesDepartment =
        departmentFilter === 'all' ||
        getString(metadata, 'department') === departmentFilter;
      const matchesSpecialization =
        specializationFilter === 'all' ||
        getString(metadata, 'specialization') === specializationFilter;

      return matchesSearch && matchesDepartment && matchesSpecialization;
    });
  }, [departmentFilter, searchTerm, specializationFilter, summaries]);

  const loading =
    pageQuery.isLoading || lecturersQuery.isLoading || coursesQuery.isLoading;

  if (loading) {
    return <PageLoading />;
  }

  if (
    pageQuery.isError ||
    lecturersQuery.isError ||
    coursesQuery.isError ||
    !page
  ) {
    return <PageError message={text('global.errors.page-load')} />;
  }

  const resetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('all');
    setSpecializationFilter('all');
  };

  const filtersActive =
    Boolean(searchTerm) ||
    departmentFilter !== 'all' ||
    specializationFilter !== 'all';

  return (
    <div className="overflow-x-clip bg-slate-50">
      <LecturersHero
        page={page}
        lecturerCount={lecturers.length}
        courseCount={courses.length}
      />

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_44px_rgba(15,23,42,.06)] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative block min-w-0 flex-1">
                <Search
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={
                    getString(page.metadata, 'searchPlaceholder') ||
                    'Search lecturers, qualifications, or expertise...'
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[var(--jcst-accent)] focus:bg-white focus:ring-4 focus:ring-amber-100/60"
                />
              </label>

              <div className="hidden items-center gap-3 lg:flex">
                <Filter size={18} className="text-slate-400" />

                <select
                  value={departmentFilter}
                  onChange={(event) => setDepartmentFilter(event.target.value)}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[var(--jcst-accent)] focus:ring-4 focus:ring-amber-100/60"
                >
                  <option value="all">All Departments</option>
                  {departmentOptions.map((option) => (
                    <option key={option} value={option}>
                      {formatSlug(option)}
                    </option>
                  ))}
                </select>

                <select
                  value={specializationFilter}
                  onChange={(event) => setSpecializationFilter(event.target.value)}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[var(--jcst-accent)] focus:ring-4 focus:ring-amber-100/60"
                >
                  <option value="all">All Specializations</option>
                  {specializationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[var(--jcst-accent)] lg:hidden"
              >
                <Filter size={18} />
                Filter Lecturers
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-jcst-crimson">
                {getString(page.metadata, 'resultsEyebrow') || 'Academic Staff'}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-jcst-navy">
                {filteredLecturers.length} lecturer profiles found
              </h2>
            </div>

            {filtersActive ? (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[var(--jcst-accent)]"
              >
                <X size={16} />
                Reset Filters
              </button>
            ) : null}
          </div>

          {filteredLecturers.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredLecturers.map((summary) => (
                <LecturerCard
                  key={summary.lecturer.slug}
                  summary={summary}
                  actionLabel={
                    getString(page.metadata, 'cardActionLabel') ||
                    'View Lecturer Profile'
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState page={page} resetFilters={resetFilters} />
          )}
        </div>
      </section>

      <LecturersCta page={page} />

      {mobileFiltersOpen ? (
        <MobileFilters
          departmentFilter={departmentFilter}
          specializationFilter={specializationFilter}
          departmentOptions={departmentOptions}
          specializationOptions={specializationOptions}
          onDepartmentChange={setDepartmentFilter}
          onSpecializationChange={setSpecializationFilter}
          onReset={resetFilters}
          onClose={() => setMobileFiltersOpen(false)}
        />
      ) : null}
    </div>
  );
};

const LecturersHero = ({
  page,
  lecturerCount,
  courseCount,
}: {
  page: WebsiteContentRecord;
  lecturerCount: number;
  courseCount: number;
}) => (
  <section className="relative isolate overflow-hidden text-white" style={{ background: 'var(--jcst-dark)' }}>
    <SmartImage
      source={getString(page.metadata, 'heroImageUrl') || page.imageUrl}
      alt={getString(page.metadata, 'heroImageAlt') || page.title}
      className="absolute inset-0 -z-30 h-full w-full object-cover"
      priority
    />
    <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(6,26,53,.99),rgba(8,47,99,.94)_58%,rgba(155,17,30,.82))]" />
    <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:52px_52px]" />

    <div className="mx-auto grid min-h-[600px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_.9fr] lg:px-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-semibold backdrop-blur">
          <Sparkles size={15} style={{ color: 'var(--jcst-accent)' }} />
          <span style={{ color: 'var(--jcst-accent)' }}>
            {getString(page.metadata, 'eyebrow') || 'Meet the JCST Faculty'}
          </span>
        </div>

        <h1 className="mt-7 max-w-4xl font-display text-4xl font-bold leading-[1.04] tracking-[-0.03em] sm:text-5xl lg:text-[3.8rem]">
          {page.title}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
          {page.excerpt}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to={getString(page.metadata, 'heroPrimaryUrl') || '/courses'}
            className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white shadow-xl transition hover:-translate-y-1"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            {getString(page.metadata, 'heroPrimaryLabel') || 'Explore Courses'}
            <ArrowRight size={18} />
          </Link>

          <Link
            to={getString(page.metadata, 'heroSecondaryUrl') || '/e-learning'}
            className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl border border-amber-300/40 bg-white/[0.08] px-7 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.14]"
          >
            <Laptop2 size={18} />
            {getString(page.metadata, 'heroSecondaryLabel') || 'Open E-Learning'}
          </Link>
        </div>
      </div>

      <div className="rounded-[34px] border border-white/12 bg-white/[0.07] p-5 shadow-[0_35px_90px_rgba(0,0,0,.32)] backdrop-blur-xl sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--jcst-accent)' }}>
          Faculty at a glance
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <HeroMetric value={`${lecturerCount}+`} label="Lecturer Profiles" icon={<Users size={20} />} />
          <HeroMetric value={`${courseCount}+`} label="Published Courses" icon={<BookOpenCheck size={20} />} />
          <HeroMetric value="Blended" label="Teaching Delivery" icon={<Laptop2 size={20} />} />
          <HeroMetric value="Student First" label="Academic Support" icon={<Award size={20} />} />
        </div>

        <div className="mt-5 rounded-[22px] border border-white/10 bg-slate-950/25 p-5">
          <div className="flex items-start gap-3">
            <GraduationCap size={22} className="mt-0.5 shrink-0" style={{ color: 'var(--jcst-accent)' }} />
            <div>
              <p className="font-bold">
                {getString(page.metadata, 'heroCardTitle') || 'Teaching with knowledge and purpose'}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {getString(page.metadata, 'heroCardDescription') || page.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HeroMetric = ({ value, label, icon }: { value: string; label: string; icon: ReactNode }) => (
  <article className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10" style={{ color: 'var(--jcst-accent)' }}>
      {icon}
    </span>
    <p className="mt-4 font-display text-xl font-bold sm:text-2xl">{value}</p>
    <p className="mt-1 text-xs font-medium leading-5 text-slate-300 sm:text-sm">{label}</p>
  </article>
);

const LecturerCard = ({
  summary,
  actionLabel,
}: {
  summary: LecturerSummary;
  actionLabel: string;
}) => {
  const { lecturer, courseCount } = summary;
  const metadata = lecturer.metadata;
  const expertise = getStringArray(metadata, 'expertise').slice(0, 3);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_38px_rgba(15,23,42,.07)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--jcst-accent)] hover:shadow-[0_24px_54px_rgba(15,23,42,.12)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <SmartImage
          source={lecturer.imageUrl}
          alt={getString(metadata, 'imageAlt') || lecturer.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.82),transparent_65%)]" />

        <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/45 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-white backdrop-blur">
          {getString(metadata, 'qualification')}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--jcst-accent)' }}>
            {getString(metadata, 'departmentLabel') || formatSlug(getString(metadata, 'department'))}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold">{lecturer.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-200">{lecturer.excerpt}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-sm leading-7 text-slate-600">{lecturer.body}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {expertise.map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">Specialization</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-700 sm:text-sm">
              {getString(metadata, 'specialization')}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">Courses</p>
            <p className="mt-1 text-sm font-bold text-jcst-navy">{courseCount}</p>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <Link
            to={`/lecturers/${lecturer.slug}`}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            {actionLabel}
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
};

const EmptyState = ({
  page,
  resetFilters,
}: {
  page: WebsiteContentRecord;
  resetFilters: () => void;
}) => (
  <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
    <Users size={40} className="mx-auto text-slate-300" />
    <h3 className="mt-5 font-display text-2xl font-bold text-jcst-navy">
      {getString(page.metadata, 'emptyTitle') || 'No lecturer profiles match your search'}
    </h3>
    <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
      {getString(page.metadata, 'emptyDescription') ||
        'Try another lecturer name, department, qualification, or specialization.'}
    </p>
    <button
      type="button"
      onClick={resetFilters}
      className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white"
      style={{ background: 'var(--jcst-secondary)' }}
    >
      Reset Filters
    </button>
  </div>
);

const MobileFilters = ({
  departmentFilter,
  specializationFilter,
  departmentOptions,
  specializationOptions,
  onDepartmentChange,
  onSpecializationChange,
  onReset,
  onClose,
}: {
  departmentFilter: string;
  specializationFilter: string;
  departmentOptions: string[];
  specializationOptions: string[];
  onDepartmentChange: (value: string) => void;
  onSpecializationChange: (value: string) => void;
  onReset: () => void;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-[100] flex items-end bg-slate-950/55 p-3 backdrop-blur-sm lg:hidden">
    <button type="button" aria-label="Close filters" onClick={onClose} className="absolute inset-0" />

    <div className="relative w-full rounded-[28px] bg-white p-5 shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-jcst-crimson">Lecturer Filters</p>
          <h3 className="mt-1 font-display text-2xl font-bold text-jcst-navy">Refine profiles</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        <label>
          <span className="text-sm font-semibold text-slate-700">Department</span>
          <select
            value={departmentFilter}
            onChange={(event) => onDepartmentChange(event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
          >
            <option value="all">All Departments</option>
            {departmentOptions.map((option) => (
              <option key={option} value={option}>
                {formatSlug(option)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Specialization</span>
          <select
            value={specializationFilter}
            onChange={(event) => onSpecializationChange(event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
          >
            <option value="all">All Specializations</option>
            {specializationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            onReset();
            onClose();
          }}
          className="min-h-[48px] rounded-xl border border-slate-200 font-semibold text-slate-700"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onClose}
          className="min-h-[48px] rounded-xl font-semibold text-white"
          style={{ background: 'var(--jcst-secondary)' }}
        >
          Show Results
        </button>
      </div>
    </div>
  </div>
);

const LecturersCta = ({ page }: { page: WebsiteContentRecord }) => (
  <section className="relative isolate overflow-hidden py-16 text-white sm:py-20">
    <SmartImage
      source={getString(page.metadata, 'ctaImageUrl') || page.imageUrl}
      alt={getString(page.metadata, 'ctaImageAlt') || page.title}
      className="absolute inset-0 -z-30 h-full w-full object-cover"
    />
    <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(6,26,53,.99),rgba(8,47,99,.94)_58%,rgba(155,17,30,.86))]" />
    <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:48px_48px]" />

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.19em]" style={{ color: 'var(--jcst-accent)' }}>
          {getString(page.metadata, 'ctaEyebrow') || 'Learn with confidence'}
        </p>
        <h2 className="mt-5 font-display text-4xl font-bold sm:text-5xl">
          {getString(page.metadata, 'ctaTitle') || 'Learn from educators committed to student progress.'}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
          {getString(page.metadata, 'ctaDescription') ||
            'Explore courses, choose a program, and begin your JCST learning journey.'}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to={getString(page.metadata, 'ctaPrimaryUrl') || '/courses'}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white shadow-xl transition hover:-translate-y-1"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            {getString(page.metadata, 'ctaPrimaryLabel') || 'Explore Courses'}
            <ArrowRight size={18} />
          </Link>
          <Link
            to={getString(page.metadata, 'ctaSecondaryUrl') || '/programs'}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
          >
            {getString(page.metadata, 'ctaSecondaryLabel') || 'View Programs'}
          </Link>
        </div>
      </div>
    </div>
  </section>
);

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

const getStringArray = (
  metadata: Record<string, unknown>,
  key: string,
): string[] => {
  const value = metadata[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
};

const formatSlug = (value: string): string =>
  value
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');