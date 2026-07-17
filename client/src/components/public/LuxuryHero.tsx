import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Wifi,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { WebsiteContentRecord } from '@jcst/shared';
import {
  useWebsiteCollection,
  useWebsiteItem,
} from '@/features/website/useWebsiteContent';

const FALLBACK_IMAGES = {
  campus:
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1800&q=90',
  students:
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=90',
  technology:
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=90',
} as const;

export const LuxuryHero = () => {
  const home = useWebsiteItem('page', 'home');
  const statistics = useWebsiteCollection('statistic');
  const facilities = useWebsiteCollection('facility');
  const programs = useWebsiteCollection('program');

  const featuredFacilities = (facilities.data ?? [])
    .filter((item) => item.featured)
    .slice(0, 2);

  const featuredPrograms = (programs.data ?? [])
    .filter((item) => item.featured)
    .slice(0, 1);

  const topStatistics = (statistics.data ?? []).slice(0, 3);

  if (home.isLoading) {
    return <LuxuryHeroSkeleton />;
  }

  const homeContent = home.data;

  const title = splitHeroTitle(
    homeContent?.title ?? 'Empowering Minds. Building Futures.',
  );

  const mainImage = resolveImage(homeContent, FALLBACK_IMAGES.campus);
  const studentImage = resolveImage(
    featuredFacilities[0],
    FALLBACK_IMAGES.students,
  );
  const technologyImage = resolveImage(
    featuredPrograms[0],
    FALLBACK_IMAGES.technology,
  );

  return (
    <>
      <HeroStyles />

      <section className="relative isolate overflow-hidden bg-[#07111f] text-white">
        <div className="absolute inset-0 -z-50 bg-[linear-gradient(135deg,#06101d_0%,#091427_42%,#131428_68%,#2a0f1c_100%)]" />

        <div className="absolute inset-0 -z-40 opacity-[0.2] [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="absolute -left-40 top-20 -z-30 h-[420px] w-[420px] rounded-full bg-jcst-gold/10 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 -z-30 h-[460px] w-[460px] rounded-full bg-jcst-crimson/20 blur-[130px]" />

        <div className="mx-auto grid min-h-[820px] max-w-[1450px] items-center gap-16 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,.9fr)_minmax(560px,1.05fr)] lg:px-8 lg:py-20">
          <div className="jcst-hero-fade-up relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-jcst-gold/40 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-jcst-gold backdrop-blur-xl">
                <Sparkles size={15} />
                {getMetadataText(homeContent, 'eyebrow', 'Welcome to JCST')}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-2 text-xs font-semibold text-emerald-300 backdrop-blur-xl">
                <BadgeCheck size={14} />
                Quality Higher Education
              </span>
            </div>

            <h1 className="mt-8 max-w-3xl font-display text-5xl font-bold leading-[1.02] text-white sm:text-6xl lg:text-[72px]">
              {title.first}
              <span className="mt-2 block bg-[linear-gradient(90deg,#D4AF37_0%,#FFF1A8_45%,#D4AF37_100%)] bg-clip-text text-transparent">
                {title.second}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              {homeContent?.excerpt ||
                'Quality Education, Modern Learning, and Technology for a Better Tomorrow.'}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/programs"
                className="jcst-button-shine group relative inline-flex min-h-[54px] items-center justify-center gap-3 overflow-hidden rounded-2xl bg-jcst-crimson px-7 font-semibold text-white shadow-[0_18px_45px_rgba(181,18,27,.28)] transition duration-300 hover:-translate-y-1 hover:bg-red-700"
              >
                <GraduationCap size={18} />
                Explore Programs
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/apply"
                className="group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-2xl border border-jcst-gold/70 bg-white/[0.05] px-7 font-semibold text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.1]"
              >
                Apply for Admission
                <ChevronRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <HeroPill
                icon={ShieldCheck}
                text="Secure Student Services"
              />
              <HeroPill
                icon={Wifi}
                text="Modern E-Learning"
              />
              <HeroPill
                icon={BriefcaseBusiness}
                text="Career-Focused Education"
              />
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              <HeroStat
                icon={Users}
                value={topStatistics[0]?.excerpt || '1,200+'}
                label={topStatistics[0]?.title || 'Active Students'}
              />
              <HeroStat
                icon={BookOpenCheck}
                value={topStatistics[1]?.excerpt || '12+'}
                label={topStatistics[1]?.title || 'Academic Programs'}
              />
              <HeroStat
                icon={GraduationCap}
                value={topStatistics[2]?.excerpt || '45+'}
                label={topStatistics[2]?.title || 'Qualified Lecturers'}
              />
            </div>
          </div>

          <div className="jcst-hero-fade-right relative mx-auto w-full max-w-[760px]">
            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_35px_90px_rgba(0,0,0,.3)] backdrop-blur-xl">
              <div className="grid gap-4 lg:grid-cols-[1.12fr_.88fr]">
                <LargeHeroCard
                  image={mainImage}
                  fallback={FALLBACK_IMAGES.campus}
                  eyebrow="JCST Campus"
                  title="Modern Learning Environment"
                  description="A premium academic environment designed for knowledge, creativity, and professional growth."
                />

                <div className="grid gap-4">
                  <SmallHeroCard
                    image={studentImage}
                    fallback={FALLBACK_IMAGES.students}
                    eyebrow="Expert Guidance"
                    title="Guided by Excellence"
                    description="Professional lecturers, mentors, and a supportive academic community."
                  />

                  <SmallHeroCard
                    image={technologyImage}
                    fallback={FALLBACK_IMAGES.technology}
                    eyebrow="Future Ready"
                    title="Innovation-Driven Learning"
                    description="Technology, practical skills, and career-focused education."
                  />
                </div>
              </div>

              <div className="mt-4 rounded-[26px] border border-white/10 bg-[#08111f]/90 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-jcst-gold">
                      Complete Student Lifecycle
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      One connected academic journey from admission to graduation
                    </p>
                  </div>

                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-jcst-crimson text-white shadow-lg shadow-jcst-crimson/25">
                    <GraduationCap size={18} />
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <JourneyCard
                    number="01"
                    icon={Users}
                    title="Admission"
                    text="Begin your journey"
                  />
                  <JourneyCard
                    number="02"
                    icon={BookOpenCheck}
                    title="Learning"
                    text="Build your knowledge"
                  />
                  <JourneyCard
                    number="03"
                    icon={BadgeCheck}
                    title="Assessment"
                    text="Measure your progress"
                  />
                  <JourneyCard
                    number="04"
                    icon={Trophy}
                    title="Graduation"
                    text="Achieve your future"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.07] bg-white/[0.03]">
          <div className="jcst-marquee flex min-w-max items-center gap-12 py-4">
            <MarqueeItem
              icon={GraduationCap}
              text="Academic Excellence"
            />
            <MarqueeItem
              icon={BookOpenCheck}
              text="Professional Programs"
            />
            <MarqueeItem
              icon={ShieldCheck}
              text="Trusted Student Services"
            />
            <MarqueeItem
              icon={Wifi}
              text="Modern E-Learning"
            />
            <MarqueeItem
              icon={BriefcaseBusiness}
              text="Career Readiness"
            />
            <MarqueeItem
              icon={GraduationCap}
              text="Academic Excellence"
            />
            <MarqueeItem
              icon={BookOpenCheck}
              text="Professional Programs"
            />
            <MarqueeItem
              icon={ShieldCheck}
              text="Trusted Student Services"
            />
            <MarqueeItem
              icon={Wifi}
              text="Modern E-Learning"
            />
            <MarqueeItem
              icon={BriefcaseBusiness}
              text="Career Readiness"
            />
          </div>
        </div>
      </section>
    </>
  );
};

