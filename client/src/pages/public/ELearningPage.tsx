import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Filter,
  GraduationCap,
  ImageIcon,
  Laptop2,
  LockKeyhole,
  MonitorPlay,
  PlayCircle,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  UserRound,
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

interface Instructor {
  name?: string;
  title?: string;
}

interface MarketplaceFeature {
  title: string;
  description: string;
  icon: 'lock' | 'mobile' | 'progress' | 'support';
}

export const ELearningPage = () => {
  const pageQuery = useWebsiteItem('page', 'e-learning');
  const coursesQuery = useWebsiteCollection('course');
  const { text } = usePublicWebsite();

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const page = pageQuery.data;
  const courses = useMemo(
    () =>
      (coursesQuery.data ?? []).filter(
        (course) =>
          getBoolean(course.metadata, 'eLearningEnabled') &&
          getBoolean(course.metadata, 'isPaidCourse'),
      ),
    [coursesQuery.data],
  );

  const categories = useMemo(
    () => uniqueValues(courses.map((course) => getString(course.metadata, 'category'))),
    [courses],
  );

  const levels = useMemo(
    () => uniqueValues(courses.map((course) => getString(course.metadata, 'level'))),
    [courses],
  );

  const filteredCourses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return courses.filter((course) => {
      const metadata = course.metadata;
      const instructor = getObject<Instructor>(metadata, 'instructor');
      const searchable = [
        course.title,
        course.excerpt,
        getString(metadata, 'code'),
        getString(metadata, 'category'),
        getString(metadata, 'level'),
        getString(metadata, 'department'),
        instructor?.name ?? '',
      ]
        .join(' ')
        .toLowerCase();

      return (
        (!query || searchable.includes(query)) &&
        (category === 'all' || getString(metadata, 'category') === category) &&
        (level === 'all' || getString(metadata, 'level') === level)
      );
    });
  }, [category, courses, level, searchTerm]);

  if (pageQuery.isLoading || coursesQuery.isLoading) {
    return <PageLoading />;
  }

  if (pageQuery.isError || coursesQuery.isError || !page) {
    return <PageError message={text('global.errors.page-load')} />;
  }

  const metadata = page.metadata;
  const features = getObjectArray<MarketplaceFeature>(metadata, 'marketplaceFeatures');

  const resetFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setLevel('all');
  };

  return (
    <div className="overflow-x-clip bg-slate-50">
      <MarketplaceHero page={page} courseCount={courses.length} />

      <section className="border-b border-slate-200 bg-white py-8 sm:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:gap-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          <MetricCard icon={<BookOpenCheck size={20} />} value={`${courses.length}+`} label="Paid online courses" />
          <MetricCard icon={<MonitorPlay size={20} />} value="1 Free" label="Introduction preview" />
          <MetricCard icon={<LockKeyhole size={20} />} value="Secure" label="Locked premium lessons" />
          <MetricCard icon={<GraduationCap size={20} />} value="Certificate" label="Completion eligibility" />
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.19em] text-jcst-crimson">
                {getString(metadata, 'catalogEyebrow') || 'Course Marketplace'}
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-jcst-navy sm:text-4xl lg:text-[2.7rem]">
                {getString(metadata, 'catalogTitle') || 'Choose the course that moves your future forward'}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                {getString(metadata, 'catalogDescription') ||
                  'Every course displays its full fee, learning outcomes, instructor, duration, curriculum, and one free introduction preview before purchase.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm lg:hidden"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">
            <aside className="hidden lg:sticky lg:top-28 lg:block">
              <FilterPanel
                searchTerm={searchTerm}
                category={category}
                level={level}
                categories={categories}
                levels={levels}
                onSearch={setSearchTerm}
                onCategory={setCategory}
                onLevel={setLevel}
                onReset={resetFilters}
              />
            </aside>

            <div className="min-w-0">
              <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,.05)] sm:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <label className="relative block flex-1 lg:hidden">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search courses, instructors, levels..."
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                    />
                  </label>

                  <p className="text-sm text-slate-500">
                    <strong className="text-slate-900">{filteredCourses.length}</strong>{' '}
                    courses available
                  </p>

                  {(searchTerm || category !== 'all' || level !== 'all') ? (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-sm font-semibold text-jcst-crimson"
                    >
                      Clear filters
                    </button>
                  ) : null}
                </div>
              </div>

              {filteredCourses.length ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <PaidCourseCard key={course.slug} course={course} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                  <Search size={24} className="mx-auto text-slate-400" />
                  <h3 className="mt-5 font-display text-2xl font-bold text-jcst-navy">
                    No matching courses found
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
                    Change the search term or reset the filters to see the full catalogue.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.19em] text-jcst-crimson">
              Safe learning access
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold text-jcst-navy sm:text-4xl">
              Preview first. Purchase securely. Learn without confusion.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Visitors can inspect the course curriculum and watch one introduction video. Premium lessons, files, quizzes, exams, and certificates remain locked until payment is verified.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden py-16 text-white sm:py-20" style={{ background: 'var(--jcst-dark)' }}>
        <div className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(circle,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:30px_30px]" />
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Sparkles size={25} className="mx-auto text-amber-300" />
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Start with a free introduction, then unlock the complete learning experience.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Create your JCST account, select a course, complete payment, and continue learning from your student dashboard.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white shadow-xl"
              style={{ background: 'var(--jcst-secondary)' }}
            >
              Create Student Account
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-amber-300/50 bg-white/5 px-7 font-semibold text-white"
            >
              Student Login
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-[100] flex items-end bg-slate-950/65 p-3 backdrop-blur-sm lg:hidden">
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-jcst-navy">Filter Courses</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-6">
              <FilterPanel
                searchTerm={searchTerm}
                category={category}
                level={level}
                categories={categories}
                levels={levels}
                onSearch={setSearchTerm}
                onCategory={setCategory}
                onLevel={setLevel}
                onReset={resetFilters}
              />
            </div>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-5 h-12 w-full rounded-xl font-semibold text-white"
              style={{ background: 'var(--jcst-secondary)' }}
            >
              Show {filteredCourses.length} Courses
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const MarketplaceHero = ({
  page,
  courseCount,
}: {
  page: WebsiteContentRecord;
  courseCount: number;
}) => {
  const metadata = page.metadata;

  return (
    <section className="relative isolate overflow-hidden text-white" style={{ background: 'var(--jcst-dark)' }}>
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_14%_15%,rgba(197,139,20,.2),transparent_28%),radial-gradient(circle_at_90%_8%,rgba(155,17,30,.3),transparent_35%),linear-gradient(135deg,rgba(8,47,99,.99),rgba(6,26,53,.99))]" />
      <div className="absolute inset-0 -z-20 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[.92fr_1.08fr] lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-sm font-semibold backdrop-blur-xl">
            <Sparkles size={15} className="text-amber-300" />
            <span className="text-amber-300">Premium JCST E-Learning</span>
          </div>

          <h1 className="mt-7 font-display text-4xl font-bold leading-[1.04] tracking-[-0.03em] sm:text-5xl lg:text-[3.8rem]">
            Learn skills that matter.
            <span className="mt-2 block bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300 bg-clip-text text-transparent">
              Pay once. Progress with purpose.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Explore every paid course offered through JCST, compare fees, inspect the complete curriculum, and watch one free introduction lesson before you enroll.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#course-marketplace"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white shadow-xl"
              style={{ background: 'var(--jcst-secondary)' }}
            >
              Browse Paid Courses
              <ArrowRight size={18} />
            </a>
            <Link
              to="/login"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl border border-amber-300/50 bg-white/[0.07] px-7 font-semibold text-white"
            >
              Student Login
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-xs font-medium text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Visible course fees</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">One free introduction</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Locked premium curriculum</span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[34px] border border-white/12 bg-white/[0.05] p-4 shadow-[0_35px_90px_rgba(0,0,0,.35)] backdrop-blur-xl">
            <div className="relative min-h-[500px] overflow-hidden rounded-[28px] bg-slate-950 p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">JCST Learning Marketplace</p>
                  <p className="mt-1 text-lg font-bold">Explore your next course</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-amber-300">
                  <Laptop2 size={20} />
                </span>
              </div>

              <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-600/20 text-red-300">
                    <PlayCircle size={22} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Free preview</p>
                    <p className="mt-1 truncate font-bold">Introduction to the Course</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {['Course Orientation', 'Core Concepts', 'Practical Project', 'Final Assessment'].map((title, index) => (
                  <div key={title} className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-slate-300">
                        {index === 0 ? <PlayCircle size={17} /> : <LockKeyhole size={16} />}
                      </span>
                      <p className="truncate text-sm font-semibold">{title}</p>
                    </div>
                    <span className="text-xs text-slate-500">{index === 0 ? 'FREE' : 'LOCKED'}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-slate-400">Available courses</p>
                  <p className="mt-2 font-display text-3xl font-bold text-amber-300">{courseCount}+</p>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs text-slate-400">Access model</p>
                  <p className="mt-2 text-lg font-bold">Paid enrollment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="course-marketplace" />
    </section>
  );
};

const PaidCourseCard = ({ course }: { course: WebsiteContentRecord }) => {
  const metadata = course.metadata;
  const instructor = getObject<Instructor>(metadata, 'instructor');
  const price = getNumber(metadata, 'price');
  const originalPrice = getNumber(metadata, 'originalPrice');
  const currency = getString(metadata, 'currency') || 'USD';
  const totalLessons = getNumber(metadata, 'totalLessons');
  const duration = getString(metadata, 'duration');

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_42px_rgba(15,23,42,.07)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_58px_rgba(15,23,42,.12)]">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <SmartImage source={course.imageUrl} alt={course.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          {getString(metadata, 'category')}
        </span>
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-jcst-navy shadow">
          <PlayCircle size={14} className="text-jcst-crimson" />
          Free introduction
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>{getString(metadata, 'code')}</span>
          <span>{getString(metadata, 'level')}</span>
        </div>

        <h3 className="mt-3 line-clamp-2 font-display text-xl font-bold text-jcst-navy">{course.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{course.excerpt}</p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2"><BookOpenCheck size={14} /> {totalLessons} lessons</span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2"><Clock3 size={14} /> {duration}</span>
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-50 text-jcst-crimson"><UserRound size={16} /></span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-800">{instructor?.name || 'JCST Academic Team'}</p>
            <p className="truncate text-[11px] text-slate-500">{instructor?.title || 'Course Instructor'}</p>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Course Fee</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="font-display text-2xl font-bold text-jcst-crimson">{formatMoney(price, currency)}</p>
              {originalPrice > price ? <span className="text-xs text-slate-400 line-through">{formatMoney(originalPrice, currency)}</span> : null}
            </div>
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600"><Star size={14} fill="currentColor" /> New</div>
        </div>

        <Link
          to={`/e-learning/courses/${course.slug}`}
          className="mt-5 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl font-semibold text-white transition hover:-translate-y-0.5"
          style={{ background: 'var(--jcst-secondary)' }}
        >
          Preview & View Details
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
};

const FilterPanel = ({
  searchTerm,
  category,
  level,
  categories,
  levels,
  onSearch,
  onCategory,
  onLevel,
  onReset,
}: {
  searchTerm: string;
  category: string;
  level: string;
  categories: string[];
  levels: string[];
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  onLevel: (value: string) => void;
  onReset: () => void;
}) => (
  <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,.06)]">
    <div className="flex items-center justify-between gap-3">
      <h3 className="font-display text-lg font-bold text-jcst-navy">Find a Course</h3>
      <Filter size={18} className="text-jcst-crimson" />
    </div>

    <label className="relative mt-5 block">
      <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={searchTerm}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Search..."
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-amber-400 focus:bg-white"
      />
    </label>

    <FilterSelect label="Category" value={category} options={categories} onChange={onCategory} />
    <FilterSelect label="Level" value={level} options={levels} onChange={onLevel} />

    <button type="button" onClick={onReset} className="mt-5 h-11 w-full rounded-xl border border-slate-200 text-sm font-semibold text-slate-700">Reset Filters</button>
  </div>
);

