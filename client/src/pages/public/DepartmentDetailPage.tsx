/// <reference types="react" />
import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  GraduationCap,
  ImageIcon,
  Laptop2,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
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

interface DepartmentHead {
  name: string;
  title: string;
  email: string;
  phone: string;
  bio?: string;
  imageUrl?: string;
}

interface Facility {
  title: string;
  description: string;
  icon?: string;
}

export const DepartmentDetailPage = () => {
  const { slug = '' } = useParams();
  const { text } = usePublicWebsite();
  const departmentQuery = useWebsiteItem('department', slug);
  const programsQuery = useWebsiteCollection('program');
  const coursesQuery = useWebsiteCollection('course');
  const lecturersQuery = useWebsiteCollection('lecturer');

  const loading =
    departmentQuery.isLoading ||
    programsQuery.isLoading ||
    coursesQuery.isLoading ||
    lecturersQuery.isLoading;

  if (loading) {
    return <PageLoading />;
  }

  if (
    departmentQuery.isError ||
    programsQuery.isError ||
    coursesQuery.isError ||
    lecturersQuery.isError ||
    !departmentQuery.data
  ) {
    return <PageError message={text('global.errors.content-not-found')} />;
  }

  const department = departmentQuery.data;
  const metadata = department.metadata;
  const aliases = [department.slug, ...getStringArray(metadata, 'aliases')];
  const programs = (programsQuery.data ?? []).filter((item) =>
    aliases.includes(getString(item.metadata, 'department')),
  );
  const courses = (coursesQuery.data ?? []).filter((item) =>
    aliases.includes(getString(item.metadata, 'department')),
  );
  const lecturers = (lecturersQuery.data ?? []).filter((item) =>
    aliases.includes(getString(item.metadata, 'department')),
  );
  const head = getObject<DepartmentHead>(metadata, 'head');
  const facilities = getObjectArray<Facility>(metadata, 'facilities');

  return (
    <div className="overflow-x-clip bg-white">
      <DepartmentHero
        department={department}
        programCount={programs.length}
        courseCount={courses.length}
        lecturerCount={lecturers.length}
      />

      <DepartmentNavigation />

      <main>
        <OverviewSection department={department} />
        <MissionVisionSection department={department} />
        <ProgramsSection programs={programs} />
        <CoursesSection courses={courses} />
        <LecturersSection lecturers={lecturers} />
        <FacilitiesSection facilities={facilities} department={department} />
        <CareerSection department={department} />
        {head ? <HeadSection head={head} department={department} /> : null}
        <DepartmentCta department={department} />
      </main>
    </div>
  );
};