const SmartImage = ({
  source,
  fallback,
  alt,
  className,
  priority = false,
}: {
  source: string;
  fallback: string;
  alt: string;
  className: string;
  priority?: boolean;
}) => {
  const [currentSource, setCurrentSource] = useState(source || fallback);

  useEffect(() => {
    setCurrentSource(source || fallback);
  }, [source, fallback]);

  return (
    <img
      src={currentSource}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
      onError={() => {
        if (currentSource !== fallback) {
          setCurrentSource(fallback);
        }
      }}
    />
  );
};

const LargeHeroCard = ({
  image,
  fallback,
  eyebrow,
  title,
  description,
}: {
  image: string;
  fallback: string;
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <article className="group relative min-h-[520px] overflow-hidden rounded-[30px] border border-white/12 bg-slate-900">
    <SmartImage
      source={image}
      fallback={fallback}
      alt={title}
      priority
      className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105"
    />

    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,10,18,.96)_0%,rgba(7,17,31,.45)_50%,rgba(7,17,31,.1)_100%)]" />
    <div className="absolute inset-4 rounded-[24px] border border-white/12" />

    <div className="absolute left-6 right-6 top-6 flex items-start justify-between gap-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#091425]/90 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-jcst-gold text-jcst-charcoal">
          <BadgeCheck size={16} />
        </span>
        <span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-jcst-gold">
            JCST Standard
          </span>
          <span className="block text-sm font-bold">
            Academic Excellence
          </span>
        </span>
      </div>
    </div>

    <div className="absolute inset-x-0 bottom-0 p-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-jcst-gold">
        {eyebrow}
      </p>

      <h2 className="mt-2 max-w-sm font-display text-[2rem] font-bold leading-tight text-white">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-slate-200">
        {description}
      </p>
    </div>
  </article>
);

