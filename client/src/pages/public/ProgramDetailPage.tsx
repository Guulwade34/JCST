import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  GraduationCap,
  ImageIcon,
  Laptop2,
  Layers3,
  Mail,
  MessageCircle,
  Phone,
  X,
  ShieldCheck,
  Target,
  UserRound,
  Users,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { WebsiteContentRecord } from '@jcst/shared';
import { PageError, PageLoading } from '@/components/common/PageState';
import {
  useWebsiteCollection,
  useWebsiteItem,
} from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

interface CurriculumCourse {
  code: string;
  title: string;
  credits: number;
  type?: string;
}

interface CurriculumSemester {
  title: string;
  totalCredits: number;
  courses: CurriculumCourse[];
}

interface Coordinator {
  name: string;
  title: string;
  email: string;
  phone: string;
}

export const ProgramDetailPage = () => {
  const { slug = '' } = useParams();
  const { text } = usePublicWebsite();
  const programQuery = useWebsiteItem('program', slug);
  const programsQuery = useWebsiteCollection('program');
  const departmentsQuery = useWebsiteCollection('department');

  const loading =
    programQuery.isLoading ||
    programsQuery.isLoading ||
    departmentsQuery.isLoading;

  if (loading) {
    return <PageLoading />;
  }

  if (
    programQuery.isError ||
    programsQuery.isError ||
    departmentsQuery.isError ||
    !programQuery.data
  ) {
    return (
      <PageError message={text('global.errors.content-not-found')} />
    );
  }

  const program = programQuery.data;
  const metadata = program.metadata;
  const departmentSlug = getString(metadata, 'department');
  const department = (departmentsQuery.data ?? []).find(
    (item) => item.slug === departmentSlug,
  );
  const relatedPrograms = (programsQuery.data ?? [])
    .filter(
      (item) =>
        item.slug !== program.slug &&
        getString(item.metadata, 'department') === departmentSlug,
    )
    .slice(0, 3);

  const curriculum = getObjectArray<CurriculumSemester>(
    metadata,
    'curriculum',
  );
  const coordinator = getObject<Coordinator>(metadata, 'coordinator');

  return (
    <div className="overflow-x-clip bg-white">
      <ProgramHero
        program={program}
        department={department}
      />

      <ProgramNavigation />

      <main>
        <OverviewSection
          program={program}
          department={department}
        />

        <OutcomesSection program={program} />

        <CurriculumSection curriculum={curriculum} />

        <RequirementsSection program={program} />

        <CareerSection program={program} />

        <DeliverySection program={program} />

        {coordinator ? (
          <CoordinatorSection
            coordinator={coordinator}
            program={program}
          />
        ) : null}

        {relatedPrograms.length ? (
          <RelatedProgramsSection programs={relatedPrograms} />
        ) : null}

        <ProgramCta program={program} />
      </main>
    </div>
  );
};

