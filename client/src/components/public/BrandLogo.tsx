


import { GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const LOGO_SOURCES = [
  '/branding/jcst-logo.png',
  '/branding/jcst-logo.webp',
  '/branding/jcst-logo.jpg',
] as const;

export const BrandLogo = ({
  variant = 'default',
  compact = false,
  shortName = 'JCST',
  fullName = 'Jubbaland College of Science & Technology',
  showFullNameOnMobile = false,
}: {
  variant?: 'default' | 'inverse';
  compact?: boolean;
  shortName?: string;
  fullName?: string;
  showFullNameOnMobile?: boolean;
}) => {
  const [sourceIndex, setSourceIndex] = useState(0);
  const logoSource = LOGO_SOURCES[sourceIndex];
  const logoAvailable = sourceIndex < LOGO_SOURCES.length;
  const inverse = variant === 'inverse';

  const handleImageError = () => {
    setSourceIndex((current) => current + 1);
  };

  return (
    <Link
      to="/"
      className="group flex min-w-0 items-center gap-3"
      aria-label="Go to the JCST public homepage"
    >
      <span
        className={`relative grid shrink-0 place-items-center overflow-hidden rounded-2xl border shadow-lg transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl ${
          compact ? 'h-12 w-12' : 'h-14 w-14 lg:h-16 lg:w-16'
        } ${
          inverse
            ? 'border-white/15 bg-white/10 shadow-black/20'
            : 'border-slate-200 bg-white shadow-slate-900/10'
        }`}
      >
        <span className="absolute inset-x-2 top-0 h-px bg-[linear-gradient(90deg,transparent,#D4AF37,transparent)]" />

        {logoAvailable && logoSource ? (
          <img
            src={logoSource}
            alt="Official JCST logo"
            className="h-full w-full object-contain p-1.5"
            onError={handleImageError}
          />
        ) : (
          <span className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,#B5121B,#8F0E16)] text-white">
            <GraduationCap size={compact ? 24 : 30} aria-hidden="true" />
          </span>
        )}
      </span>

      <span className="min-w-0">
        <span
          className={`block truncate font-display font-bold tracking-wide ${
            compact ? 'text-lg' : 'text-xl lg:text-[1.35rem]'
          } ${inverse ? 'text-white' : 'text-jcst-crimson'}`}
        >
          {shortName}
        </span>

        {!compact ? (
          <span
            className={`text-[0.58rem] font-semibold uppercase tracking-[0.1em] lg:text-[0.65rem] ${
              showFullNameOnMobile
                ? 'block whitespace-normal leading-4'
                : 'hidden truncate sm:block'
            } ${inverse ? 'text-slate-300' : 'text-slate-600'}`}
          >
            {fullName}
          </span>
        ) : null}
      </span>
    </Link>
  );
};