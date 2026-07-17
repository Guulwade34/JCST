import {
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  GraduationCap,
  ImageIcon,
  Laptop2,
  LibraryBig,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserRound,
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

interface FilterOption {
  value: string;
  label: string;
}

export const CoursesPage = () => {
  const { text } = usePublicWebsite();
  const pageQuery = useWebsiteItem('page', 'courses');
  const coursesQuery = useWebsiteCollection('course');
  const programsQuery = useWebsiteCollection('program');
  const departmentsQuery = useWebsiteCollection('department');

  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const page = pageQuery.data;
  const courses = coursesQuery.data ?? [];
  const programs = programsQuery.data ?? [];
  const departments = departmentsQuery.data ?? [];

  const programMap = useMemo(
    () => new Map(programs.map((program) => [program.slug, program.title] as const)),
    [programs],
  );

  const departmentMap = useMemo(
    () =>
      new Map(
        departments.map((department) => [department.slug, department.title] as const),
      ),
    [departments],
  );

  const programOptions = useMemo(
    () =>
      programs.map((program) => ({
        value: program.slug,
        label: program.title,
      })),
    [programs],
  );

  const departmentOptions = useMemo(
    () =>
      departments.map((department) => ({
        value: department.slug,
        label: department.title.replace(/^Department of\s+/i, ''),
      })),
    [departments],
  );

  const semesterOptions = useMemo(
    () => uniqueOptions(courses.map((course) => getString(course.metadata, 'semester'))),
    [courses],
  );

  const deliveryOptions = useMemo(
    () =>
      uniqueOptions(
        courses.flatMap((course) =>
          getStringArray(course.metadata, 'deliveryModes'),
        ),
      ),
    [courses],
  );

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return courses.filter((course) => {
      const metadata = course.metadata;
      const programSlug = getString(metadata, 'program');
      const departmentSlug = getString(metadata, 'department');
      const semester = getString(metadata, 'semester');
      const deliveryModes = getStringArray(metadata, 'deliveryModes');
      const instructor = getObject<Instructor>(metadata, 'instructor');

      const searchableText = [
        course.title,
        course.excerpt,
        course.body,
        getString(metadata, 'code'),
        getString(metadata, 'level'),
        getString(metadata, 'courseType'),
        programMap.get(programSlug) ?? '',
        departmentMap.get(departmentSlug) ?? '',
        instructor?.name ?? '',
        semester,
        ...deliveryModes,
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesProgram =
        programFilter === 'all' || programSlug === programFilter;
      const matchesDepartment =
        departmentFilter === 'all' || departmentSlug === departmentFilter;
      const matchesSemester =
        semesterFilter === 'all' ||
        semester.toLowerCase() === semesterFilter.toLowerCase();
      const matchesDelivery =
        deliveryFilter === 'all' ||
        deliveryModes.some(
          (mode) => mode.toLowerCase() === deliveryFilter.toLowerCase(),
        );

      return (
        matchesSearch &&
        matchesProgram &&
        matchesDepartment &&
        matchesSemester &&
        matchesDelivery
      );
    });
  }, [
    courses,
    deliveryFilter,
    departmentFilter,
    departmentMap,
    programFilter,
    programMap,
    searchTerm,
    semesterFilter,
  ]);

  const activeFilterCount =
    [programFilter, departmentFilter, semesterFilter, deliveryFilter].filter(
      (value) => value !== 'all',
    ).length + (searchTerm.trim() ? 1 : 0);

  const resetFilters = () => {
    setSearchTerm('');
    setProgramFilter('all');
    setDepartmentFilter('all');
    setSemesterFilter('all');
    setDeliveryFilter('all');
  };

  const loading =
    pageQuery.isLoading ||
    coursesQuery.isLoading ||
    programsQuery.isLoading ||
    departmentsQuery.isLoading;

  if (loading) {
    return <PageLoading />;
  }

  if (
    pageQuery.isError ||
    coursesQuery.isError ||
    programsQuery.isError ||
    departmentsQuery.isError ||
    !page
  ) {
    return <PageError message={text('global.errors.page-load')} />;
  }

  return (
    <div className="overflow-x-clip bg-slate-50">
      <CoursesHero page={page} courseCount={courses.length} />

      <section className="relative py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[285px_minmax(0,1fr)]">
            <aside className="hidden lg:sticky lg:top-28 lg:block">
              <FilterPanel
                page={page}
                programOptions={programOptions}
                departmentOptions={departmentOptions}
                semesterOptions={semesterOptions}
                deliveryOptions={deliveryOptions}
                programFilter={programFilter}
                departmentFilter={departmentFilter}
                semesterFilter={semesterFilter}
                deliveryFilter={deliveryFilter}
                onProgramChange={setProgramFilter}
                onDepartmentChange={setDepartmentFilter}
                onSemesterChange={setSemesterFilter}
                onDeliveryChange={setDeliveryFilter}
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
                        'Search courses, codes, programs, lecturers...'
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
                      {filteredCourses.length}
                    </strong>{' '}
                    {getString(page.metadata, 'resultsLabel') || 'courses found'}
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

                  {programFilter !== 'all' ? (
                    <FilterChip
                      label={programMap.get(programFilter) ?? programFilter}
                      onRemove={() => setProgramFilter('all')}
                    />
                  ) : null}

                  {departmentFilter !== 'all' ? (
                    <FilterChip
                      label={departmentMap.get(departmentFilter) ?? departmentFilter}
                      onRemove={() => setDepartmentFilter('all')}
                    />
                  ) : null}

                  {semesterFilter !== 'all' ? (
                    <FilterChip
                      label={semesterFilter}
                      onRemove={() => setSemesterFilter('all')}
                    />
                  ) : null}

                  {deliveryFilter !== 'all' ? (
                    <FilterChip
                      label={deliveryFilter}
                      onRemove={() => setDeliveryFilter('all')}
                    />
                  ) : null}

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-2 py-1 text-xs font-semibold text-jcst-crimson transition hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              ) : null}

              {filteredCourses.length ? (
                <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCourses.map((course) => {
                    const programTitle = programMap.get(getString(course.metadata, 'program'));
                    const departmentTitle = departmentMap.get(getString(course.metadata, 'department'));
                    return (
                      <CourseCard
                        key={course.slug}
                        course={course}
                        {...(programTitle && { programTitle })}
                        {...(departmentTitle && { departmentTitle })}
                        actionLabel={
                          getString(page.metadata, 'cardActionLabel') ||
                          'View Course Details'
                        }
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyState page={page} onReset={resetFilters} />
              )}
            </div>
          </div>
        </div>
      </section>

      <CoursesCta page={page} />

      {mobileFiltersOpen ? (
        <MobileFilterDrawer onClose={() => setMobileFiltersOpen(false)}>
          <FilterPanel
            page={page}
            programOptions={programOptions}
            departmentOptions={departmentOptions}
            semesterOptions={semesterOptions}
            deliveryOptions={deliveryOptions}
            programFilter={programFilter}
            departmentFilter={departmentFilter}
            semesterFilter={semesterFilter}
            deliveryFilter={deliveryFilter}
            onProgramChange={setProgramFilter}
            onDepartmentChange={setDepartmentFilter}
            onSemesterChange={setSemesterFilter}
            onDeliveryChange={setDeliveryFilter}
            onReset={resetFilters}
            activeFilterCount={activeFilterCount}
          />

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl font-semibold text-white"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            Show {filteredCourses.length} courses
          </button>
        </MobileFilterDrawer>
      ) : null}
    </div>
  );
};

const CoursesHero = ({
  page,
  courseCount,
}: {
  page: WebsiteContentRecord;
  courseCount: number;
}) => {
  const metadata = page.metadata;
  const highlights = getStringArray(metadata, 'heroHighlights');

  return (
    <section
      className="relative isolate overflow-hidden text-white"
      style={{ background: 'var(--jcst-dark)' }}
    >
      <SmartImage
        source={page.imageUrl}
        alt={getString(metadata, 'imageAlt') || page.title}
        className="absolute inset-0 -z-40 h-full w-full object-cover"
        priority
      />
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,rgba(6,26,53,.99),rgba(8,47,99,.94)_58%,rgba(155,17,30,.78))]" />
      <div className="absolute inset-0 -z-20 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto grid min-h-[540px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_.8fr] lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-semibold backdrop-blur">
            <Sparkles size={15} style={{ color: 'var(--jcst-accent)' }} />
            <span style={{ color: 'var(--jcst-accent)' }}>
              {getString(metadata, 'eyebrow') || 'JCST Course Catalogue'}
            </span>
          </div>

          <h1 className="mt-7 max-w-4xl font-display text-4xl font-bold leading-[1.04] tracking-[-0.03em] sm:text-5xl lg:text-[3.8rem]">
            {page.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            {page.excerpt}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {highlights.slice(0, 3).map((highlight) => (
              <div
                key={highlight}
                className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur"
              >
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0"
                  style={{ color: 'var(--jcst-accent)' }}
                />
                <span className="text-sm leading-6 text-slate-200">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <HeroMetric
            value={`${courseCount}+`}
            label={getString(metadata, 'courseCountLabel') || 'Published courses'}
            icon={<LibraryBig size={21} />}
          />
          <HeroMetric
            value={getString(metadata, 'deliveryValue') || 'Blended'}
            label={getString(metadata, 'deliveryLabel') || 'Course delivery'}
            icon={<Laptop2 size={21} />}
          />
          <HeroMetric
            value={getString(metadata, 'creditValue') || '3 Credits'}
            label={getString(metadata, 'creditLabel') || 'Typical course load'}
            icon={<BookOpenCheck size={21} />}
          />
          <HeroMetric
            value={getString(metadata, 'supportValue') || 'Guided'}
            label={getString(metadata, 'supportLabel') || 'Academic support'}
            icon={<UserRound size={21} />}
          />
        </div>
      </div>
    </section>
  );
};

const HeroMetric = ({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: ReactNode;
}) => (
  <article className="rounded-[22px] border border-white/12 bg-white/[0.08] p-4 backdrop-blur-xl sm:p-5">
    <span
      className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.09]"
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

const CourseCard = ({
  course,
  programTitle,
  departmentTitle,
  actionLabel,
}: {
  course: WebsiteContentRecord;
  programTitle?: string;
  departmentTitle?: string;
  actionLabel: string;
}) => {
  const metadata = course.metadata;
  const instructor = getObject<Instructor>(metadata, 'instructor');
  const deliveryModes = getStringArray(metadata, 'deliveryModes');
  const credits = getNumber(metadata, 'credits');

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_42px_rgba(15,23,42,.07)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--jcst-accent)] hover:shadow-[0_24px_58px_rgba(15,23,42,.12)]">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <SmartImage
          source={course.imageUrl}
          alt={getString(metadata, 'imageAlt') || course.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.82),transparent_68%)]" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-jcst-navy shadow-lg">
            {getString(metadata, 'code')}
          </span>
          {getBoolean(metadata, 'eLearningEnabled') ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-lg">
              <Laptop2 size={13} />
              E-Learning
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="line-clamp-1 text-xs font-semibold uppercase tracking-[0.13em] text-amber-300">
            {departmentTitle || 'Academic Course'}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {getString(metadata, 'semester')}
          </span>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-jcst-crimson">
            {getString(metadata, 'courseType')}
          </span>
        </div>

        <h2
          className="mt-4 font-display text-xl font-bold leading-snug"
          style={{ color: 'var(--jcst-primary)' }}
        >
          {course.title}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
          {course.excerpt}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4 text-xs text-slate-600">
          <CourseMeta icon={<BookOpenCheck size={15} />} label={`${credits} credits`} />
          <CourseMeta
            icon={<CalendarDays size={15} />}
            label={getString(metadata, 'level')}
          />
          <CourseMeta
            icon={<Clock3 size={15} />}
            label={getString(metadata, 'contactHours')}
          />
          <CourseMeta
            icon={<Laptop2 size={15} />}
            label={deliveryModes[0] || 'On-campus'}
          />
        </div>

        {programTitle ? (
          <p className="mt-4 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">
            <span className="text-slate-400">Program:</span> {programTitle}
          </p>
        ) : null}

        {instructor?.name ? (
          <div className="mt-4 flex items-center gap-3">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100"
              style={{ color: 'var(--jcst-secondary)' }}
            >
              <UserRound size={17} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {instructor.name}
              </p>
              <p className="truncate text-xs text-slate-500">
                {instructor.title || 'Course Instructor'}
              </p>
            </div>
          </div>
        ) : null}

        <Link
          to={`/courses/${course.slug}`}
          className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl font-semibold text-white transition duration-300 hover:-translate-y-0.5"
          style={{ background: 'var(--jcst-secondary)' }}
        >
          {actionLabel}
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
};

