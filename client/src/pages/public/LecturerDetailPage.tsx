import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  ImageIcon,
  Laptop2,
  Mail,
  MessageCircle,
  Phone,
  Quote,
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

interface QualificationItem {
  title: string;
  institution: string;
  year?: string;
}

interface ExperienceItem {
  title: string;
  organization: string;
  period: string;
  description?: string;
}

interface OfficeHours {
  days: string;
  time: string;
  location: string;
}

export const LecturerDetailPage = () => {
  const { slug = '' } = useParams();
  const { text } = usePublicWebsite();
  const lecturerQuery = useWebsiteItem('lecturer', slug);
  const coursesQuery = useWebsiteCollection('course');
  const departmentsQuery = useWebsiteCollection('department');

  const lecturer = lecturerQuery.data;
  const courses = useMemo(
    () =>
      (coursesQuery.data ?? []).filter(
        (course) => getString(course.metadata, 'lecturerSlug') === slug,
      ),
    [coursesQuery.data, slug],
  );

  const department = useMemo(() => {
    if (!lecturer) {
      return undefined;
    }

    const departmentSlug = getString(lecturer.metadata, 'department');
    return (departmentsQuery.data ?? []).find((item) => {
      const aliases = [item.slug, ...getStringArray(item.metadata, 'aliases')];
      return aliases.includes(departmentSlug);
    });
  }, [departmentsQuery.data, lecturer]);

  const loading =
    lecturerQuery.isLoading || coursesQuery.isLoading || departmentsQuery.isLoading;

  if (loading) {
    return <PageLoading />;
  }

  if (
    lecturerQuery.isError ||
    coursesQuery.isError ||
    departmentsQuery.isError ||
    !lecturer
  ) {
    return <PageError message={text('global.errors.content-not-found')} />;
  }

  return (
    <div className="overflow-x-clip bg-white">
      <LecturerHero lecturer={lecturer} courseCount={courses.length} department={department} />
      <LecturerNavigation />

      <main>
        <ProfileSection lecturer={lecturer} />
        <ExpertiseSection lecturer={lecturer} />
        <CoursesSection courses={courses} lecturer={lecturer} />
        <ProfessionalJourneySection lecturer={lecturer} />
        <TeachingSection lecturer={lecturer} />
        <ContactSection lecturer={lecturer} />
        <LecturerCta lecturer={lecturer} />
      </main>
    </div>
  );
};

const LecturerHero = ({
  lecturer,
  courseCount,
  department,
}: {
  lecturer: WebsiteContentRecord;
  courseCount: number;
  department: WebsiteContentRecord | undefined;
}) => {
  const metadata = lecturer.metadata;

  return (
    <section className="relative isolate overflow-hidden text-white" style={{ background: 'var(--jcst-dark)' }}>
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_15%_18%,rgba(197,139,20,.2),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(155,17,30,.28),transparent_34%),linear-gradient(135deg,rgba(8,47,99,.99),rgba(6,26,53,.99))]" />
      <div className="absolute inset-0 -z-20 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[.92fr_1.08fr] lg:px-8">
        <div className="relative z-10">
          <Link to="/lecturers" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
            <ArrowLeft size={17} />
            Back to Lecturers
          </Link>

          <div className="mt-7 flex flex-wrap gap-3">
            <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-xs font-bold text-amber-300 backdrop-blur">
              {getString(metadata, 'qualification')}
            </span>
            <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
              {getString(metadata, 'specialization')}
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.8rem]">
            {lecturer.title}
          </h1>

          <p className="mt-5 max-w-2xl text-xl font-semibold text-slate-100">
            {lecturer.excerpt}
          </p>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {getString(metadata, 'heroDescription') || lecturer.body}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white shadow-xl transition hover:-translate-y-1"
              style={{ background: 'var(--jcst-secondary)' }}
            >
              Contact Lecturer
              <ArrowRight size={18} />
            </a>
            <a
              href="#courses"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl border border-amber-300/40 bg-white/[0.08] px-7 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.14]"
            >
              <BookOpenCheck size={18} />
              View Courses
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[34px] border border-white/12 bg-white/[0.06] p-4 shadow-[0_35px_90px_rgba(0,0,0,.34)] backdrop-blur-xl sm:p-5">
            <div className="group relative min-h-[520px] overflow-hidden rounded-[28px] bg-slate-900">
              <SmartImage
                source={lecturer.imageUrl}
                alt={getString(metadata, 'imageAlt') || lecturer.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,18,38,.96),rgba(6,18,38,.08)_68%)]" />
              <div className="absolute inset-4 rounded-[24px] border border-white/20 sm:inset-5 sm:rounded-[25px]" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--jcst-accent)' }}>
                  Academic Profile
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                  {getString(metadata, 'departmentLabel') || department?.title || 'JCST Academic Faculty'}
                </h2>
                <p className="mt-3 max-w-xl leading-7 text-slate-200">
                  {getString(metadata, 'profileStatement')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:absolute sm:bottom-0 sm:left-6 sm:mt-0 sm:w-[460px]">
            <MiniMetric icon={<BookOpenCheck size={20} />} label="Published Courses" value={`${courseCount}`} background="var(--jcst-secondary)" />
            <MiniMetric icon={<Award size={20} />} label="Academic Experience" value={getString(metadata, 'experienceYears')} background="var(--jcst-primary)" />
          </div>
        </div>
      </div>
    </section>
  );
};

