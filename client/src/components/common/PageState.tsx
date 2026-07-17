import { AlertCircle, LoaderCircle } from 'lucide-react';

export const PageLoading = () => (
  <div className="mx-auto flex min-h-[420px] max-w-7xl items-center justify-center px-4">
    <LoaderCircle className="animate-spin text-jcst-crimson" size={36} aria-label="Loading" />
  </div>
);
export const PageError = ({ message }: { message: string }) => (
  <div className="mx-auto my-16 flex max-w-3xl items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
    <AlertCircle className="shrink-0" />
    <p>{message}</p>
  </div>
);
export const EmptyState = ({ message }: { message: string }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
    {message}
  </div>
);