const CourseMeta = ({ icon, label }: { icon: ReactNode; label: string }) => (
  <div className="flex min-w-0 items-center gap-2">
    <span className="shrink-0 text-jcst-crimson">{icon}</span>
    <span className="truncate">{label}</span>
  </div>
);

const FilterPanel = ({
  page,
  programOptions,
  departmentOptions,
  semesterOptions,
  deliveryOptions,
  programFilter,
  departmentFilter,
  semesterFilter,
  deliveryFilter,
  onProgramChange,
  onDepartmentChange,
  onSemesterChange,
  onDeliveryChange,
  onReset,
  activeFilterCount,
}: {
  page: WebsiteContentRecord;
  programOptions: FilterOption[];
  departmentOptions: FilterOption[];
  semesterOptions: FilterOption[];
  deliveryOptions: FilterOption[];
  programFilter: string;
  departmentFilter: string;
  semesterFilter: string;
  deliveryFilter: string;
  onProgramChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onDeliveryChange: (value: string) => void;
  onReset: () => void;
  activeFilterCount: number;
}) => (
  <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,.06)]">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Filter size={18} className="text-jcst-crimson" />
        <h2 className="font-display text-xl font-bold text-jcst-navy">
          {getString(page.metadata, 'filtersTitle') || 'Filter Courses'}
        </h2>
      </div>

      {activeFilterCount ? (
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-jcst-crimson hover:underline"
        >
          Reset
        </button>
      ) : null}
    </div>

    <div className="mt-6 grid gap-5">
      <SelectFilter
        label={getString(page.metadata, 'programFilterLabel') || 'Program'}
        value={programFilter}
        options={programOptions}
        onChange={onProgramChange}
      />
      <SelectFilter
        label={
          getString(page.metadata, 'departmentFilterLabel') || 'Department'
        }
        value={departmentFilter}
        options={departmentOptions}
        onChange={onDepartmentChange}
      />
      <SelectFilter
        label={getString(page.metadata, 'semesterFilterLabel') || 'Semester'}
        value={semesterFilter}
        options={semesterOptions}
        onChange={onSemesterChange}
      />
      <SelectFilter
        label={getString(page.metadata, 'deliveryFilterLabel') || 'Delivery'}
        value={deliveryFilter}
        options={deliveryOptions}
        onChange={onDeliveryChange}
      />
    </div>
  </div>
);

