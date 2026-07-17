import {
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Filter,
  GraduationCap,
  ImageIcon,
  Laptop2,
  Layers3,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { WebsiteContentRecord } from '@jcst/shared';
import { PageError, PageLoading } from '@/components/common/PageState';
import {
  useWebsiteCollection,
  useWebsiteItem,
} from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

interface FilterOption {
  value: string;
  label: string;
}

export const ProgramsPage = () => {
  const { text } = usePublicWebsite();
  const pageQuery = useWebsiteItem('page', 'programs');
  const programsQuery = useWebsiteCollection('program');
  const departmentsQuery = useWebsiteCollection('department');

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [qualificationFilter, setQualificationFilter] = useState('all');
  const [studyModeFilter, setStudyModeFilter] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const loading =
    pageQuery.isLoading ||
    programsQuery.isLoading ||
    departmentsQuery.isLoading;

  // These defaults make every hook run on every render, including the
  // initial loading render. This prevents React's hook-order error.
  const programs = programsQuery.data ?? [];
  const departments = departmentsQuery.data ?? [];

  const departmentMap = useMemo(
    () =>
      new Map(
        departments.map(
          (department) => [department.slug, department.title] as const,
        ),
      ),
    [departments],
  );

  const departmentOptions = useMemo(
    () =>
      departments.map((department) => ({
        value: department.slug,
        label: department.title.replace(/^Department of\s+/i, ''),
      })),
    [departments],
  );

  const qualificationOptions = useMemo(
    () =>
      uniqueOptions(
        programs.map((program) =>
          getString(program.metadata, 'qualification'),
        ),
      ),
    [programs],
  );

  const studyModeOptions = useMemo(
    () =>
      uniqueOptions(
        programs.flatMap((program) =>
          getStringArray(program.metadata, 'studyModes'),
        ),
      ),
    [programs],
  );

  const filteredPrograms = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return programs.filter((program) => {
      const department = getString(program.metadata, 'department');
      const qualification = getString(program.metadata, 'qualification');
      const studyModes = getStringArray(program.metadata, 'studyModes');
      const searchableText = [
        program.title,
        program.excerpt,
        program.body,
        getString(program.metadata, 'code'),
        departmentMap.get(department) ?? '',
        qualification,
        ...studyModes,
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesDepartment =
        departmentFilter === 'all' || department === departmentFilter;
      const matchesQualification =
        qualificationFilter === 'all' ||
        qualification.toLowerCase() === qualificationFilter.toLowerCase();
      const matchesStudyMode =
        studyModeFilter === 'all' ||
        studyModes.some(
          (mode) => mode.toLowerCase() === studyModeFilter.toLowerCase(),
        );

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesQualification &&
        matchesStudyMode
      );
    });
  }, [
    departmentFilter,
    departmentMap,
    programs,
    qualificationFilter,
    searchTerm,
    studyModeFilter,
  ]);

  if (loading) {
    return <PageLoading />;
  }

  if (
    pageQuery.isError ||
    programsQuery.isError ||
    departmentsQuery.isError ||
    !pageQuery.data
  ) {
    return <PageError message={text('global.errors.page-load')} />;
  }

  const page = pageQuery.data;

  const activeFilterCount = [
    departmentFilter,
    qualificationFilter,
    studyModeFilter,
  ].filter((value) => value !== 'all').length + (searchTerm.trim() ? 1 : 0);

  const resetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('all');
    setQualificationFilter('all');
    setStudyModeFilter('all');
  };

  return (
    <div className="overflow-x-clip bg-slate-50">
      <ProgramsHero page={page} programCount={programs.length} />

      <section className="relative py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[285px_minmax(0,1fr)]">
            <aside className="hidden lg:sticky lg:top-28 lg:block">
              <FilterPanel
                page={page}
                departmentOptions={departmentOptions}
                qualificationOptions={qualificationOptions}
                studyModeOptions={studyModeOptions}
                departmentFilter={departmentFilter}
                qualificationFilter={qualificationFilter}
                studyModeFilter={studyModeFilter}
                onDepartmentChange={setDepartmentFilter}
                onQualificationChange={setQualificationFilter}
                onStudyModeChange={setStudyModeFilter}
                onReset={resetFilters}
                activeFilterCount={activeFilterCount}
              />
            </aside>

            <div className="min-w-0">
              <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,.06)] sm:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                        'Search programs, codes, departments...'
                      }
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[var(--jcst-accent)] focus:bg-white focus:ring-4 focus:ring-amber-100/60"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[var(--jcst-accent)] lg:hidden"
                  >
                    <SlidersHorizontal size={18} />
                    Filters
                    {activeFilterCount ? (
                      <span
                        className="grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs text-white"
                        style={{ background: 'var(--jcst-secondary)' }}
                      >
                        {activeFilterCount}
                      </span>
                    ) : null}
                  </button>

                  <div className="text-sm text-slate-500">
                    <strong className="text-slate-800">
                      {filteredPrograms.length}
                    </strong>{' '}
                    {getString(page.metadata, 'resultsLabel') || 'programs found'}
                  </div>
                </div>
              </div>

              {activeFilterCount ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Active filters
                  </span>
                  {searchTerm.trim() ? (
                    <FilterChip
                      label={`Search: ${searchTerm.trim()}`}
                      onRemove={() => setSearchTerm('')}
                    />
                  ) : null}
                  {departmentFilter !== 'all' ? (
                    <FilterChip
                      label={
                        departmentOptions.find(
                          (option) => option.value === departmentFilter,
                        )?.label ?? departmentFilter
                      }
                      onRemove={() => setDepartmentFilter('all')}
                    />
                  ) : null}
                  {qualificationFilter !== 'all' ? (
                    <FilterChip
                      label={qualificationFilter}
                      onRemove={() => setQualificationFilter('all')}
                    />
                  ) : null}
                  {studyModeFilter !== 'all' ? (
                    <FilterChip
                      label={studyModeFilter}
                      onRemove={() => setStudyModeFilter('all')}
                    />
                  ) : null}
                </div>
              ) : null}

              {filteredPrograms.length ? (
                <div className="mt-7 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredPrograms.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      departmentName={
                        departmentMap.get(
                          getString(program.metadata, 'department'),
                        ) ?? ''
                      }
                      actionLabel={
                        getString(page.metadata, 'cardActionLabel') ||
                        'View Details'
                      }
                    />
                  ))}
                </div>
              ) : (
                <EmptyProgramsState
                  title={
                    getString(page.metadata, 'emptyTitle') ||
                    'No programs match your filters'
                  }
                  description={
                    getString(page.metadata, 'emptyDescription') ||
                    'Reset the filters or try a different search term.'
                  }
                  onReset={resetFilters}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <ProgramsCta page={page} />

      {mobileFiltersOpen ? (
        <MobileFilterDrawer onClose={() => setMobileFiltersOpen(false)}>
          <FilterPanel
            page={page}
            departmentOptions={departmentOptions}
            qualificationOptions={qualificationOptions}
            studyModeOptions={studyModeOptions}
            departmentFilter={departmentFilter}
            qualificationFilter={qualificationFilter}
            studyModeFilter={studyModeFilter}
            onDepartmentChange={setDepartmentFilter}
            onQualificationChange={setQualificationFilter}
            onStudyModeChange={setStudyModeFilter}
            onReset={resetFilters}
            activeFilterCount={activeFilterCount}
          />
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl font-semibold text-white"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            Show {filteredPrograms.length} programs
          </button>
        </MobileFilterDrawer>
      ) : null}
    </div>
  );
};

