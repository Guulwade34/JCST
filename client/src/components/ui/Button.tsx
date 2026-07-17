import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

const variants = {
  primary:
    'bg-jcst-crimson text-white hover:bg-red-800 focus-visible:outline-jcst-crimson disabled:bg-slate-400',
  secondary:
    'border border-jcst-gold bg-white text-jcst-charcoal hover:bg-amber-50 focus-visible:outline-jcst-gold',
  ghost: 'bg-transparent text-jcst-charcoal hover:bg-slate-100 focus-visible:outline-jcst-crimson',
};

export const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) => (
  <button
    className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-2 disabled:cursor-not-allowed ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    {...props}
  >
    {children}
  </button>
);