const MiniMetric = ({
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
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white sm:h-11 sm:w-11" style={{ background }}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">{label}</p>
        <p className="mt-1 break-words text-[11px] font-bold leading-4 text-slate-800 sm:text-sm sm:leading-5">{value}</p>
      </div>
    </div>
  </article>
);

const LecturerNavigation = () => (
  <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
    <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-4 text-sm font-semibold text-slate-600 sm:px-6 lg:px-8">
      <a href="#profile" className="shrink-0 transition hover:text-jcst-crimson">Profile</a>
      <a href="#expertise" className="shrink-0 transition hover:text-jcst-crimson">Expertise</a>
      <a href="#courses" className="shrink-0 transition hover:text-jcst-crimson">Courses</a>
      <a href="#experience" className="shrink-0 transition hover:text-jcst-crimson">Experience</a>
      <a href="#teaching" className="shrink-0 transition hover:text-jcst-crimson">Teaching</a>
      <a href="#contact" className="shrink-0 transition hover:text-jcst-crimson">Contact</a>
    </div>
  </nav>
);

const ProfileSection = ({ lecturer }: { lecturer: WebsiteContentRecord }) => {
  const metadata = lecturer.metadata;

  return (
    <section id="profile" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Professional Profile"
            title={getString(metadata, 'profileTitle') || `About ${lecturer.title}`}
            description={lecturer.body}
          />

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            <InfoCard label="Qualification" value={getString(metadata, 'qualification')} icon={<GraduationCap size={19} />} />
            <InfoCard label="Specialization" value={getString(metadata, 'specialization')} icon={<Target size={19} />} />
            <InfoCard label="Department" value={getString(metadata, 'departmentLabel')} icon={<Users size={19} />} />
            <InfoCard label="Teaching Model" value={getString(metadata, 'teachingModel')} icon={<Laptop2 size={19} />} />
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-6 shadow-[0_18px_44px_rgba(15,23,42,.06)] sm:p-8">
          <Quote size={32} className="text-jcst-crimson" />
          <blockquote className="mt-5 font-display text-2xl font-bold leading-snug text-jcst-navy sm:text-3xl">
            “{getString(metadata, 'teachingQuote')}”
          </blockquote>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
            {lecturer.title}
          </p>
        </div>
      </div>
    </section>
  );
};

const InfoCard = ({ label, value, icon }: { label: string; value: string; icon: ReactNode }) => (
  <article className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,.05)] sm:p-5">
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-jcst-crimson">{icon}</span>
    <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-bold leading-6 text-slate-800">{value}</p>
  </article>
);