const DepartmentHero = ({
  department,
  programCount,
  courseCount,
  lecturerCount,
}: {
  department: WebsiteContentRecord;
  programCount: number;
  courseCount: number;
  lecturerCount: number;
}) => {
  const metadata = department.metadata;

  return (
    <section className="relative isolate overflow-hidden text-white" style={{ background: 'var(--jcst-dark)' }}>
      <SmartImage
        source={department.imageUrl}
        alt={getString(metadata, 'imageAlt') || department.title}
        className="absolute inset-0 -z-30 h-full w-full object-cover"
        priority
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(6,26,53,.99),rgba(8,47,99,.92)_58%,rgba(155,17,30,.78))]" />
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:52px_52px]" />

      <div className="mx-auto grid min-h-[660px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[.98fr_1.02fr] lg:px-8">
        <div className="relative z-10">
          <Link to="/departments" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
            <ArrowLeft size={17} />
            Back to Departments
          </Link>

          <div className="mt-7 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/20 bg-white/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
              {getString(metadata, 'code')}
            </span>
            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-bold text-amber-300 backdrop-blur">
              {getString(metadata, 'focusArea')}
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.7rem]">
            {department.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            {department.excerpt}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/programs?department=${encodeURIComponent(department.slug)}`}
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white shadow-xl transition hover:-translate-y-1"
              style={{ background: 'var(--jcst-secondary)' }}
            >
              Explore Department Programs
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/e-learning"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl border border-amber-300/40 bg-white/[0.08] px-7 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.14]"
            >
              <Laptop2 size={18} />
              E-Learning Access
            </Link>
          </div>
        </div>

        <div className="rounded-[34px] border border-white/12 bg-white/[0.07] p-5 shadow-[0_35px_90px_rgba(0,0,0,.32)] backdrop-blur-xl sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--jcst-accent)' }}>
            Department at a glance
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <HeroMetric value={programCount} label="Programs" icon={<GraduationCap size={20} />} />
            <HeroMetric value={courseCount} label="Courses" icon={<BookOpenCheck size={20} />} />
            <HeroMetric value={lecturerCount} label="Academic Staff" icon={<Users size={20} />} />
            <HeroMetric value={getObjectArray<Facility>(metadata, 'facilities').length} label="Learning Facilities" icon={<Building2 size={20} />} />
          </div>

          <div className="mt-5 rounded-[22px] border border-white/10 bg-slate-950/25 p-5">
            <div className="flex items-start gap-3">
              <BadgeCheck size={21} className="mt-0.5 shrink-0" style={{ color: 'var(--jcst-accent)' }} />
              <div>
                <p className="font-bold">{getString(metadata, 'heroCardTitle') || 'Professional academic direction'}</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {getString(metadata, 'heroCardDescription') || department.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroMetric = ({ value, label, icon }: { value: number; label: string; icon: ReactNode }) => (
  <article className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10" style={{ color: 'var(--jcst-accent)' }}>
      {icon}
    </span>
    <p className="mt-4 font-display text-2xl font-bold">{value}</p>
    <p className="mt-1 text-xs font-medium leading-5 text-slate-300 sm:text-sm">{label}</p>
  </article>
);

const DepartmentNavigation = () => (
  <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
    <div className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-4 py-4 text-sm font-semibold text-slate-600 sm:px-6 lg:px-8">
      {[
        ['Overview', '#overview'],
        ['Programs', '#programs'],
        ['Courses', '#courses'],
        ['Lecturers', '#lecturers'],
        ['Facilities', '#facilities'],
        ['Careers', '#careers'],
      ].map(([label, href]) => (
        <a key={href} href={href} className="shrink-0 transition hover:text-jcst-crimson">
          {label}
        </a>
      ))}
    </div>
  </nav>
);

const OverviewSection = ({ department }: { department: WebsiteContentRecord }) => {
  const metadata = department.metadata;
  const highlights = getStringArray(metadata, 'highlights');

  return (
    <section id="overview" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        <div>
          <SectionHeading eyebrow="Department Overview" title={getString(metadata, 'overviewTitle') || `About ${department.title}`} description={department.body} />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            {highlights.map((item) => (
              <div key={item} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <CheckCircle2 size={20} className="text-jcst-crimson" />
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[470px] overflow-hidden rounded-[32px] border border-slate-200 bg-slate-100 shadow-[0_24px_60px_rgba(15,23,42,.12)]">
          <SmartImage
            source={getString(metadata, 'overviewImageUrl') || department.imageUrl}
            alt={getString(metadata, 'overviewImageAlt') || department.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.94),transparent_72%)]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-amber-300">Student-centered learning</p>
            <p className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Knowledge, practical competence, and professional responsibility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const MissionVisionSection = ({ department }: { department: WebsiteContentRecord }) => {
  const metadata = department.metadata;

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <article className="relative overflow-hidden rounded-[30px] p-8 text-white shadow-[0_24px_60px_rgba(6,26,53,.18)] sm:p-10" style={{ background: 'var(--jcst-primary)' }}>
          <Target size={28} style={{ color: 'var(--jcst-accent)' }} />
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Our Mission</p>
          <h2 className="mt-3 font-display text-3xl font-bold">Purposeful academic service</h2>
          <p className="mt-5 text-base leading-8 text-slate-200 sm:text-lg">{getString(metadata, 'mission')}</p>
        </article>

        <article className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-8 shadow-[0_20px_52px_rgba(15,23,42,.08)] sm:p-10">
          <Sparkles size={28} className="text-jcst-crimson" />
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-jcst-crimson">Our Vision</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-jcst-navy">Progress with academic quality</h2>
          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{getString(metadata, 'vision')}</p>
        </article>
      </div>
    </section>
  );
};

const ProgramsSection = ({ programs }: { programs: WebsiteContentRecord[] }) => (
  <section id="programs" className="scroll-mt-24 py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Department Programs" title="Academic pathways connected to professional goals" description="Explore the programs currently linked to this department. Each program page includes complete requirements, curriculum, delivery modes, and career information." centered />

      {programs.length ? (
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {programs.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>
      ) : (
        <CollectionEmpty label="Programs" />
      )}
    </div>
  </section>
);

const ProgramCard = ({ program }: { program: WebsiteContentRecord }) => {
  const metadata = program.metadata;

  return (
    <article className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_16px_42px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:border-[var(--jcst-accent)]">
      <div className="grid h-full sm:grid-cols-[180px_1fr]">
        <div className="relative min-h-[210px] overflow-hidden bg-slate-900">
          <SmartImage source={program.imageUrl} alt={program.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.72),transparent)]" />
        </div>
        <div className="flex flex-col p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-jcst-crimson">{getString(metadata, 'code')}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{getString(metadata, 'qualification')}</span>
          </div>
          <h3 className="mt-4 font-display text-2xl font-bold text-jcst-navy">{program.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{program.excerpt}</p>
          <Link to={`/programs/${program.slug}`} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-jcst-crimson">
            View Program Details
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
};

const CoursesSection = ({ courses }: { courses: WebsiteContentRecord[] }) => (
  <section id="courses" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Department Courses" title="Structured courses for academic and practical development" description="Open any course to review its overview, learning outcomes, modules, assessments, instructor information, and e-learning support." centered />

      {courses.length ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.slice(0, 6).map((course) => (
            <article key={course.slug} className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,.06)]">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-jcst-crimson">{getString(course.metadata, 'code')}</span>
                <BookOpenCheck size={21} className="text-slate-400" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-jcst-navy">{course.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{course.excerpt}</p>
              <div className="mt-auto pt-5">
                <Link to={`/courses/${course.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-jcst-crimson">
                  View Course Details
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <CollectionEmpty label="Courses" />
      )}
    </div>
  </section>
);

