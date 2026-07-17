import {
  useState,
  type ReactNode,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  GraduationCap,
  ImageIcon,
  Laptop2,
  LibraryBig,
  Mail,
  MessageCircle,
  Phone,
  PlayCircle,
  ShieldCheck,
  Target,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { WebsiteContentRecord } from '@jcst/shared';
import { PageError, PageLoading } from '@/components/common/PageState';
import {
  useWebsiteCollection,
  useWebsiteItem,
} from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

interface CourseModule {
  week: string;
  title: string;
  description: string;
  topics: string[];
}

interface AssessmentItem {
  title: string;
  weight: number;
  description: string;
}

interface ScheduleItem {
  label: string;
  value: string;
}

interface Instructor {
  name: string;
  title: string;
  email: string;
  phone: string;
  bio?: string;
}

export const CourseDetailPage = () => {
  const { slug = '' } = useParams();
  const { text } = usePublicWebsite();
  const courseQuery = useWebsiteItem('course', slug);
  const coursesQuery = useWebsiteCollection('course');
  const programsQuery = useWebsiteCollection('program');
  const departmentsQuery = useWebsiteCollection('department');

  const loading =
    courseQuery.isLoading ||
    coursesQuery.isLoading ||
    programsQuery.isLoading ||
    departmentsQuery.isLoading;

  if (loading) {
    return <PageLoading />;
  }

  if (
    courseQuery.isError ||
    coursesQuery.isError ||
    programsQuery.isError ||
    departmentsQuery.isError ||
    !courseQuery.data
  ) {
    return <PageError message={text('global.errors.content-not-found')} />;
  }

  const course = courseQuery.data;
  const metadata = course.metadata;
  const programSlug = getString(metadata, 'program');
  const departmentSlug = getString(metadata, 'department');
  const program = (programsQuery.data ?? []).find(
    (item) => item.slug === programSlug,
  );
  const department = (departmentsQuery.data ?? []).find(
    (item) => item.slug === departmentSlug,
  );
  const relatedCourses = (coursesQuery.data ?? [])
    .filter(
      (item) =>
        item.slug !== course.slug &&
        (getString(item.metadata, 'program') === programSlug ||
          getString(item.metadata, 'department') === departmentSlug),
    )
    .slice(0, 3);

  const modules = getObjectArray<CourseModule>(metadata, 'modules');
  const assessments = getObjectArray<AssessmentItem>(metadata, 'assessments');
  const schedule = getObjectArray<ScheduleItem>(metadata, 'schedule');
  const instructor = getObject<Instructor>(metadata, 'instructor');

  return (
    <div className="overflow-x-clip bg-white">
      <CourseHero course={course} {...(program && { program })} {...(department && { department })} />
      <CourseNavigation />

      <main>
        <OverviewSection course={course} {...(program && { program })} {...(department && { department })} />
        <LearningOutcomesSection course={course} />
        <ModulesSection modules={modules} />
        <AssessmentSection assessments={assessments} />
        <LearningExperienceSection course={course} />
        <ResourcesSection course={course} schedule={schedule} />

        {instructor ? (
          <InstructorSection instructor={instructor} course={course} />
        ) : null}

        {relatedCourses.length ? (
          <RelatedCoursesSection courses={relatedCourses} />
        ) : null}

        <CourseCta course={course} />
      </main>
    </div>
  );
};

const CourseHero = ({
  course,
  program,
  department,
}: {
  course: WebsiteContentRecord;
  program?: WebsiteContentRecord;
  department?: WebsiteContentRecord;
}) => {
  const metadata = course.metadata;
  const deliveryModes = getStringArray(metadata, 'deliveryModes');

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
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Courses
          </Link>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/20 bg-white/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
              {getString(metadata, 'code')}
            </span>
            <span
              className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em]"
              style={{ color: 'var(--jcst-accent)' }}
            >
              {getString(metadata, 'courseType')}
            </span>
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.7rem]">
            {course.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            {course.excerpt}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-300">
            {program ? (
              <Link
                to={`/programs/${program.slug}`}
                className="inline-flex items-center gap-2 transition hover:text-white"
              >
                <GraduationCap size={17} style={{ color: 'var(--jcst-accent)' }} />
                {program.title}
              </Link>
            ) : null}

            {department ? (
              <span className="inline-flex items-center gap-2">
                <Users size={17} style={{ color: 'var(--jcst-accent)' }} />
                {department.title}
              </span>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {getBoolean(metadata, 'eLearningEnabled') ? (
              <Link
                to={`/e-learning?course=${encodeURIComponent(course.slug)}`}
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white shadow-xl transition duration-300 hover:-translate-y-1"
                style={{ background: 'var(--jcst-secondary)' }}
              >
                <PlayCircle size={18} />
                Open E-Learning
              </Link>
            ) : null}

            <Link
              to="/contact"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl border border-amber-300/50 bg-white/[0.07] px-7 font-semibold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.13]"
            >
              Ask About This Course
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {deliveryModes.map((mode) => (
              <span
                key={mode}
                className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-slate-300"
              >
                {mode}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[34px] border border-white/12 bg-white/[0.05] p-4 shadow-[0_35px_90px_rgba(0,0,0,.35)] backdrop-blur-xl">
            <div className="group relative min-h-[500px] overflow-hidden rounded-[28px] bg-slate-900">
              <SmartImage
                source={course.imageUrl}
                alt={getString(metadata, 'imageAlt') || course.title}
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
                  Course at a glance
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <HeroFact
                    icon={<BookOpenCheck size={18} />}
                    label="Credits"
                    value={`${getNumber(metadata, 'credits')}`}
                  />
                  <HeroFact
                    icon={<CalendarDays size={18} />}
                    label="Semester"
                    value={getString(metadata, 'semester')}
                  />
                  <HeroFact
                    icon={<Clock3 size={18} />}
                    label="Contact Hours"
                    value={getString(metadata, 'contactHours')}
                  />
                  <HeroFact
                    icon={<Laptop2 size={18} />}
                    label="Delivery"
                    value={deliveryModes[0] || 'On-campus'}
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
  <article className="rounded-2xl border border-white/10 bg-slate-950/45 p-3 backdrop-blur sm:p-4">
    <span className="text-amber-300">{icon}</span>
    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
      {label}
    </p>
    <p className="mt-1 break-words text-sm font-bold leading-5 text-white">
      {value}
    </p>
  </article>
);

const CourseNavigation = () => (
  <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
      {[
        ['Overview', '#overview'],
        ['Outcomes', '#outcomes'],
        ['Modules', '#modules'],
        ['Assessment', '#assessment'],
        ['Learning', '#learning'],
        ['Resources', '#resources'],
        ['Instructor', '#instructor'],
      ].map(([label, href]) => (
        <a
          key={href}
          href={href}
          className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-jcst-crimson"
        >
          {label}
        </a>
      ))}
    </div>
  </nav>
);

const OverviewSection = ({
  course,
  program,
  department,
}: {
  course: WebsiteContentRecord;
  program?: WebsiteContentRecord;
  department?: WebsiteContentRecord;
}) => {
  const metadata = course.metadata;
  const highlights = getStringArray(metadata, 'highlights');
  const prerequisites = getStringArray(metadata, 'prerequisites');

  return (
    <section id="overview" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Course overview"
            title={getString(metadata, 'overviewTitle') || course.title}
            description={course.body}
          />

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <InfoPoint key={item} text={item} />
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-[0_18px_42px_rgba(15,23,42,.06)]">
          <h3 className="font-display text-xl font-bold text-jcst-navy">
            Academic Information
          </h3>

          <div className="mt-5 grid gap-4">
            <SideFact label="Course Code" value={getString(metadata, 'code')} />
            <SideFact label="Level" value={getString(metadata, 'level')} />
            <SideFact label="Course Type" value={getString(metadata, 'courseType')} />
            <SideFact label="Credits" value={`${getNumber(metadata, 'credits')} Credits`} />
            <SideFact label="Semester" value={getString(metadata, 'semester')} />
            {program ? <SideFact label="Program" value={program.title} /> : null}
            {department ? <SideFact label="Department" value={department.title} /> : null}
          </div>

          {prerequisites.length ? (
            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-jcst-crimson">
                Prerequisites
              </p>
              <ul className="mt-3 grid gap-2">
                {prerequisites.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                    <CheckCircle2 size={15} className="mt-1 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
};

const LearningOutcomesSection = ({ course }: { course: WebsiteContentRecord }) => {
  const outcomes = getStringArray(course.metadata, 'learningOutcomes');

  return (
    <section id="outcomes" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Learning outcomes"
            title="What students should know and be able to do"
            description="The course outcomes connect knowledge, practical competence, communication, ethical responsibility, and professional application."
            centered
          />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {outcomes.map((outcome, index) => (
            <article
              key={outcome}
              className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_14px_34px_rgba(15,23,42,.06)]"
            >
              <span
                className="grid h-10 w-10 place-items-center rounded-xl text-sm font-bold text-white"
                style={{ background: 'var(--jcst-secondary)' }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="mt-5 text-sm leading-7 text-slate-700">{outcome}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const ModulesSection = ({ modules }: { modules: CourseModule[] }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="modules" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Course syllabus"
            title="A structured module-by-module learning journey"
            description="Each module guides students from foundational concepts to applied understanding, practice, and assessment."
            centered
          />
        </div>

        <div className="mt-10 grid gap-4">
          {modules.map((module, index) => {
            const open = openIndex === index;

            return (
              <article
                key={`${module.week}-${module.title}`}
                className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,.05)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="shrink-0 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-jcst-crimson">
                      {module.week}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold text-jcst-navy sm:text-xl">
                        {module.title}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                        {module.description}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
                  />
                </button>

                {open ? (
                  <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-6">
                    <p className="text-sm leading-7 text-slate-600">
                      {module.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {module.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                        >
                          {topic}
                        </span>
                      ))}
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

const AssessmentSection = ({
  assessments,
}: {
  assessments: AssessmentItem[];
}) => {
  const total = assessments.reduce((sum, item) => sum + item.weight, 0);

  return (
    <section id="assessment" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Assessment structure"
            title="Clear evaluation across practical and academic work"
            description="The assessment model may combine continuous tasks, practical work, projects, presentations, quizzes, and examinations."
          />

          <div className="mt-8 rounded-[26px] bg-jcst-navy p-6 text-white shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
              Total course assessment
            </p>
            <p className="mt-3 font-display text-5xl font-bold">{total}%</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Assessment values are configurable from the database and should follow the approved academic scheme.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {assessments.map((item) => (
            <article
              key={item.title}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,.06)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-jcst-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
                <span className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-bold text-jcst-crimson">
                  {item.weight}%
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(Math.max(item.weight, 0), 100)}%`,
                    background: 'var(--jcst-secondary)',
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const LearningExperienceSection = ({ course }: { course: WebsiteContentRecord }) => {
  const metadata = course.metadata;
  const methods = getStringArray(metadata, 'teachingMethods');
  const activities = getStringArray(metadata, 'learningActivities');

  return (
    <section id="learning" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Learning experience"
            title="Classroom, practical work, and e-learning in one course"
            description="A professional course experience supports different learning activities while keeping the learner focused on clear outcomes."
            centered
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <ListPanel
            icon={<Users size={22} />}
            title="Teaching Methods"
            items={methods}
          />
          <ListPanel
            icon={<Laptop2 size={22} />}
            title="Learning Activities"
            items={activities}
          />
        </div>
      </div>
    </section>
  );
};

const ResourcesSection = ({
  course,
  schedule,
}: {
  course: WebsiteContentRecord;
  schedule: ScheduleItem[];
}) => {
  const resources = getStringArray(course.metadata, 'resources');

  return (
    <section id="resources" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,.06)] sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-jcst-crimson">
              <LibraryBig size={22} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-jcst-crimson">
                Study resources
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-jcst-navy">
                Required and recommended materials
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {resources.map((item) => (
              <InfoPoint key={item} text={item} />
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,.06)] sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-700">
              <CalendarDays size={22} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-jcst-crimson">
                Course schedule
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-jcst-navy">
                Timetable and delivery information
              </h2>
            </div>
          </div>

          <div className="mt-6 divide-y divide-slate-100">
            {schedule.map((item) => (
              <div key={`${item.label}-${item.value}`} className="grid gap-1 py-4 sm:grid-cols-[150px_1fr]">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  {item.label}
                </p>
                <p className="text-sm font-semibold leading-6 text-slate-700">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

const InstructorSection = ({
  instructor,
  course,
}: {
  instructor: Instructor;
  course: WebsiteContentRecord;
}) => {
  const [callOptionsOpen, setCallOptionsOpen] = useState(false);
  const cleanPhone = instructor.phone.replace(/[^\d+]/g, '');
  const whatsappPhone = instructor.phone.replace(/\D/g, '');
  const emailSubject = `Question about ${course.title}`;
  const emailBody = `Hello ${instructor.name},\n\nI would like more information about ${course.title} (${getString(course.metadata, 'code')}).\n\nThank you.`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(instructor.email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Hello ${instructor.name}, I would like more information about ${course.title}.`)}`;

  return (
    <section id="instructor" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,.08)] sm:p-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
              <span
                className="grid h-20 w-20 shrink-0 place-items-center rounded-[24px] text-white shadow-xl"
                style={{ background: 'var(--jcst-primary)' }}
              >
                <UserRound size={34} />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-jcst-crimson">
                  Course instructor
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-jcst-navy sm:text-3xl">
                  {instructor.name}
                </h2>
                <p className="mt-1 font-medium text-slate-600">{instructor.title}</p>
                {instructor.bio ? (
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                    {instructor.bio}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[250px] lg:grid-cols-1">
              <a
                href={gmailUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 font-semibold text-slate-700 transition hover:border-[var(--jcst-accent)] hover:bg-white"
              >
                <Mail size={18} />
                Email
              </a>

              <button
                type="button"
                onClick={() => setCallOptionsOpen(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 font-semibold text-slate-700 transition hover:border-[var(--jcst-accent)] hover:bg-white"
              >
                <Phone size={18} />
                Call
              </button>
            </div>
          </div>
        </article>
      </div>

      {callOptionsOpen ? (
        <div className="fixed inset-0 z-[120] grid place-items-center p-4">
          <button
            type="button"
            aria-label="Close contact options"
            onClick={() => setCallOptionsOpen(false)}
            className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md rounded-[28px] border border-white/20 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setCallOptionsOpen(false)}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500"
            >
              <X size={18} />
            </button>

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-jcst-crimson">
              Contact instructor
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold text-jcst-navy">
              Choose how to contact
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Number: {instructor.phone}
            </p>

            <div className="mt-6 grid gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-13 items-center justify-center gap-3 rounded-xl bg-emerald-600 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-700"
              >
                <MessageCircle size={19} />
                WhatsApp
              </a>

              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex h-13 items-center justify-center gap-3 rounded-xl px-5 py-3.5 font-semibold text-white transition"
                style={{ background: 'var(--jcst-secondary)' }}
              >
                <Phone size={19} />
                Normal Call
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

const RelatedCoursesSection = ({
  courses,
}: {
  courses: WebsiteContentRecord[];
}) => (
  <section className="bg-slate-50 py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Continue exploring"
          title="Related courses"
          description="Discover other courses connected to the same program or academic department."
        />
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-jcst-crimson"
        >
          View all courses
          <ArrowRight size={17} />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {courses.map((course) => (
          <article
            key={course.slug}
            className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,.06)]"
          >
            <div className="h-44 overflow-hidden bg-slate-100">
              <SmartImage
                source={course.imageUrl}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-jcst-crimson">
                {getString(course.metadata, 'code')}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-jcst-navy">
                {course.title}
              </h3>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                {course.excerpt}
              </p>
              <Link
                to={`/courses/${course.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-jcst-crimson"
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

const CourseCta = ({ course }: { course: WebsiteContentRecord }) => (
  <section className="relative isolate overflow-hidden py-16 text-white sm:py-20">
    <SmartImage
      source={getString(course.metadata, 'ctaImageUrl') || course.imageUrl}
      alt={course.title}
      className="absolute inset-0 -z-30 h-full w-full object-cover"
    />
    <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(6,26,53,.99),rgba(8,47,99,.94)_58%,rgba(155,17,30,.86))]" />

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
          <BadgeCheck size={16} style={{ color: 'var(--jcst-accent)' }} />
          <span style={{ color: 'var(--jcst-accent)' }}>Continue your learning</span>
        </div>

        <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
          Ready to study {course.title}?
        </h2>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
          Access e-learning, explore the related program, or contact JCST for academic guidance.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/e-learning?course=${encodeURIComponent(course.slug)}`}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white transition hover:-translate-y-1"
            style={{ background: 'var(--jcst-secondary)' }}
          >
            <Laptop2 size={18} />
            Open E-Learning
          </Link>

          <Link
            to="/courses"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-amber-300/50 bg-white/[0.07] px-7 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.13]"
          >
            Browse More Courses
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const SectionHeading = ({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
}) => (
  <div className={centered ? 'text-center' : ''}>
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-jcst-crimson">
      {eyebrow}
    </p>
    <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-jcst-navy sm:text-4xl">
      {title}
    </h2>
    <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
      {description}
    </p>
  </div>
);

const InfoPoint = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3 rounded-[18px] border border-slate-200 bg-white p-4">
    <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-600" />
    <p className="text-sm leading-7 text-slate-600">{text}</p>
  </div>
);

const SideFact = ({ label, value }: { label: string; value: string }) => (
  <div className="border-b border-slate-200 pb-4 last:border-b-0 last:pb-0">
    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{value}</p>
  </div>
);

const ListPanel = ({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) => (
  <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,.06)] sm:p-8">
    <div className="flex items-center gap-3">
      <span
        className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50"
        style={{ color: 'var(--jcst-secondary)' }}
      >
        {icon}
      </span>
      <h3 className="font-display text-2xl font-bold text-jcst-navy">{title}</h3>
    </div>

    <div className="mt-6 grid gap-3">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-600" />
          <p className="text-sm leading-7 text-slate-600">{item}</p>
        </div>
      ))}
    </div>
  </article>
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

const getObject = <T extends object>(
  metadata: Record<string, unknown>,
  key: string,
): T | null => {
  const value = metadata[key];
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as T)
    : null;
};