const FilterSelect = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => (
  <label className="mt-5 block">
    <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-amber-400"
    >
      <option value="all">All {label}s</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);

const MetricCard = ({ icon, value, label }: { icon: ReactNode; value: string; label: string }) => (
  <article className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-jcst-crimson">{icon}</span>
    <p className="mt-4 font-display text-xl font-bold text-jcst-navy sm:text-2xl">{value}</p>
    <p className="mt-1 text-xs font-semibold leading-5 text-slate-600 sm:text-sm">{label}</p>
  </article>
);

const FeatureCard = ({ feature }: { feature: MarketplaceFeature }) => {
  const icons = {
    lock: LockKeyhole,
    mobile: Smartphone,
    progress: CheckCircle2,
    support: Users,
  };
  const Icon = icons[feature.icon] ?? ShieldCheck;

  return (
    <article className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-jcst-crimson shadow-sm"><Icon size={19} /></span>
      <h3 className="mt-4 text-sm font-bold text-jcst-navy sm:text-base">{feature.title}</h3>
      <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm sm:leading-7">{feature.description}</p>
    </article>
  );
};

const SmartImage = ({ source, alt, className }: { source: string; alt: string; className: string }) => {
  const [failed, setFailed] = useState(false);

  if (!source || failed) {
    return <div role="img" aria-label={alt} className={`${className} grid place-items-center bg-slate-200`}><ImageIcon size={26} className="text-slate-500" /></div>;
  }

  return <img src={source} alt={alt} loading="lazy" className={className} onError={() => setFailed(true)} />;
};

const uniqueValues = (items: string[]) => [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b));
const getString = (metadata: Record<string, unknown>, key: string) => typeof metadata[key] === 'string' ? metadata[key] as string : '';
const getNumber = (metadata: Record<string, unknown>, key: string) => typeof metadata[key] === 'number' ? metadata[key] as number : 0;
const getBoolean = (metadata: Record<string, unknown>, key: string) => metadata[key] === true;
const getObject = <T extends object>(metadata: Record<string, unknown>, key: string): T | undefined => {
  const value = metadata[key];
  return value && typeof value === 'object' && !Array.isArray(value) ? value as T : undefined;
};
const getObjectArray = <T extends object>(metadata: Record<string, unknown>, key: string): T[] => {
  const value = metadata[key];
  return Array.isArray(value) ? value.filter((item): item is T => Boolean(item) && typeof item === 'object' && !Array.isArray(item)) : [];
};
const formatMoney = (amount: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);