const ProgramsHero = ({
  page,
  programCount,
}: {
  page: WebsiteContentRecord;
  programCount: number;
}) => {
  const metadata = page.metadata;

  return (
    <section
      className="relative isolate overflow-hidden text-white"
      style={{ background: 'var(--jcst-dark)' }}
    >
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_12%_18%,rgba(197,139,20,.18),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(155,17,30,.3),transparent_34%),linear-gradient(135deg,rgba(8,47,99,.99),rgba(6,26,53,.99))]" />
      <div className="absolute inset-0 -z-20 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto grid min-h-[510px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_.8fr] lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-sm font-semibold backdrop-blur-xl">
            <Sparkles size={15} style={{ color: 'var(--jcst-accent)' }} />
            <span style={{ color: 'var(--jcst-accent)' }}>
              {getString(metadata, 'eyebrow') || 'Academic Programs'}
            </span>
          </div>

          <h1 className="mt-7 max-w-3xl font-display text-4xl font-bold leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            {page.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            {page.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {getStringArray(metadata, 'heroHighlights').map((highlight) => (
              <span
                key={highlight}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-slate-300"
              >
                <CheckCircle2
                  size={14}
                  style={{ color: 'var(--jcst-accent)' }}
                />
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <HeroMetric
            icon={<GraduationCap size={23} />}
            value={`${programCount}`}
            label={getString(metadata, 'programCountLabel') || 'Active programs'}
          />
          <HeroMetric
            icon={<Laptop2 size={23} />}
            value={getString(metadata, 'deliveryValue') || 'Blended'}
            label={getString(metadata, 'deliveryLabel') || 'Learning delivery'}
          />
          <HeroMetric
            icon={<Clock3 size={23} />}
            value={getString(metadata, 'durationValue') || '2–4 Years'}
            label={getString(metadata, 'durationLabel') || 'Study duration'}
          />
          <HeroMetric
            icon={<BriefcaseBusiness size={23} />}
            value={getString(metadata, 'outcomeValue') || 'Career Ready'}
            label={getString(metadata, 'outcomeLabel') || 'Graduate outcome'}
          />
        </div>
      </div>
    </section>
  );
};

