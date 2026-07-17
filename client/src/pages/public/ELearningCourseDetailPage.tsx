import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  GraduationCap,
  ImageIcon,
  Languages,
  LockKeyhole,
  MonitorPlay,
  PlayCircle,
  ShieldCheck,
  Star,
  UserRound,
  Video,
  X,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { WebsiteContentRecord } from '@jcst/shared';
import { PageError, PageLoading } from '@/components/common/PageState';
import { useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';

interface Instructor {
  name?: string;
  title?: string;
  bio?: string;
}

interface LessonPreview {
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'exam' | 'pdf';
  duration: string;
  isPreview: boolean;
  previewVideoUrl?: string;
}

interface CurriculumSection {
  title: string;
  description?: string;
  lessons: LessonPreview[];
}

export const ELearningCourseDetailPage = () => {
  const { slug = '' } = useParams();
  const courseQuery = useWebsiteItem('course', slug);
  const { text } = usePublicWebsite();
  const [openSection, setOpenSection] = useState(0);
  const [lockedLesson, setLockedLesson] = useState<LessonPreview | null>(null);
  const [previewLesson, setPreviewLesson] = useState<LessonPreview | null>(null);

  const course = courseQuery.data;
  const curriculum = useMemo(
    () => getObjectArray<CurriculumSection>(course?.metadata ?? {}, 'publicCurriculum'),
    [course?.metadata],
  );

  const freePreview = useMemo(
    () => curriculum.flatMap((section) => section.lessons).find((lesson) => lesson.isPreview),
    [curriculum],
  );

  if (courseQuery.isLoading) {
    return <PageLoading />;
  }

  if (courseQuery.isError || !course || !getBoolean(course.metadata, 'isPaidCourse')) {
    return <PageError message={text('global.errors.content-not-found')} />;
  }

  const metadata = course.metadata;
  const price = getNumber(metadata, 'price');
  const originalPrice = getNumber(metadata, 'originalPrice');
  const currency = getString(metadata, 'currency') || 'USD';
  const instructor = getObject<Instructor>(metadata, 'instructor');
  const outcomes = getStringArray(metadata, 'learningOutcomes');
  const requirements = getStringArray(metadata, 'requirements');
  const includes = getStringArray(metadata, 'includes');
  const totalLessons = curriculum.reduce((total, section) => total + section.lessons.length, 0);
  const purchaseLink = `/checkout/course/${course.slug}`;

  return (
    <div className="overflow-x-clip bg-white">
      <section className="relative isolate overflow-hidden text-white" style={{ background: 'var(--jcst-dark)' }}>
        <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_14%_15%,rgba(197,139,20,.18),transparent_28%),radial-gradient(circle_at_90%_8%,rgba(155,17,30,.3),transparent_35%),linear-gradient(135deg,rgba(8,47,99,.99),rgba(6,26,53,.99))]" />

        <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
          <div>
            <Link to="/e-learning" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white">
              <ArrowLeft size={17} /> Back to E-Learning
            </Link>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em]">{getString(metadata, 'code')}</span>
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-bold text-amber-300">Paid Course</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold">{getString(metadata, 'level')}</span>
            </div>

            <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.04] tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]">{course.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">{course.excerpt}</p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-300">
              <span className="inline-flex items-center gap-2"><BookOpenCheck size={17} className="text-amber-300" /> {totalLessons} lessons</span>
              <span className="inline-flex items-center gap-2"><Clock3 size={17} className="text-amber-300" /> {getString(metadata, 'duration')}</span>
              <span className="inline-flex items-center gap-2"><Languages size={17} className="text-amber-300" /> {getString(metadata, 'language')}</span>
              <span className="inline-flex items-center gap-2"><Award size={17} className="text-amber-300" /> Certificate eligible</span>
            </div>

            {instructor ? (
              <div className="mt-8 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10"><UserRound size={19} /></span>
                <div>
                  <p className="text-xs text-slate-400">Course instructor</p>
                  <p className="mt-1 font-semibold">{instructor.name}</p>
                </div>
              </div>
            ) : null}
          </div>

          <PricingCard
            course={course}
            price={price}
            originalPrice={originalPrice}
            currency={currency}
            includes={includes}
            purchaseLink={purchaseLink}
            {...(freePreview ? { previewLesson: freePreview } : {})}
            onPreview={() => {
              if (freePreview) {
                setPreviewLesson(freePreview);
              }
            }}
          />
        </div>
      </section>

      <main>
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
            <div>
              <SectionTitle eyebrow="Course Overview" title="Know exactly what you are buying" />
              <div className="mt-6 space-y-5 text-base leading-8 text-slate-600 sm:text-lg">
                <p>{course.body}</p>
              </div>

              <div className="mt-10 rounded-[26px] border border-slate-200 bg-slate-50 p-6 sm:p-8">
                <h3 className="font-display text-2xl font-bold text-jcst-navy">What you will learn</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {outcomes.map((outcome) => (
                    <div key={outcome} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="mt-1 shrink-0 text-jcst-crimson" />
                      <p className="text-sm leading-7 text-slate-600">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_20px_52px_rgba(15,23,42,.08)] sm:p-8">
              <h3 className="font-display text-2xl font-bold text-jcst-navy">Course requirements</h3>
              <div className="mt-6 space-y-4">
                {requirements.map((requirement) => (
                  <div key={requirement} className="flex items-start gap-3">
                    <ShieldCheck size={18} className="mt-1 shrink-0 text-amber-600" />
                    <p className="text-sm leading-7 text-slate-600">{requirement}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <SectionTitle eyebrow="Course Curriculum" title="One free introduction. Every premium lesson clearly locked." />
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Lesson titles remain visible so you can evaluate the complete structure before purchase. Only the official introduction lesson can be opened without a paid enrollment.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {curriculum.map((section, sectionIndex) => {
                const open = openSection === sectionIndex;
                return (
                  <article key={section.title} className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => setOpenSection(open ? -1 : sectionIndex)}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                    >
                      <div>
                        <p className="font-display text-lg font-bold text-jcst-navy">{section.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{section.lessons.length} lessons</p>
                      </div>
                      <ChevronDown size={19} className={`shrink-0 text-jcst-crimson transition ${open ? 'rotate-180' : ''}`} />
                    </button>

                    {open ? (
                      <div className="border-t border-slate-100">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <button
                            key={`${lesson.title}-${lessonIndex}`}
                            type="button"
                            onClick={() => lesson.isPreview ? setPreviewLesson(lesson) : setLockedLesson(lesson)}
                            className="flex w-full items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 text-left last:border-b-0 sm:px-6"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${lesson.isPreview ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                {lesson.isPreview ? <PlayCircle size={17} /> : <LockKeyhole size={16} />}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-800">{lesson.title}</p>
                                <p className="mt-1 text-xs text-slate-500">{lesson.type} · {lesson.duration}</p>
                              </div>
                            </div>
                            <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${lesson.isPreview ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                              {lesson.isPreview ? 'Free Preview' : 'Locked'}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {instructor ? (
          <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_20px_52px_rgba(15,23,42,.08)] sm:p-9">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <span className="grid h-20 w-20 shrink-0 place-items-center rounded-[24px] bg-red-50 text-jcst-crimson"><UserRound size={31} /></span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.17em] text-jcst-crimson">Your Instructor</p>
                    <h2 className="mt-3 font-display text-3xl font-bold text-jcst-navy">{instructor.name}</h2>
                    <p className="mt-1 font-semibold text-slate-500">{instructor.title}</p>
                    <p className="mt-5 leading-8 text-slate-600">{instructor.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="relative isolate overflow-hidden py-16 text-white sm:py-20" style={{ background: 'var(--jcst-dark)' }}>
          <div className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(circle,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:30px_30px]" />
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <GraduationCap size={28} className="mx-auto text-amber-300" />
            <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">Unlock the complete course and begin learning with JCST.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">Payment must be verified before premium lessons, files, quizzes, assignments, exams, and certificates become available.</p>
            <Link to={purchaseLink} className="mt-8 inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl px-8 font-semibold text-white shadow-xl" style={{ background: 'var(--jcst-secondary)' }}>
              Enroll & Pay — {formatMoney(price, currency)}
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {lockedLesson ? (
        <LockedLessonModal lesson={lockedLesson} price={price} currency={currency} purchaseLink={purchaseLink} onClose={() => setLockedLesson(null)} />
      ) : null}

      {previewLesson ? (
        <PreviewModal lesson={previewLesson} course={course} onClose={() => setPreviewLesson(null)} />
      ) : null}
    </div>
  );
};

const PricingCard = ({
  course,
  price,
  originalPrice,
  currency,
  includes,
  purchaseLink,
  previewLesson,
  onPreview,
}: {
  course: WebsiteContentRecord;
  price: number;
  originalPrice: number;
  currency: string;
  includes: string[];
  purchaseLink: string;
  previewLesson?: LessonPreview | undefined;
  onPreview: () => void;
}) => (
  <aside className="rounded-[30px] border border-white/15 bg-white p-4 text-slate-900 shadow-[0_35px_90px_rgba(0,0,0,.35)] sm:p-5">
    <div className="relative h-56 overflow-hidden rounded-[22px] bg-slate-100">
      <SmartImage source={course.imageUrl} alt={course.title} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-slate-950/35" />
      <button type="button" onClick={onPreview} disabled={!previewLesson} className="absolute inset-0 m-auto grid h-16 w-16 place-items-center rounded-full border border-white/40 bg-white/90 text-jcst-crimson shadow-xl disabled:opacity-50">
        <PlayCircle size={30} />
      </button>
      <span className="absolute bottom-4 left-4 rounded-full bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">Watch introduction</span>
    </div>

    <div className="p-2 pt-6">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Course Fee</p>
      <div className="mt-2 flex items-baseline gap-3">
        <p className="font-display text-4xl font-bold text-jcst-crimson">{formatMoney(price, currency)}</p>
        {originalPrice > price ? <span className="text-sm text-slate-400 line-through">{formatMoney(originalPrice, currency)}</span> : null}
      </div>

      <Link to={purchaseLink} className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl font-semibold text-white" style={{ background: 'var(--jcst-secondary)' }}>
        Buy This Course
        <ArrowRight size={18} />
      </Link>

      <button type="button" onClick={onPreview} disabled={!previewLesson} className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 font-semibold text-slate-700 disabled:opacity-50">
        <PlayCircle size={17} /> Watch Free Introduction
      </button>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="font-bold text-jcst-navy">This course includes:</p>
        <div className="mt-4 space-y-3">
          {includes.map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm text-slate-600"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-green-600" /> {item}</div>
          ))}
        </div>
      </div>
    </div>
  </aside>
);

const LockedLessonModal = ({ lesson, price, currency, purchaseLink, onClose }: { lesson: LessonPreview; price: number; currency: string; purchaseLink: string; onClose: () => void }) => (
  <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-[28px] bg-white p-6 text-center shadow-2xl sm:p-8">
      <button type="button" onClick={onClose} className="ml-auto grid h-10 w-10 place-items-center rounded-xl bg-slate-100"><X size={18} /></button>
      <span className="mx-auto mt-2 grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-jcst-crimson"><LockKeyhole size={28} /></span>
      <h2 className="mt-5 font-display text-2xl font-bold text-jcst-navy">This lesson is locked</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600"><strong>{lesson.title}</strong> becomes available after your course payment is verified.</p>
      <Link to={purchaseLink} className="mt-6 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl font-semibold text-white" style={{ background: 'var(--jcst-secondary)' }}>
        Buy Course — {formatMoney(price, currency)}
        <ArrowRight size={17} />
      </Link>
    </div>
  </div>
);

const PreviewModal = ({ lesson, course, onClose }: { lesson: LessonPreview; course: WebsiteContentRecord; onClose: () => void }) => (
  <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm">
    <div className="w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <p className="text-xs font-semibold text-jcst-crimson">Free Introduction</p>
          <h2 className="mt-1 font-bold text-jcst-navy">{lesson.title}</h2>
        </div>
        <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100"><X size={18} /></button>
      </div>
      <div className="aspect-video bg-slate-950">
        {lesson.previewVideoUrl ? (
          <iframe src={lesson.previewVideoUrl} title={`${course.title} introduction`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <div className="grid h-full place-items-center px-6 text-center text-white">
            <div>
              <Video size={42} className="mx-auto text-amber-300" />
              <p className="mt-5 font-display text-2xl font-bold">Introduction video not uploaded yet</p>
              <p className="mt-3 text-sm text-slate-300">The lecturer or admin must add the official preview video URL in the course metadata.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const SectionTitle = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-jcst-crimson">{eyebrow}</p>
    <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-jcst-navy sm:text-4xl">{title}</h2>
  </div>
);

const SmartImage = ({ source, alt, className }: { source: string; alt: string; className: string }) => {
  const [failed, setFailed] = useState(false);
  if (!source || failed) return <div role="img" aria-label={alt} className={`${className} grid place-items-center bg-slate-200`}><ImageIcon size={26} className="text-slate-500" /></div>;
  return <img src={source} alt={alt} loading="lazy" className={className} onError={() => setFailed(true)} />;
};

const getString = (metadata: Record<string, unknown>, key: string) => typeof metadata[key] === 'string' ? metadata[key] as string : '';
const getNumber = (metadata: Record<string, unknown>, key: string) => typeof metadata[key] === 'number' ? metadata[key] as number : 0;
const getBoolean = (metadata: Record<string, unknown>, key: string) => metadata[key] === true;
const getStringArray = (metadata: Record<string, unknown>, key: string): string[] => Array.isArray(metadata[key]) ? (metadata[key] as unknown[]).filter((item): item is string => typeof item === 'string') : [];
const getObject = <T extends object>(metadata: Record<string, unknown>, key: string): T | undefined => {
  const value = metadata[key];
  return value && typeof value === 'object' && !Array.isArray(value) ? value as T : undefined;
};
const getObjectArray = <T extends object>(metadata: Record<string, unknown>, key: string): T[] => {
  const value = metadata[key];
  return Array.isArray(value) ? value.filter((item): item is T => Boolean(item) && typeof item === 'object' && !Array.isArray(item)) : [];
};
const formatMoney = (amount: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);