const ProgramHero = ({
  program,
  department,
}: {
  program: WebsiteContentRecord;
  department: WebsiteContentRecord | undefined;
}) => {
  const metadata = program.metadata;
  const studyModes = getStringArray(metadata, 'studyModes');
  const intakes = getStringArray(metadata, 'intakes');

  return (
    <section
      className="relative isolate overflow-hidden text-white"
      style={{ background: 'var(--jcst-dark)' }}
    >
      <div className="absolute inset-0 -z-40 bg-[radial-gradient(circle_at_12%_18%,rgba(197,139,20,.18),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(155,17,30,.3),transparent_34%),linear-gradient(135deg,rgba(8,47,99,.99),rgba(6,26,53,.99))]" />
      <div className="absolute inset-0 -z-30 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[.96fr_1.04fr] lg:px-8">
        <div className="relative z-10">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Programs
          </Link>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/20 bg-white/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
              {getString(metadata, 'code')}
            </span>
            <span
              className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em]"
              style={{ color: 'var(--jcst-accent)' }}
            >
              {getString(metadata, 'qualification')}
            </span>
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.7rem]">
            {program.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            {program.excerpt}
          </p>

          {department ? (
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Users size={17} style={{ color: 'var(--jcst-accent)' }} />
              {department.title}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/apply?program=${encodeURIComponent(program.slug)}`}
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white shadow-xl transition duration-300 hover:-translate-y-1"
              style={{ background: 'var(--jcst-secondary)' }}
            >
              {getString(metadata, 'applyLabel') || 'Apply for This Program'}
              <ArrowRight size={18} />
            </Link>

            {getBoolean(metadata, 'eLearningEnabled') ? (
              <Link
                to="/e-learning"
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl border border-amber-300/50 bg-white/[0.07] px-7 font-semibold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.13]"
              >
                <Laptop2 size={18} />
                E-Learning Access
              </Link>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[...studyModes, ...intakes.map((intake) => `${intake} Intake`)]
              .slice(0, 5)
              .map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-slate-300"
                >
                  {item}
                </span>
              ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[34px] border border-white/12 bg-white/[0.05] p-4 shadow-[0_35px_90px_rgba(0,0,0,.35)] backdrop-blur-xl">
            <div className="group relative min-h-[500px] overflow-hidden rounded-[28px] bg-slate-900">
              <SmartImage
                source={program.imageUrl}
                alt={getString(metadata, 'imageAlt') || program.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,18,38,.96),rgba(6,18,38,.12)_70%)]" />
              <div className="absolute inset-4 rounded-[24px] border border-white/20 sm:inset-5 sm:rounded-[25px]" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9">
                <p
                  className="text-xs font-bold uppercase tracking-[0.18em]"
                  style={{ color: 'var(--jcst-accent)' }}
                >
                  Program at a glance
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <HeroFact
                    icon={<Clock3 size={18} />}
                    label="Duration"
                    value={getString(metadata, 'duration')}
                  />
                  <HeroFact
                    icon={<Layers3 size={18} />}
                    label="Semesters"
                    value={`${getNumber(metadata, 'semesters')}`}
                  />
                  <HeroFact
                    icon={<BookOpenCheck size={18} />}
                    label="Credits"
                    value={`${getNumber(metadata, 'requiredCredits')}`}
                  />
                  <HeroFact
                    icon={<Laptop2 size={18} />}
                    label="Delivery"
                    value={getString(metadata, 'deliveryModel')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroFact = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <article className="rounded-2xl border border-white/10 bg-slate-950/40 p-3 backdrop-blur sm:p-4">
    <div className="flex items-center gap-2" style={{ color: 'var(--jcst-accent)' }}>
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
        {label}
      </span>
    </div>
    <p className="mt-2 break-words text-sm font-bold text-white sm:text-base">
      {value}
    </p>
  </article>
);

const ProgramNavigation = () => (
  <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-4 text-sm font-semibold text-slate-600 sm:px-6 lg:px-8">
      {[
        ['Overview', '#overview'],
        ['Outcomes', '#outcomes'],
        ['Curriculum', '#curriculum'],
        ['Requirements', '#requirements'],
        ['Careers', '#careers'],
        ['Delivery', '#delivery'],
      ].map(([label, href]) => (
        <a
          key={href}
          href={href}
          className="shrink-0 transition hover:text-jcst-crimson"
        >
          {label}
        </a>
      ))}
    </div>
  </nav>
);

const OverviewSection = ({
  program,
  department,
}: {
  program: WebsiteContentRecord;
  department: WebsiteContentRecord | undefined;
}) => {
  const metadata = program.metadata;
  const highlights = getStringArray(metadata, 'highlights');

  return (
    <section id="overview" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Program Overview"
            title={getString(metadata, 'overviewTitle') || 'What this program offers'}
            description={program.body}
          />

          {highlights.length ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-1 shrink-0"
                    style={{ color: 'var(--jcst-accent)' }}
                  />
                  <p className="text-sm leading-7 text-slate-700">{highlight}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="rounded-[26px] border border-slate-200 bg-slate-50 p-5 shadow-[0_16px_40px_rgba(15,23,42,.06)]">
          <h2 className="font-display text-xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
            Quick facts
          </h2>

          <dl className="mt-5 grid gap-4">
            <QuickFact
              label="Program Code"
              value={getString(metadata, 'code')}
              icon={<FileCheck2 size={17} />}
            />
            <QuickFact
              label="Qualification"
              value={getString(metadata, 'qualification')}
              icon={<Award size={17} />}
            />
            <QuickFact
              label="Department"
              value={department?.title ?? ''}
              icon={<Users size={17} />}
            />
            <QuickFact
              label="Duration"
              value={getString(metadata, 'duration')}
              icon={<Clock3 size={17} />}
            />
            <QuickFact
              label="Required Credits"
              value={`${getNumber(metadata, 'requiredCredits')}`}
              icon={<BookOpenCheck size={17} />}
            />
            <QuickFact
              label="Study Modes"
              value={getStringArray(metadata, 'studyModes').join(', ')}
              icon={<Laptop2 size={17} />}
            />
            <QuickFact
              label="Intakes"
              value={getStringArray(metadata, 'intakes').join(', ')}
              icon={<CalendarDays size={17} />}
            />
          </dl>
        </aside>
      </div>
    </section>
  );
};

const QuickFact = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
      <span style={{ color: 'var(--jcst-secondary)' }}>{icon}</span>
      {label}
    </dt>
    <dd className="mt-2 text-sm font-bold leading-6 text-slate-700">{value}</dd>
  </div>
);

const OutcomesSection = ({ program }: { program: WebsiteContentRecord }) => {
  const metadata = program.metadata;
  const objectives = getStringArray(metadata, 'objectives');
  const outcomes = getStringArray(metadata, 'learningOutcomes');

  if (!objectives.length && !outcomes.length) {
    return null;
  }

  return (
    <section id="outcomes" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Purpose and Outcomes"
            title="Clear goals. Practical capability. Professional confidence."
            description="The program is structured around what students should understand, demonstrate, and apply by graduation."
            centered
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <ListPanel
            icon={<Target size={24} />}
            eyebrow="Program Objectives"
            title="What the program is designed to achieve"
            items={objectives}
            dark
          />
          <ListPanel
            icon={<BadgeCheck size={24} />}
            eyebrow="Learning Outcomes"
            title="What graduates should be able to do"
            items={outcomes}
          />
        </div>
      </div>
    </section>
  );
};

const ListPanel = ({
  icon,
  eyebrow,
  title,
  items,
  dark = false,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  items: string[];
  dark?: boolean;
}) => (
  <article
    className={`rounded-[30px] border p-6 shadow-[0_20px_50px_rgba(15,23,42,.08)] sm:p-8 ${
      dark
        ? 'border-transparent text-white'
        : 'border-slate-200 bg-white text-slate-900'
    }`}
    style={dark ? { background: 'var(--jcst-primary)' } : undefined}
  >
    <span
      className={`grid h-14 w-14 place-items-center rounded-2xl ${
        dark ? 'bg-white/10' : 'bg-red-50'
      }`}
      style={{ color: dark ? 'var(--jcst-accent)' : 'var(--jcst-secondary)' }}
    >
      {icon}
    </span>
    <p
      className={`mt-6 text-xs font-bold uppercase tracking-[0.17em] ${
        dark ? '' : 'text-jcst-crimson'
      }`}
      style={dark ? { color: 'var(--jcst-accent)' } : undefined}
    >
      {eyebrow}
    </p>
    <h3 className="mt-3 font-display text-2xl font-bold">{title}</h3>
    <div className="mt-6 grid gap-4">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <CheckCircle2
            size={18}
            className="mt-1 shrink-0"
            style={{ color: 'var(--jcst-accent)' }}
          />
          <p className={`leading-7 ${dark ? 'text-slate-200' : 'text-slate-600'}`}>
            {item}
          </p>
        </div>
      ))}
    </div>
  </article>
);

const CurriculumSection = ({
  curriculum,
}: {
  curriculum: CurriculumSemester[];
}) => {
  const [openSemester, setOpenSemester] = useState(0);

  if (!curriculum.length) {
    return null;
  }

  const totalCredits = curriculum.reduce(
    (sum, semester) => sum + (semester.totalCredits || 0),
    0,
  );

  return (
    <section id="curriculum" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionHeading
              eyebrow="Curriculum Structure"
              title="Semester-by-semester academic progression"
              description="Review the course units, credit load, and learning progression planned throughout the program."
            />
          </div>

          <div className="flex gap-3">
            <CurriculumMetric value={`${curriculum.length}`} label="Semesters" />
            <CurriculumMetric value={`${totalCredits}`} label="Credits" />
          </div>
        </div>

        <div className="mt-10 grid gap-4">
          {curriculum.map((semester, index) => {
            const open = openSemester === index;
            return (
              <article
                key={`${semester.title}-${index}`}
                className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,.05)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenSemester(open ? -1 : index)}
                  className="flex w-full items-center justify-between gap-5 p-5 text-left sm:p-6"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white"
                      style={{ background: 'var(--jcst-primary)' }}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold text-slate-800 sm:text-xl">
                        {semester.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {semester.courses?.length ?? 0} courses · {semester.totalCredits} credits
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-slate-500 transition duration-300 ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {open ? (
                  <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6">
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                      <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-[0.13em] text-slate-500">
                          <tr>
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Course Unit</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3 text-right">Credits</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(semester.courses ?? []).map((course) => (
                            <tr key={`${course.code}-${course.title}`}>
                              <td className="whitespace-nowrap px-4 py-4 font-bold text-jcst-crimson">
                                {course.code}
                              </td>
                              <td className="min-w-[220px] px-4 py-4 font-semibold text-slate-700">
                                {course.title}
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                                {course.type || 'Core'}
                              </td>
                              <td className="px-4 py-4 text-right font-bold text-slate-700">
                                {course.credits}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CurriculumMetric = ({ value, label }: { value: string; label: string }) => (
  <div className="min-w-[100px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
    <p className="font-display text-xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
      {value}
    </p>
    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
      {label}
    </p>
  </div>
);

const RequirementsSection = ({ program }: { program: WebsiteContentRecord }) => {
  const metadata = program.metadata;
  const requirements = getStringArray(metadata, 'entryRequirements');
  const documents = getStringArray(metadata, 'requiredDocuments');

  if (!requirements.length && !documents.length) {
    return null;
  }

  return (
    <section id="requirements" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Entry Requirements"
            title="Everything needed to begin your application"
            description="Applicants should review the academic and document requirements before submitting an application."
            centered
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <RequirementCard
            icon={<GraduationCap size={23} />}
            title="Academic Requirements"
            items={requirements}
          />
          <RequirementCard
            icon={<FileCheck2 size={23} />}
            title="Required Documents"
            items={documents}
          />
        </div>
      </div>
    </section>
  );
};

const RequirementCard = ({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) => (
  <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,.06)] sm:p-8">
    <span
      className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50"
      style={{ color: 'var(--jcst-secondary)' }}
    >
      {icon}
    </span>
    <h3 className="mt-5 font-display text-2xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
      {title}
    </h3>
    <div className="mt-6 grid gap-4">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <CheckCircle2
            size={18}
            className="mt-1 shrink-0"
            style={{ color: 'var(--jcst-accent)' }}
          />
          <p className="leading-7 text-slate-600">{item}</p>
        </div>
      ))}
    </div>
  </article>
);

const CareerSection = ({ program }: { program: WebsiteContentRecord }) => {
  const metadata = program.metadata;
  const careers = getStringArray(metadata, 'careerOpportunities');

  if (!careers.length) {
    return null;
  }

  return (
    <section
      id="careers"
      className="relative isolate scroll-mt-24 overflow-hidden py-16 text-white sm:py-20"
      style={{ background: 'var(--jcst-dark)' }}
    >
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(circle,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:30px_30px]" />
      <div className="absolute -right-44 -top-44 -z-20 h-[500px] w-[500px] rounded-full bg-red-800/25 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Career Opportunities"
            title="Professional pathways after graduation"
            description="Graduates can pursue relevant entry-level, specialist, support, leadership, or entrepreneurial opportunities depending on experience and further development."
            inverse
            centered
          />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {careers.map((career) => (
            <article
              key={career}
              className="rounded-[22px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[var(--jcst-accent)] hover:bg-white/[0.1]"
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.08]"
                style={{ color: 'var(--jcst-accent)' }}
              >
                <BriefcaseBusiness size={20} />
              </span>
              <h3 className="mt-4 text-sm font-bold leading-6 sm:text-base">
                {career}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const DeliverySection = ({ program }: { program: WebsiteContentRecord }) => {
  const metadata = program.metadata;
  const learningMethods = getStringArray(metadata, 'learningMethods');
  const assessmentMethods = getStringArray(metadata, 'assessmentMethods');
  const supportServices = getStringArray(metadata, 'supportServices');

  if (
    !learningMethods.length &&
    !assessmentMethods.length &&
    !supportServices.length
  ) {
    return null;
  }

  return (
    <section id="delivery" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Learning and Assessment"
            title="A blended academic experience designed for progress"
            description="Teaching, assessment, and support are organized to help students understand, practice, demonstrate, and improve."
            centered
          />
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <DeliveryCard
            icon={<Laptop2 size={23} />}
            title="Learning Methods"
            items={learningMethods}
          />
          <DeliveryCard
            icon={<FileCheck2 size={23} />}
            title="Assessment Methods"
            items={assessmentMethods}
          />
          <DeliveryCard
            icon={<ShieldCheck size={23} />}
            title="Student Support"
            items={supportServices}
          />
        </div>
      </div>
    </section>
  );
};

const DeliveryCard = ({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) => (
  <article className="rounded-[26px] border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--jcst-accent)] hover:bg-white hover:shadow-[0_18px_42px_rgba(15,23,42,.08)]">
    <span
      className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm"
      style={{ color: 'var(--jcst-secondary)' }}
    >
      {icon}
    </span>
    <h3 className="mt-5 font-display text-xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
      {title}
    </h3>
    <div className="mt-5 grid gap-3">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-2.5">
          <CheckCircle2
            size={16}
            className="mt-1 shrink-0"
            style={{ color: 'var(--jcst-accent)' }}
          />
          <p className="text-sm leading-6 text-slate-600">{item}</p>
        </div>
      ))}
    </div>
  </article>
);

const CoordinatorSection = ({
  coordinator,
  program,
}: {
  coordinator: Coordinator;
  program: WebsiteContentRecord;
}) => {
  const [contactOpen, setContactOpen] = useState(false);
  const normalizedPhone = normalizePhoneForDialing(coordinator.phone);
  const whatsappNumber = normalizePhoneForWhatsApp(coordinator.phone);
  const emailSubject = encodeURIComponent(`Inquiry about ${program.title}`);
  const emailBody = encodeURIComponent(
    `Hello ${coordinator.name || 'Program Coordinator'},\n\nI would like more information about ${program.title}.\n\nThank you.`,
  );
  const emailAddress = encodeURIComponent(coordinator.email.trim());
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${emailSubject}&body=${emailBody}`;
  const whatsappMessage = encodeURIComponent(
    `Hello, I would like more information about ${program.title}.`,
  );

  useEffect(() => {
    if (!contactOpen) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContactOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [contactOpen]);

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 rounded-[34px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,.08)] sm:p-8 lg:grid-cols-[auto_1fr_auto] lg:p-10">
          <span
            className="grid h-20 w-20 place-items-center rounded-[24px] text-white shadow-xl"
            style={{ background: 'var(--jcst-primary)' }}
          >
            <UserRound size={31} />
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-jcst-crimson">
              Program Coordinator
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
              {coordinator.name}
            </h2>
            <p className="mt-1 text-slate-600">{coordinator.title}</p>
            <p className="mt-3 text-sm text-slate-500">{program.title}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {coordinator.email ? (
              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-[var(--jcst-accent)] hover:bg-white"
                aria-label={`Email ${coordinator.name}`}
              >
                <Mail size={17} />
                Email
              </a>
            ) : null}

            {normalizedPhone ? (
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-[var(--jcst-accent)] hover:bg-white"
                aria-haspopup="dialog"
                aria-expanded={contactOpen}
              >
                <Phone size={17} />
                Call
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {contactOpen ? (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/65 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setContactOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="coordinator-contact-title"
            className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-[0_30px_90px_rgba(2,12,27,.35)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-jcst-crimson">
                  Contact Coordinator
                </p>
                <h3
                  id="coordinator-contact-title"
                  className="mt-2 font-display text-2xl font-bold"
                  style={{ color: 'var(--jcst-primary)' }}
                >
                  Choose how to contact
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {coordinator.phone}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setContactOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
                aria-label="Close contact options"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-3 p-6">
              {whatsappNumber ? (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setContactOpen(false)}
                  className="group flex min-h-[64px] items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-lg">
                    <MessageCircle size={21} />
                  </span>
                  <span>
                    <span className="block font-bold text-emerald-900">WhatsApp</span>
                    <span className="mt-1 block text-sm text-emerald-800">Open a WhatsApp conversation</span>
                  </span>
                </a>
              ) : null}

              <a
                href={`tel:${normalizedPhone}`}
                onClick={() => setContactOpen(false)}
                className="group flex min-h-[64px] items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--jcst-accent)] hover:bg-white"
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-lg"
                  style={{ background: 'var(--jcst-primary)' }}
                >
                  <Phone size={21} />
                </span>
                <span>
                  <span className="block font-bold text-slate-900">Normal Call</span>
                  <span className="mt-1 block text-sm text-slate-600">Open the phone dialer</span>
                </span>
              </a>
            </div>

            <p className="px-6 pb-6 text-xs leading-5 text-slate-500">
              WhatsApp opens the number in WhatsApp. The app will indicate if the number is not registered.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
};

const RelatedProgramsSection = ({
  programs,
}: {
  programs: WebsiteContentRecord[];
}) => (
  <section className="bg-white py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Related Programs"
          title="Continue exploring your academic options"
          description="Compare other programs from the same academic department."
        />
        <Link
          to="/programs"
          className="inline-flex shrink-0 items-center gap-2 font-semibold text-jcst-crimson"
        >
          View all programs
          <ArrowRight size={17} />
        </Link>
      </div>

      <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <article
            key={program.id}
            className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,.06)] transition duration-300 hover:-translate-y-1 hover:border-[var(--jcst-accent)] hover:shadow-[0_20px_44px_rgba(15,23,42,.1)]"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
              <SmartImage
                source={program.imageUrl}
                alt={getString(program.metadata, 'imageAlt') || program.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.72),transparent_70%)]" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.13em] text-jcst-crimson">
                {getString(program.metadata, 'code')}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl font-bold" style={{ color: 'var(--jcst-primary)' }}>
                {program.title}
              </h3>
              <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-600">
                {program.excerpt}
              </p>
              <Link
                to={`/programs/${program.slug}`}
                className="mt-5 inline-flex items-center gap-2 font-semibold text-jcst-crimson"
              >
                View Details
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const ProgramCta = ({ program }: { program: WebsiteContentRecord }) => {
  const metadata = program.metadata;

  return (
    <section className="relative isolate overflow-hidden py-16 text-white sm:py-20">
      <SmartImage
        source={getString(metadata, 'ctaImageUrl') || program.imageUrl}
        alt={getString(metadata, 'ctaImageAlt') || program.title}
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(6,26,53,.99),rgba(8,47,99,.94)_58%,rgba(155,17,30,.86))]" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.19em]" style={{ color: 'var(--jcst-accent)' }}>
            Begin your application
          </p>
          <h2 className="mt-5 font-display text-4xl font-bold sm:text-5xl">
            Ready to study {program.title}?
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
            Submit your application, contact admissions, or review the program details again before starting your journey.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/apply?program=${encodeURIComponent(program.slug)}`}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white shadow-xl transition hover:-translate-y-1"
              style={{ background: 'var(--jcst-secondary)' }}
            >
              Apply Now
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
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

const normalizePhoneForDialing = (phone: string): string => {
  const trimmed = phone.trim();

  if (!trimmed) {
    return '';
  }

  const digits = trimmed.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (trimmed.startsWith('+')) {
    return `+${digits}`;
  }

  if (digits.startsWith('00')) {
    return `+${digits.slice(2)}`;
  }

  return digits;
};

const normalizePhoneForWhatsApp = (phone: string): string => {
  const normalized = normalizePhoneForDialing(phone);
  return normalized.replace(/\D/g, '');
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

const getObject = <T extends object>(
  metadata: Record<string, unknown>,
  key: string,
): T | null => {
  const value = metadata[key];
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as T)
    : null;
};

const getObjectArray = <T extends object>(
  metadata: Record<string, unknown>,
  key: string,
): T[] => {
  const value = metadata[key];
  return Array.isArray(value)
    ? value.filter(
        (item): item is T =>
          Boolean(item) && typeof item === 'object' && !Array.isArray(item),
      )
    : [];
};