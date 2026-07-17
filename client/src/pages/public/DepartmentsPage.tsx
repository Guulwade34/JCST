import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
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

interface DepartmentSummary {
  department: WebsiteContentRecord;
  programCount: number;
  courseCount: number;
  lecturerCount: number;
}

export const DepartmentsPage = () => {
  const { text } = usePublicWebsite();
  const pageQuery = useWebsiteItem('page', 'departments');
  const departmentsQuery = useWebsiteCollection('department');
  const programsQuery = useWebsiteCollection('program');
  const coursesQuery = useWebsiteCollection('course');
  const lecturersQuery = useWebsiteCollection('lecturer');

  const [searchTerm, setSearchTerm] = useState('');
  const [focusFilter, setFocusFilter] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const page = pageQuery.data;
  const departments = departmentsQuery.data ?? [];
  const programs = programsQuery.data ?? [];
  const courses = coursesQuery.data ?? [];
  const lecturers = lecturersQuery.data ?? [];

  const departmentSummaries = useMemo<DepartmentSummary[]>(
    () =>
      departments.map((department) => {
        const aliases = [department.slug, ...getStringArray(department.metadata, 'aliases')];

        return {
          department,
          programCount: programs.filter((item) =>
            aliases.includes(getString(item.metadata, 'department')),
          ).length,
          courseCount: courses.filter((item) =>
            aliases.includes(getString(item.metadata, 'department')),
          ).length,
          lecturerCount: lecturers.filter((item) =>
            aliases.includes(getString(item.metadata, 'department')),
          ).length,
        };
      }),
    [courses, departments, lecturers, programs],
  );

  const focusOptions = useMemo(
    () =>
      Array.from(
        new Set(
          departments
            .map((department) => getString(department.metadata, 'focusArea'))
            .filter(Boolean),
        ),
      ).sort((a: string, b: string) => a.localeCompare(b)),
    [departments],
  );

  const filteredDepartments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return departmentSummaries.filter(({ department }) => {
      const metadata = department.metadata;
      const searchableText = [
        department.title,
        department.excerpt,
        department.body,
        getString(metadata, 'code'),
        getString(metadata, 'focusArea'),
        getString(metadata, 'mission'),
        getString(metadata, 'vision'),
        ...getStringArray(metadata, 'highlights'),
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);
      const matchesFocus =
        focusFilter === 'all' ||
        getString(metadata, 'focusArea').toLowerCase() === focusFilter.toLowerCase();

      return matchesSearch && matchesFocus;
    });
  }, [departmentSummaries, focusFilter, searchTerm]);

  const loading =
    pageQuery.isLoading ||
    departmentsQuery.isLoading ||
    programsQuery.isLoading ||
    coursesQuery.isLoading ||
    lecturersQuery.isLoading;

  if (loading) {
    return <PageLoading />;
  }

  if (
    pageQuery.isError ||
    departmentsQuery.isError ||
    programsQuery.isError ||
    coursesQuery.isError ||
    lecturersQuery.isError ||
    !page
  ) {
    return <PageError message={text('global.errors.page-load')} />;
  }

  const resetFilters = () => {
    setSearchTerm('');
    setFocusFilter('all');
  };

  return (
    <div className="overflow-x-clip bg-slate-50">
      <DepartmentsHero
        page={page}
        departmentCount={departments.length}
        programCount={programs.length}
        courseCount={courses.length}
        lecturerCount={lecturers.length}
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
                    'Search departments, disciplines, or study areas...'
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[var(--jcst-accent)] focus:bg-white focus:ring-4 focus:ring-amber-100/60"
                />
              </label>

              <div className="hidden items-center gap-3 lg:flex">
                <Filter size={18} className="text-slate-400" />
                <select
                  value={focusFilter}
                  onChange={(event) => setFocusFilter(event.target.value)}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[var(--jcst-accent)] focus:ring-4 focus:ring-amber-100/60"
                >
                  <option value="all">All Academic Areas</option>
                  {focusOptions.map((option) => (
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
                Filter Departments
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-jcst-crimson">
                {getString(page.metadata, 'resultsEyebrow') || 'Academic Units'}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-jcst-navy">
                {filteredDepartments.length} departments found
              </h2>
            </div>

            {searchTerm || focusFilter !== 'all' ? (
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

          {filteredDepartments.length ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {filteredDepartments.map((summary) => (
                <DepartmentCard key={summary.department.slug} summary={summary} page={page} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={resetFilters} page={page} />
          )}
        </div>
      </section>

      <DepartmentsCta page={page} />

      {mobileFiltersOpen ? (
        <MobileFilterDialog
          focusFilter={focusFilter}
          focusOptions={focusOptions}
          onFocusChange={setFocusFilter}
          onClose={() => setMobileFiltersOpen(false)}
          onReset={resetFilters}
        />
      ) : null}
    </div>
  );
};

const DepartmentsHero = ({
  page,
  departmentCount,
  programCount,
  courseCount,
  lecturerCount,
}: {
  page: WebsiteContentRecord;
  departmentCount: number;
  programCount: number;
  courseCount: number;
  lecturerCount: number;
}) => {
  const metadata = page.metadata;
  const metrics = [
    { value: `${departmentCount}`, label: getString(metadata, 'departmentCountLabel') || 'Academic departments', icon: Building2 },
    { value: `${programCount}`, label: getString(metadata, 'programCountLabel') || 'Programs', icon: GraduationCap },
    { value: `${courseCount}`, label: getString(metadata, 'courseCountLabel') || 'Courses', icon: BookOpenCheck },
    { value: `${lecturerCount}`, label: getString(metadata, 'lecturerCountLabel') || 'Academic staff', icon: Users },
  ];

  return (
    <section className="relative isolate overflow-hidden text-white" style={{ background: 'var(--jcst-dark)' }}>
      <SmartImage
        source={page.imageUrl}
        alt={getString(metadata, 'imageAlt')}
        className="absolute inset-0 -z-30 h-full w-full object-cover"
        priority
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(6,26,53,.99),rgba(8,47,99,.93)_58%,rgba(155,17,30,.78))]" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:52px_52px]" />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
            <Sparkles size={16} style={{ color: 'var(--jcst-accent)' }} />
            <span style={{ color: 'var(--jcst-accent)' }}>{getString(metadata, 'eyebrow')}</span>
          </div>

          <h1 className="mt-7 font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            {page.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">
            {page.excerpt}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {metrics.map(({ value, label, icon: Icon }) => (
              <article
                key={label}
                className="rounded-2xl border border-white/12 bg-white/[0.08] p-4 backdrop-blur-xl"
              >
                <Icon size={20} style={{ color: 'var(--jcst-accent)' }} />
                <p className="mt-3 font-display text-2xl font-bold">{value}</p>
                <p className="mt-1 text-xs font-medium leading-5 text-slate-300 sm:text-sm">{label}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const DepartmentCard = ({
  summary,
  page,
}: {
  summary: DepartmentSummary;
  page: WebsiteContentRecord;
}) => {
  const { department, programCount, courseCount, lecturerCount } = summary;
  const metadata = department.metadata;
  const highlights = getStringArray(metadata, 'highlights').slice(0, 3);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,.07)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--jcst-accent)] hover:shadow-[0_26px_60px_rgba(15,23,42,.12)]">
      <div className="relative min-h-[280px] overflow-hidden bg-slate-900">
        <SmartImage
          source={department.imageUrl}
          alt={getString(metadata, 'imageAlt') || department.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.96),rgba(6,26,53,.05)_72%)]" />
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-slate-950/55 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
            {getString(metadata, 'code')}
          </span>
          <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-xs font-bold text-amber-300 backdrop-blur">
            {getString(metadata, 'focusArea')}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="font-display text-3xl font-bold leading-tight">{department.title}</h2>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-200">{department.excerpt}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="grid grid-cols-3 gap-3">
          <CountCard value={programCount} label="Programs" icon={<GraduationCap size={17} />} />
          <CountCard value={courseCount} label="Courses" icon={<BookOpenCheck size={17} />} />
          <CountCard value={lecturerCount} label="Lecturers" icon={<Users size={17} />} />
        </div>

        {highlights.length ? (
          <div className="mt-6 grid gap-2">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--jcst-accent)' }} />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-auto pt-7">
          <Link
            to={`/departments/${department.slug}`}
            className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl px-5 font-semibold text-white transition duration-300 hover:-translate-y-0.5"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            {getString(page.metadata, 'cardActionLabel') || 'View Department Details'}
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
};

const CountCard = ({ value, label, icon }: { value: number; label: string; icon: ReactNode }) => (
  <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
    <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-white text-jcst-crimson shadow-sm">{icon}</span>
    <p className="mt-2 font-display text-lg font-bold text-jcst-navy">{value}</p>
    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500 sm:text-xs">{label}</p>
  </div>
);

const EmptyState = ({ onReset, page }: { onReset: () => void; page: WebsiteContentRecord }) => (
  <div className="mt-8 rounded-[30px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
    <Building2 size={34} className="mx-auto text-slate-400" />
    <h3 className="mt-5 font-display text-2xl font-bold text-jcst-navy">
      {getString(page.metadata, 'emptyTitle') || 'No departments match your search'}
    </h3>
    <p className="mx-auto mt-3 max-w-xl text-slate-600">
      {getString(page.metadata, 'emptyDescription') || 'Reset the filters and try another academic area.'}
    </p>
    <button
      type="button"
      onClick={onReset}
      className="mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white"
      style={{ background: 'var(--jcst-secondary)' }}
    >
      Reset Filters
    </button>
  </div>
);

const DepartmentsCta = ({ page }: { page: WebsiteContentRecord }) => {
  const metadata = page.metadata;

  return (
    <section className="relative isolate overflow-hidden py-16 text-white sm:py-20">
      <SmartImage
        source={getString(metadata, 'ctaImageUrl')}
        alt={getString(metadata, 'ctaImageAlt')}
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(6,26,53,.99),rgba(8,47,99,.94)_58%,rgba(155,17,30,.86))]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--jcst-accent)' }}>
            {getString(metadata, 'ctaEyebrow')}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            {getString(metadata, 'ctaTitle')}
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-200">
            {getString(metadata, 'ctaDescription')}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={getString(metadata, 'ctaPrimaryUrl') || '/programs'}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white shadow-xl transition hover:-translate-y-1"
              style={{ background: 'var(--jcst-secondary)' }}
            >
              {getString(metadata, 'ctaPrimaryLabel') || 'Explore Programs'}
              <ArrowRight size={18} />
            </Link>
            <Link
              to={getString(metadata, 'ctaSecondaryUrl') || '/e-learning'}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-amber-300/40 bg-white/10 px-7 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
            >
              <Laptop2 size={18} />
              {getString(metadata, 'ctaSecondaryLabel') || 'Open E-Learning'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const MobileFilterDialog = ({
  focusFilter,
  focusOptions,
  onFocusChange,
  onClose,
  onReset,
}: {
  focusFilter: string;
  focusOptions: string[];
  onFocusChange: (value: string) => void;
  onClose: () => void;
  onReset: () => void;
}) => (
  <div className="fixed inset-0 z-[100] flex items-end bg-slate-950/55 p-3 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true">
    <div className="w-full rounded-[26px] bg-white p-5 shadow-2xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-jcst-navy">Filter Departments</h2>
        <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
          <X size={19} />
        </button>
      </div>

      <label className="mt-6 block">
        <span className="text-sm font-semibold text-slate-700">Academic Area</span>
        <select
          value={focusFilter}
          onChange={(event) => onFocusChange(event.target.value)}
          className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
        >
          <option value="all">All Academic Areas</option>
          {focusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            onReset();
            onClose();
          }}
          className="h-12 rounded-xl border border-slate-200 font-semibold text-slate-700"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-12 rounded-xl font-semibold text-white"
          style={{ background: 'var(--jcst-secondary)' }}
        >
          Apply Filter
        </button>
      </div>
    </div>
  </div>
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

const getStringArray = (metadata: Record<string, unknown>, key: string): string[] => {
  const value = metadata[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
};