const SelectFilter = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) => (
  <label className="block">
    <span className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
      {label}
    </span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-[var(--jcst-accent)] focus:bg-white focus:ring-4 focus:ring-amber-100/60"
    >
      <option value="all">All</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const FilterChip = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
    <span className="max-w-[220px] truncate">{label}</span>
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${label} filter`}
      className="grid h-5 w-5 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
    >
      <X size={13} />
    </button>
  </span>
);

const EmptyState = ({
  page,
  onReset,
}: {
  page: WebsiteContentRecord;
  onReset: () => void;
}) => (
  <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-jcst-crimson">
      <Search size={23} />
    </span>
    <h2 className="mt-5 font-display text-2xl font-bold text-jcst-navy">
      {getString(page.metadata, 'emptyTitle') || 'No matching courses'}
    </h2>
    <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
      {getString(page.metadata, 'emptyDescription') ||
        'Reset the filters or try a different course title, code, program, or department.'}
    </p>
    <button
      type="button"
      onClick={onReset}
      className="mt-6 inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white"
      style={{ background: 'var(--jcst-secondary)' }}
    >
      Reset Filters
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
  <div className="fixed inset-0 z-[100] lg:hidden">
    <button
      type="button"
      aria-label="Close course filters"
      onClick={onClose}
      className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
    />

    <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-[30px] bg-slate-50 p-4 shadow-2xl">
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="font-display text-xl font-bold text-jcst-navy">
          Course Filters
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-600 shadow-sm"
        >
          <X size={19} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const CoursesCta = ({ page }: { page: WebsiteContentRecord }) => {
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
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
            <Sparkles size={16} style={{ color: 'var(--jcst-accent)' }} />
            <span style={{ color: 'var(--jcst-accent)' }}>
              {getString(metadata, 'ctaEyebrow')}
            </span>
          </div>

          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            {getString(metadata, 'ctaTitle')}
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
            {getString(metadata, 'ctaDescription')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={getString(metadata, 'ctaPrimaryUrl') || '/programs'}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white transition hover:-translate-y-1"
              style={{ background: 'var(--jcst-secondary)' }}
            >
              {getString(metadata, 'ctaPrimaryLabel') || 'Explore Programs'}
              <ArrowRight size={18} />
            </Link>

            <Link
              to={getString(metadata, 'ctaSecondaryUrl') || '/e-learning'}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-amber-300/50 bg-white/[0.07] px-7 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.13]"
            >
              {getString(metadata, 'ctaSecondaryLabel') || 'Open E-Learning'}
              <Laptop2 size={18} />
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

interface Instructor {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
}

const uniqueOptions = (values: string[]): FilterOption[] =>
  [...new Set(values.map((value) => value.trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value, label: value }));

const getString = (
  metadata: Record<string, unknown>,
  key: string,
): string => {
  const value = metadata[key];
  return typeof value === 'string' ? value : '';
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

const getStringArray = (
  metadata: Record<string, unknown>,
  key: string,
): string[] => {
  const value = metadata[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
};

const getObject = <T extends object>(
  metadata: Record<string, unknown>,
  key: string,
): T | null => {
  const value = metadata[key];
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as T)
    : null;
};