const HeroMetric = ({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) => (
  <article className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl sm:p-5">
    <span
      className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.08]"
      style={{ color: 'var(--jcst-accent)' }}
    >
      {icon}
    </span>
    <p className="mt-4 break-words font-display text-xl font-bold sm:text-2xl">
      {value}
    </p>
    <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm">{label}</p>
  </article>
);

const FilterPanel = ({
  page,
  departmentOptions,
  qualificationOptions,
  studyModeOptions,
  departmentFilter,
  qualificationFilter,
  studyModeFilter,
  onDepartmentChange,
  onQualificationChange,
  onStudyModeChange,
  onReset,
  activeFilterCount,
}: {
  page: WebsiteContentRecord;
  departmentOptions: FilterOption[];
  qualificationOptions: FilterOption[];
  studyModeOptions: FilterOption[];
  departmentFilter: string;
  qualificationFilter: string;
  studyModeFilter: string;
  onDepartmentChange: (value: string) => void;
  onQualificationChange: (value: string) => void;
  onStudyModeChange: (value: string) => void;
  onReset: () => void;
  activeFilterCount: number;
}) => (
  <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,.06)]">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Filter size={18} style={{ color: 'var(--jcst-secondary)' }} />
        <h2 className="font-display text-xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
          {getString(page.metadata, 'filtersTitle') || 'Filter Programs'}
        </h2>
      </div>

      {activeFilterCount ? (
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-bold text-jcst-crimson transition hover:underline"
        >
          Reset
        </button>
      ) : null}
    </div>

    <div className="mt-6 grid gap-5">
      <SelectFilter
        label={getString(page.metadata, 'departmentFilterLabel') || 'Department'}
        value={departmentFilter}
        options={departmentOptions}
        allLabel="All departments"
        onChange={onDepartmentChange}
      />

      <SelectFilter
        label={
          getString(page.metadata, 'qualificationFilterLabel') ||
          'Qualification'
        }
        value={qualificationFilter}
        options={qualificationOptions}
        allLabel="All qualifications"
        onChange={onQualificationChange}
      />

      <SelectFilter
        label={getString(page.metadata, 'studyModeFilterLabel') || 'Study mode'}
        value={studyModeFilter}
        options={studyModeOptions}
        allLabel="All study modes"
        onChange={onStudyModeChange}
      />
    </div>
  </div>
);

const SelectFilter = ({
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  allLabel: string;
  onChange: (value: string) => void;
}) => (
  <label className="block">
    <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
      {label}
    </span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[var(--jcst-accent)] focus:bg-white focus:ring-4 focus:ring-amber-100/60"
    >
      <option value="all">{allLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const ProgramCard = ({
  program,
  departmentName,
  actionLabel,
}: {
  program: WebsiteContentRecord;
  departmentName: string;
  actionLabel: string;
}) => {
  const metadata = program.metadata;
  const studyModes = getStringArray(metadata, 'studyModes');
  const highlights = getStringArray(metadata, 'highlights').slice(0, 3);

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,.06)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--jcst-accent)] hover:shadow-[0_24px_54px_rgba(15,23,42,.12)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <SmartImage
          source={program.imageUrl}
          alt={getString(metadata, 'imageAlt') || program.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.82),transparent_72%)]" />

        <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-jcst-crimson shadow-sm backdrop-blur">
          {getString(metadata, 'code')}
        </span>

        {getBoolean(metadata, 'eLearningEnabled') ? (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/55 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
            <Laptop2 size={13} style={{ color: 'var(--jcst-accent)' }} />
            E-Learning
          </span>
        ) : null}

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <p className="line-clamp-2 text-xs font-semibold text-white/90">
            {departmentName}
          </p>
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white shadow-xl"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            <CmsIcon name={program.icon || 'graduation'} size={20} />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-jcst-crimson">
          {getString(metadata, 'qualification')}
        </p>

        <h2
          className="mt-2 font-display text-xl font-bold leading-snug"
          style={{ color: 'var(--jcst-primary)' }}
        >
          {program.title}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
          {program.excerpt}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3">
          <ProgramFact
            icon={<Clock3 size={15} />}
            label="Duration"
            value={getString(metadata, 'duration')}
          />
          <ProgramFact
            icon={<BookOpenCheck size={15} />}
            label="Credits"
            value={`${getNumber(metadata, 'requiredCredits')} credits`}
          />
        </div>

        {studyModes.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {studyModes.slice(0, 3).map((mode) => (
              <span
                key={mode}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600"
              >
                {mode}
              </span>
            ))}
          </div>
        ) : null}

        {highlights.length ? (
          <div className="mt-5 grid gap-2 border-t border-slate-100 pt-4">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                <CheckCircle2
                  size={14}
                  className="mt-0.5 shrink-0"
                  style={{ color: 'var(--jcst-accent)' }}
                />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        ) : null}

        <Link
          to={`/programs/${program.slug}`}
          className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-jcst-crimson"
        >
          {actionLabel}
          <ArrowRight size={17} className="transition group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};