const ExpertiseSection = ({ lecturer }: { lecturer: WebsiteContentRecord }) => {
  const metadata = lecturer.metadata;
  const expertise = getStringArray(metadata, 'expertise');
  const researchInterests = getStringArray(metadata, 'researchInterests');

  return (
    <section id="expertise" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Academic Strengths"
            title="Expertise, interests, and areas of contribution"
            description="A clear view of the lecturer’s teaching expertise, professional interests, and academic direction."
            centered
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <ListPanel title="Areas of Expertise" icon={<BadgeCheck size={22} />} items={expertise} />
          <ListPanel title="Research and Professional Interests" icon={<BriefcaseBusiness size={22} />} items={researchInterests} />
        </div>
      </div>
    </section>
  );
};

const ListPanel = ({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) => (
  <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,.06)] sm:p-8">
    <div className="flex items-center gap-3">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-jcst-crimson">{icon}</span>
      <h3 className="font-display text-2xl font-bold text-jcst-navy">{title}</h3>
    </div>

    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-jcst-crimson" />
          <p className="text-sm font-semibold leading-6 text-slate-700">{item}</p>
        </div>
      ))}
    </div>
  </article>
);

const CoursesSection = ({
  courses,
  lecturer,
}: {
  courses: WebsiteContentRecord[];
  lecturer: WebsiteContentRecord;
}) => (
  <section id="courses" className="scroll-mt-24 bg-white py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Courses Taught"
          title={`Learn with ${lecturer.title}`}
          description="Explore published courses connected to this lecturer’s academic profile."
        />
        <Link to="/courses" className="inline-flex shrink-0 items-center gap-2 font-semibold text-jcst-crimson">
          View all courses
          <ArrowRight size={17} />
        </Link>
      </div>

      {courses.length ? (
        <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <article key={course.id} className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,.06)] transition duration-300 hover:-translate-y-1 hover:border-[var(--jcst-accent)] hover:shadow-[0_20px_44px_rgba(15,23,42,.1)]">
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                <SmartImage source={course.imageUrl} alt={course.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,26,53,.72),transparent_70%)]" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.13em] text-jcst-crimson">
                  {getString(course.metadata, 'code')}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-bold text-jcst-navy">{course.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-600">{course.excerpt}</p>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                  <span>{getString(course.metadata, 'semester')}</span>
                  <span>{getNumber(course.metadata, 'credits')} credits</span>
                </div>
                <Link to={`/courses/${course.slug}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-jcst-crimson">
                  View Course Details
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-9 rounded-[26px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
          No published courses are currently linked to this lecturer profile.
        </div>
      )}
    </div>
  </section>
);

const ProfessionalJourneySection = ({ lecturer }: { lecturer: WebsiteContentRecord }) => {
  const metadata = lecturer.metadata;
  const qualifications = getObjectArray<QualificationItem>(metadata, 'qualifications');
  const experience = getObjectArray<ExperienceItem>(metadata, 'professionalExperience');

  return (
    <section id="experience" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Professional Journey"
            title="Qualifications and experience"
            description="Academic preparation and professional experience that support quality teaching, mentorship, and student development."
            centered
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <TimelinePanel
            title="Academic Qualifications"
            icon={<GraduationCap size={22} />}
            items={qualifications.map((item) => ({
              title: item.title,
              subtitle: item.institution,
              meta: item.year || '',
            }))}
          />
          <TimelinePanel
            title="Professional Experience"
            icon={<BriefcaseBusiness size={22} />}
            items={experience.map((item) => ({
              title: item.title,
              subtitle: item.organization,
              meta: item.period,
              ...(item.description ? { description: item.description } : {}),
            }))}
          />
        </div>
      </div>
    </section>
  );
};

const TimelinePanel = ({
  title,
  icon,
  items,
}: {
  title: string;
  icon: ReactNode;
  items: Array<{ title: string; subtitle: string; meta: string; description?: string }>;
}) => (
  <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,.06)] sm:p-8">
    <div className="flex items-center gap-3">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-jcst-crimson">{icon}</span>
      <h3 className="font-display text-2xl font-bold text-jcst-navy">{title}</h3>
    </div>

    <div className="mt-7 grid gap-5">
      {items.map((item) => (
        <div key={`${item.title}-${item.subtitle}-${item.meta}`} className="relative border-l-2 border-slate-200 pl-5">
          <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-jcst-crimson ring-4 ring-red-50" />
          <p className="font-bold text-slate-900">{item.title}</p>
          <p className="mt-1 text-sm font-semibold text-slate-600">{item.subtitle}</p>
          {item.meta ? <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{item.meta}</p> : null}
          {item.description ? <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p> : null}
        </div>
      ))}
    </div>
  </article>
);

const TeachingSection = ({ lecturer }: { lecturer: WebsiteContentRecord }) => {
  const metadata = lecturer.metadata;
  const methods = getStringArray(metadata, 'teachingMethods');
  const support = getStringArray(metadata, 'studentSupport');

  return (
    <section id="teaching" className="scroll-mt-24 relative isolate overflow-hidden py-16 text-white sm:py-20" style={{ background: 'var(--jcst-dark)' }}>
      <div className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(circle,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:30px_30px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Teaching Approach"
            title="A student-centered model for practical and digital learning"
            description={getString(metadata, 'teachingPhilosophy')}
            inverse
            centered
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <DarkListPanel title="Teaching Methods" icon={<BookOpenCheck size={22} />} items={methods} />
          <DarkListPanel title="Student Support" icon={<Users size={22} />} items={support} />
        </div>
      </div>
    </section>
  );
};

const DarkListPanel = ({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) => (
  <article className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl sm:p-8">
    <div className="flex items-center gap-3">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.08]" style={{ color: 'var(--jcst-accent)' }}>{icon}</span>
      <h3 className="font-display text-2xl font-bold">{title}</h3>
    </div>
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-4">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0" style={{ color: 'var(--jcst-accent)' }} />
          <p className="text-sm font-semibold leading-6 text-slate-200">{item}</p>
        </div>
      ))}
    </div>
  </article>
);

const ContactSection = ({ lecturer }: { lecturer: WebsiteContentRecord }) => {
  const metadata = lecturer.metadata;
  const email = getString(metadata, 'email');
  const phone = getString(metadata, 'phone');
  const officeHours = getObject<OfficeHours>(metadata, 'officeHours');
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    if (!contactOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContactOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [contactOpen]);

  const normalizedPhone = normalizePhoneForDialing(phone);
  const whatsappNumber = normalizePhoneForWhatsApp(phone);
  const emailSubject = encodeURIComponent(`Academic enquiry for ${lecturer.title}`);
  const emailBody = encodeURIComponent(
    `Dear ${lecturer.title},\n\nI am contacting you through the JCST website regarding your academic profile and courses.\n\nThank you.`,
  );
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${emailSubject}&body=${emailBody}`;
  const whatsappMessage = encodeURIComponent(
    `Hello ${lecturer.title}, I am contacting you through the JCST website regarding your academic profile and courses.`,
  );
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : '';

  return (
    <section id="contact" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,.08)] sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-jcst-crimson">Academic Contact</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-jcst-navy sm:text-4xl">Connect with {lecturer.title}</h2>
              <p className="mt-4 max-w-2xl leading-8 text-slate-600">
                Use the contact options below for course-related guidance, academic questions, or scheduled student support.
              </p>

              {officeHours ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <ContactInfo icon={<CalendarDays size={18} />} label="Days" value={officeHours.days} />
                  <ContactInfo icon={<Clock3 size={18} />} label="Time" value={officeHours.time} />
                  <ContactInfo icon={<UserRound size={18} />} label="Location" value={officeHours.location} />
                </div>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {email ? (
                <a
                  href={gmailComposeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--jcst-accent)]"
                >
                  <Mail size={18} />
                  Email Lecturer
                </a>
              ) : null}

              {phone ? (
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-6 font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                  style={{ background: 'var(--jcst-secondary)' }}
                >
                  <Phone size={18} />
                  Call Lecturer
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {contactOpen ? (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <button type="button" aria-label="Close call options" onClick={() => setContactOpen(false)} className="absolute inset-0" />

          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-jcst-crimson">Contact Options</p>
                <h3 className="mt-1 font-display text-2xl font-bold text-jcst-navy">Choose how to call</h3>
              </div>
              <button type="button" onClick={() => setContactOpen(false)} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-3 p-6">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setContactOpen(false)}
                  className="group flex min-h-[64px] items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 text-left transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-lg"><MessageCircle size={21} /></span>
                  <span>
                    <span className="block font-bold text-emerald-900">WhatsApp</span>
                    <span className="mt-1 block text-sm text-emerald-800">Open a WhatsApp conversation</span>
                  </span>
                </a>
              ) : null}

              {normalizedPhone ? (
                <a
                  href={`tel:${normalizedPhone}`}
                  onClick={() => setContactOpen(false)}
                  className="group flex min-h-[64px] items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--jcst-accent)] hover:bg-white"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-lg" style={{ background: 'var(--jcst-primary)' }}><Phone size={21} /></span>
                  <span>
                    <span className="block font-bold text-slate-900">Normal Call</span>
                    <span className="mt-1 block text-sm text-slate-600">Open the phone dialer</span>
                  </span>
                </a>
              ) : null}
            </div>

            <p className="px-6 pb-6 text-xs leading-5 text-slate-500">
              WhatsApp will indicate whether the number is registered on WhatsApp.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
};

const ContactInfo = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
  <article className="rounded-[18px] border border-slate-200 bg-slate-50 p-4">
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-jcst-crimson shadow-sm">{icon}</span>
    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-bold leading-6 text-slate-700">{value}</p>
  </article>
);