const SmallHeroCard = ({
  image,
  fallback,
  eyebrow,
  title,
  description,
}: {
  image: string;
  fallback: string;
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <article className="group relative min-h-[252px] overflow-hidden rounded-[28px] border border-white/12 bg-slate-900">
    <SmartImage
      source={image}
      fallback={fallback}
      alt={title}
      className="absolute inset-0 h-full w-full object-cover transition duration-[1000ms] group-hover:scale-105"
    />

    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,10,18,.94)_0%,rgba(7,17,31,.4)_55%,rgba(7,17,31,.08)_100%)]" />
    <div className="absolute inset-4 rounded-[22px] border border-white/10" />

    <div className="absolute inset-x-0 bottom-0 p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-jcst-gold">
        {eyebrow}
      </p>

      <h3 className="mt-2 font-display text-[1.65rem] font-bold leading-tight text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-200">
        {description}
      </p>
    </div>
  </article>
);

const HeroPill = ({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-slate-300 backdrop-blur transition hover:border-jcst-gold/30 hover:text-white">
    <Icon
      size={14}
      className="text-jcst-gold"
    />
    {text}
  </span>
);

const HeroStat = ({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) => (
  <div className="group rounded-[22px] border border-white/12 bg-white/[0.06] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-jcst-gold/40 hover:bg-white/[0.09]">
    <div className="flex items-center justify-between">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.08] text-jcst-gold transition group-hover:bg-jcst-gold group-hover:text-jcst-charcoal">
        <Icon size={18} />
      </span>

      <Sparkles
        size={14}
        className="text-white/20 transition group-hover:text-jcst-gold"
      />
    </div>

    <p className="mt-4 font-display text-3xl font-bold text-white">
      {value}
    </p>

    <p className="mt-1 text-sm text-slate-300">
      {label}
    </p>
  </div>
);

const JourneyCard = ({
  number,
  icon: Icon,
  title,
  text,
}: {
  number: string;
  icon: LucideIcon;
  title: string;
  text: string;
}) => (
  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-4 transition duration-300 hover:border-jcst-gold/30 hover:bg-white/[0.08]">
    <div className="flex items-center justify-between">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.08] text-jcst-gold">
        <Icon size={17} />
      </span>

      <span className="text-[10px] font-bold text-white/25">
        {number}
      </span>
    </div>

    <p className="mt-4 text-sm font-bold text-white">
      {title}
    </p>

    <p className="mt-1 text-xs text-slate-400">
      {text}
    </p>
  </div>
);

const MarqueeItem = ({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) => (
  <div className="flex shrink-0 items-center gap-3 whitespace-nowrap">
    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.07] text-jcst-gold">
      <Icon size={16} />
    </span>

    <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">
      {text}
    </span>

    <Sparkles
      size={12}
      className="text-jcst-gold"
    />
  </div>
);

const splitHeroTitle = (title: string) => {
  const parts = title
    .split('.')
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    first: parts[0] ? `${parts[0]}.` : 'Empowering Minds.',
    second: parts[1] ? `${parts[1]}.` : 'Building Futures.',
  };
};

const resolveImage = (
  item: WebsiteContentRecord | undefined,
  fallback: string,
) => item?.imageUrl?.trim() || fallback;

const getMetadataText = (
  item: WebsiteContentRecord | undefined,
  key: string,
  fallback: string,
) => {
  const value = item?.metadata[key];

  return typeof value === 'string' && value.trim()
    ? value
    : fallback;
};

const LuxuryHeroSkeleton = () => (
  <section className="min-h-[760px] animate-pulse bg-[#07111f]">
    <div className="mx-auto grid max-w-[1450px] gap-16 px-4 py-20 lg:grid-cols-2">
      <div>
        <div className="h-10 w-56 rounded-full bg-white/10" />
        <div className="mt-8 h-44 max-w-xl rounded-3xl bg-white/10" />
        <div className="mt-7 h-20 max-w-xl rounded-2xl bg-white/10" />
        <div className="mt-8 h-14 max-w-md rounded-2xl bg-white/10" />
      </div>

      <div className="min-h-[580px] rounded-[36px] bg-white/10" />
    </div>
  </section>
);

const HeroStyles = () => (
  <style>{`
    @keyframes jcstFadeUp {
      from {
        opacity: 0;
        transform: translateY(28px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes jcstFadeRight {
      from {
        opacity: 0;
        transform: translateX(32px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes jcstHeroMarquee {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-50%);
      }
    }

    .jcst-hero-fade-up {
      animation: jcstFadeUp 800ms ease-out both;
    }

    .jcst-hero-fade-right {
      animation: jcstFadeRight 900ms ease-out both;
    }

    .jcst-marquee {
      animation: jcstHeroMarquee 34s linear infinite;
    }

    .jcst-button-shine::after {
      content: '';
      position: absolute;
      top: -80%;
      left: -45%;
      width: 28%;
      height: 260%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255,255,255,.34),
        transparent
      );
      transform: rotate(22deg);
      transition: left 700ms ease;
    }

    .jcst-button-shine:hover::after {
      left: 125%;
    }

    @media (prefers-reduced-motion: reduce) {
      .jcst-hero-fade-up,
      .jcst-hero-fade-right,
      .jcst-marquee {
        animation: none !important;
      }
    }
  `}</style>
);