const LecturersSection = ({ lecturers }: { lecturers: WebsiteContentRecord[] }) => (
  <section id="lecturers" className="scroll-mt-24 py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Academic Staff" title="Lecturers supporting knowledge, skills, and student progress" description="Department lecturers contribute instruction, mentorship, assessment, and practical academic guidance." centered />

      {lecturers.length ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lecturers.slice(0, 6).map((lecturer) => (
            <article key={lecturer.slug} className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_16px_42px_rgba(15,23,42,.06)]">
              <div className="relative min-h-[270px] bg-slate-100">
                <SmartImage source={lecturer.imageUrl} alt={lecturer.title} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-jcst-crimson">{getString(lecturer.metadata, 'qualification')}</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-jcst-navy">{lecturer.title}</h3>
                <p className="mt-2 text-sm font-semibold text-slate-500">{lecturer.excerpt}</p>
                <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">{lecturer.body}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <CollectionEmpty label="Lecturers" />
      )}
    </div>
  </section>
);

const FacilitiesSection = ({ facilities, department }: { facilities: Facility[]; department: WebsiteContentRecord }) => (
  <section id="facilities" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Learning Environment" title="Facilities that support modern academic delivery" description={getString(department.metadata, 'facilitiesDescription') || 'Department learning is supported by practical spaces, digital resources, and student-centered academic services.'} centered />

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {facilities.map((facility) => (
          <article key={facility.title} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,.05)]">
            <Building2 size={22} className="text-jcst-crimson" />
            <h3 className="mt-4 font-bold text-jcst-navy">{facility.title}</h3>
            <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm sm:leading-7">{facility.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const CareerSection = ({ department }: { department: WebsiteContentRecord }) => {
  const careers = getStringArray(department.metadata, 'careerPathways');

  return (
    <section id="careers" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[.95fr_1.05fr] lg:px-8">
        <div>
          <SectionHeading eyebrow="Career Direction" title="Professional pathways connected to department study" description={getString(department.metadata, 'careerDescription') || 'Programs and courses within the department help learners build knowledge and practical readiness for further study, employment, entrepreneurship, and community contribution.'} />
          <div className="mt-8 grid grid-cols-2 gap-3">
            {careers.map((career) => (
              <div key={career} className="flex items-start gap-3 rounded-[18px] border border-slate-200 bg-slate-50 p-4">
                <BriefcaseBusiness size={18} className="mt-0.5 shrink-0 text-jcst-crimson" />
                <span className="text-sm font-semibold leading-6 text-slate-700">{career}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[480px] overflow-hidden rounded-[32px] border border-slate-200 bg-slate-100 shadow-[0_24px_60px_rgba(15,23,42,.12)]">
          <SmartImage source={getString(department.metadata, 'careerImageUrl') || department.imageUrl} alt={getString(department.metadata, 'careerImageAlt') || department.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.94),transparent_68%)]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-amber-300">Graduate Readiness</p>
            <h3 className="mt-3 font-display text-3xl font-bold">Learn with purpose. Graduate with direction.</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

const HeadSection = ({ head, department }: { head: DepartmentHead; department: WebsiteContentRecord }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_52px_rgba(15,23,42,.08)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
              <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[22px] text-white shadow-xl" style={{ background: 'var(--jcst-primary)' }}>
                {head.imageUrl ? (
                  <img src={head.imageUrl} alt={head.name} className="h-full w-full object-cover" />
                ) : (
                  <UserRound size={34} />
                )}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-jcst-crimson">Department Leadership</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-jcst-navy sm:text-3xl">{head.name}</h2>
                <p className="mt-1 font-semibold text-slate-600">{head.title}</p>
                {head.bio ? <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{head.bio}</p> : null}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[270px] lg:grid-cols-1">
              <a
                href={buildMailto(head.email, department.title)}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 font-semibold text-slate-700 transition hover:border-[var(--jcst-accent)] hover:bg-white"
              >
                <Mail size={18} />
                Email
              </a>
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 font-semibold text-slate-700 transition hover:border-[var(--jcst-accent)] hover:bg-white"
              >
                <Phone size={18} />
                Call
              </button>
            </div>
          </div>
        </article>
      </div>

      {dialogOpen ? (
        <ContactChoiceDialog
          phone={head.phone}
          contactName={head.name}
          context={department.title}
          onClose={() => setDialogOpen(false)}
        />
      ) : null}
    </section>
  );
};

const DepartmentCta = ({ department }: { department: WebsiteContentRecord }) => (
  <section className="relative isolate overflow-hidden py-16 text-white sm:py-20">
    <SmartImage source={getString(department.metadata, 'ctaImageUrl') || department.imageUrl} alt={getString(department.metadata, 'ctaImageAlt') || department.title} className="absolute inset-0 -z-30 h-full w-full object-cover" />
    <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(6,26,53,.99),rgba(8,47,99,.94)_58%,rgba(155,17,30,.86))]" />

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Continue Your Journey</p>
        <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Study, grow, and build your future with JCST.</h2>
        <p className="mt-5 text-lg leading-8 text-slate-200">Explore complete programs within {department.title} or begin your admission application.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to={`/programs?department=${encodeURIComponent(department.slug)}`} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white shadow-xl transition hover:-translate-y-1" style={{ background: 'var(--jcst-secondary)' }}>
            View Programs
            <ArrowRight size={18} />
          </Link>
          <Link to="/apply" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-amber-300/40 bg-white/10 px-7 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15">
            Apply Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const ContactChoiceDialog = ({ phone, contactName, context, onClose }: { phone: string; contactName: string; context: string; onClose: () => void }) => {
  const whatsappNumber = normalizePhoneForWhatsApp(phone);
  const dialNumber = normalizePhoneForDial(phone);
  const whatsappMessage = encodeURIComponent(`Hello ${contactName}, I would like information about ${context} at JCST.`);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-jcst-crimson">Choose Contact Method</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-jcst-navy">Contact {contactName}</h3>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-3">
          <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:border-emerald-400">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-600 text-white"><MessageCircle size={21} /></span>
            <div><span className="block font-bold text-emerald-900">WhatsApp</span><span className="mt-1 block text-sm text-emerald-800">Open a WhatsApp conversation</span></div>
          </a>

          <a href={`tel:${dialNumber}`} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[var(--jcst-accent)]">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-jcst-navy text-white"><Phone size={21} /></span>
            <div><span className="block font-bold text-jcst-navy">Normal Call</span><span className="mt-1 block text-sm text-slate-600">Open the phone dialer</span></div>
          </a>
        </div>
      </div>
    </div>
  );
};

const CollectionEmpty = ({ label }: { label: string }) => (
  <div className="mt-10 rounded-[26px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
    <p className="font-display text-xl font-bold text-jcst-navy">No published {label.toLowerCase()} yet</p>
    <p className="mt-2 text-sm text-slate-600">Published records connected to this department will appear here automatically.</p>
  </div>
);

const SectionHeading = ({ eyebrow, title, description, centered = false }: { eyebrow: string; title: string; description: string; centered?: boolean }) => (
  <div className={centered ? 'mx-auto max-w-3xl text-center' : ''}>
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-jcst-crimson">{eyebrow}</p>
    <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-jcst-navy sm:text-4xl">{title}</h2>
    <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{description}</p>
  </div>
);

const SmartImage = ({ source, alt, className, priority = false }: { source: string; alt: string; className: string; priority?: boolean }) => {
  const [failed, setFailed] = useState(false);

  if (!source || failed) {
    return (
      <div role="img" aria-label={alt || undefined} className={`${className} grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(197,139,20,.24),transparent_28%),linear-gradient(145deg,#e8edf5,#cbd5e1_55%,#334155)]`}>
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/35 bg-white/85 text-jcst-crimson shadow-lg backdrop-blur"><ImageIcon size={25} aria-hidden="true" /></span>
      </div>
    );
  }

  return <img src={source} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} className={className} onError={() => setFailed(true)} />;
};

const buildMailto = (email: string, context: string): string => {
  const subject = encodeURIComponent(`Inquiry about ${context}`);
  const body = encodeURIComponent(`Hello,\n\nI would like more information about ${context} at JCST.\n\nThank you.`);
  return `mailto:${email}?subject=${subject}&body=${body}`;
};

const normalizePhoneForWhatsApp = (phone: string): string => phone.replace(/\D/g, '');
const normalizePhoneForDial = (phone: string): string => phone.replace(/[^\d+]/g, '');

const getString = (metadata: Record<string, unknown>, key: string): string => {
  const value = metadata[key];
  return typeof value === 'string' ? value : '';
};

const getStringArray = (metadata: Record<string, unknown>, key: string): string[] => {
  const value = metadata[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
};

const getObject = <T extends object>(metadata: Record<string, unknown>, key: string): T | undefined => {
  const value = metadata[key];
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as T) : undefined;
};

const getObjectArray = <T extends object>(metadata: Record<string, unknown>, key: string): T[] => {
  const value = metadata[key];
  return Array.isArray(value) ? value.filter((item): item is T => Boolean(item) && typeof item === 'object' && !Array.isArray(item)) : [];
};