const LecturerCta = ({ lecturer }: { lecturer: WebsiteContentRecord }) => (
  <section className="relative isolate overflow-hidden py-16 text-white sm:py-20">
    <SmartImage
      source={getString(lecturer.metadata, 'ctaImageUrl') || lecturer.imageUrl}
      alt={getString(lecturer.metadata, 'ctaImageAlt') || lecturer.title}
      className="absolute inset-0 -z-30 h-full w-full object-cover"
    />
    <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(6,26,53,.99),rgba(8,47,99,.94)_58%,rgba(155,17,30,.86))]" />
    <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:48px_48px]" />

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.19em]" style={{ color: 'var(--jcst-accent)' }}>Continue Learning</p>
        <h2 className="mt-5 font-display text-4xl font-bold sm:text-5xl">Explore courses, programs, and e-learning opportunities.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">Learn with JCST academic staff through organized classroom instruction and connected digital learning.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/courses" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-7 font-semibold text-white shadow-xl transition hover:-translate-y-1" style={{ background: 'var(--jcst-secondary)' }}>
            Explore Courses
            <ArrowRight size={18} />
          </Link>
          <Link to="/programs" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15">
            View Programs
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
    <p className="text-xs font-bold uppercase tracking-[0.19em]" style={{ color: 'var(--jcst-accent)' }}>{eyebrow}</p>
    <h2 className={`mt-4 font-display text-2xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl lg:text-[2.65rem] ${inverse ? 'text-white' : ''}`} style={inverse ? undefined : { color: 'var(--jcst-primary)' }}>{title}</h2>
    <p className={`mt-5 text-base leading-8 sm:text-lg ${inverse ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>
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

const normalizePhoneForDialing = (phone: string): string => {
  const trimmed = phone.trim();
  if (!trimmed) return '';
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';
  if (trimmed.startsWith('+')) return `+${digits}`;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  return digits;
};

const normalizePhoneForWhatsApp = (phone: string): string =>
  normalizePhoneForDialing(phone).replace(/\D/g, '');

const getString = (metadata: Record<string, unknown>, key: string): string => {
  const value = metadata[key];
  return typeof value === 'string' ? value : '';
};

const getNumber = (metadata: Record<string, unknown>, key: string): number => {
  const value = metadata[key];
  return typeof value === 'number' ? value : 0;
};

const getStringArray = (metadata: Record<string, unknown>, key: string): string[] => {
  const value = metadata[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
};

const getObject = <T extends object>(metadata: Record<string, unknown>, key: string): T | null => {
  const value = metadata[key];
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as T) : null;
};

const getObjectArray = <T extends object>(metadata: Record<string, unknown>, key: string): T[] => {
  const value = metadata[key];
  return Array.isArray(value)
    ? value.filter((item): item is T => Boolean(item) && typeof item === 'object' && !Array.isArray(item))
    : [];
};