const ProgramFact = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <div className="min-w-0">
    <div className="flex items-center gap-1.5 text-slate-400">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
        {label}
      </span>
    </div>
    <p className="mt-1 break-words text-xs font-bold text-slate-700 sm:text-sm">
      {value}
    </p>
  </div>
);

const FilterChip = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <button
    type="button"
    onClick={onRemove}
    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:text-jcst-crimson"
  >
    {label}
    <X size={13} />
  </button>
);

const EmptyProgramsState = ({
  title,
  description,
  onReset,
}: {
  title: string;
  description: string;
  onReset: () => void;
}) => (
  <div className="mt-8 rounded-[30px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500">
      <Search size={23} />
    </span>
    <h2 className="mt-5 font-display text-2xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
      {title}
    </h2>
    <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">{description}</p>
    <button
      type="button"
      onClick={onReset}
      className="mt-6 inline-flex h-11 items-center justify-center rounded-xl px-5 font-semibold text-white"
      style={{ background: 'var(--jcst-secondary)' }}
    >
      Reset filters
    </button>
  </div>
);

const MobileFilterDrawer = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-[80] lg:hidden">
    <button
      type="button"
      aria-label="Close filters"
      onClick={onClose}
      className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
    />
    <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-[28px] bg-slate-50 p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="font-display text-xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
          Program filters
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600"
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const ProgramsCta = ({ page }: { page: WebsiteContentRecord }) => {
  const metadata = page.metadata;

  return (
    <section className="relative isolate overflow-hidden py-16 text-white sm:py-20">
      <SmartImage
        source={getString(metadata, 'ctaImageUrl')}
        alt={getString(metadata, 'ctaImageAlt')}
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(6,26,53,.99),rgba(8,47,99,.94)_58%,rgba(155,17,30,.86))]" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.19em]" style={{ color: 'var(--jcst-accent)' }}>
            {getString(metadata, 'ctaEyebrow') || 'Choose your future'}
          </p>
          <h2 className="mt-5 font-display text-4xl font-bold sm:text-5xl">
            {getString(metadata, 'ctaTitle') || 'Ready to begin your academic journey?'}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
            {getString(metadata, 'ctaDescription')}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={getString(metadata, 'ctaPrimaryUrl') || '/apply'}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white shadow-xl transition hover:-translate-y-1"
              style={{ background: 'var(--jcst-secondary)' }}
            >
              {getString(metadata, 'ctaPrimaryLabel') || 'Apply Now'}
              <ArrowRight size={18} />
            </Link>
            <Link
              to={getString(metadata, 'ctaSecondaryUrl') || '/contact'}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
            >
              {getString(metadata, 'ctaSecondaryLabel') || 'Talk to Admissions'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const SmartImage = ({
  source,
  alt,
  className,
}: {
  source: string;
  alt: string;
  className: string;
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
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

const uniqueOptions = (values: string[]): FilterOption[] =>
  Array.from(new Set(values.filter(Boolean))).map((value) => ({
    value,
    label: value,
  }));

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

const getNumber = (
  metadata: Record<string, unknown>,
  key: string,
): number => {
  const value = metadata[key];
  return typeof value === 'number' ? value : 0;
};

const getBoolean = (
  metadata: Record<string, unknown>,
  key: string,
): boolean => metadata[key] === true;

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
    book: BookOpenCheck,
    briefcase: BriefcaseBusiness,
    graduation: GraduationCap,
    laptop: Laptop2,
    layers: Layers3,
    users: Users,
  };

  const Icon = icons[name] ?? GraduationCap;
  return <Icon {...props} />;
};