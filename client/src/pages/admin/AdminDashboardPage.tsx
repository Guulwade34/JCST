import { useQueries } from '@tanstack/react-query';
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  FileText,
  Globe2,
  Megaphone,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { websiteApi } from '@/features/website/websiteApi';

const types = ['program', 'department', 'course', 'lecturer', 'announcement', 'page'] as const;

export const AdminDashboardPage = () => {
  const queries = useQueries({
    queries: types.map((type) => ({
      queryKey: ['admin-count', type],
      queryFn: () => websiteApi.adminList(type),
    })),
  });

  const cards = [
    { label: 'Programs', count: queries[0]?.data?.length ?? 0, icon: BookOpen, to: '/admin/content/program' },
    { label: 'Departments', count: queries[1]?.data?.length ?? 0, icon: Building2, to: '/admin/content/department' },
    { label: 'Courses', count: queries[2]?.data?.length ?? 0, icon: FileText, to: '/admin/content/course' },
    { label: 'Lecturers', count: queries[3]?.data?.length ?? 0, icon: Users, to: '/admin/content/lecturer' },
    { label: 'Announcements', count: queries[4]?.data?.length ?? 0, icon: Megaphone, to: '/admin/content/announcement' },
    { label: 'Public Pages', count: queries[5]?.data?.length ?? 0, icon: Globe2, to: '/admin/content/page' },
  ];

  return (
    <div>
      <section className="relative overflow-hidden rounded-[30px] bg-[#071a33] p-7 text-white shadow-xl sm:p-9">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#a80f24]/25 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold text-amber-300">
            <CheckCircle2 size={15} /> Database-driven website management
          </div>
          <h2 className="mt-5 font-display text-3xl font-bold sm:text-5xl">Professional JCST content control</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            Manage the public website from one organized administration area. Each content category has its own page, and published changes are loaded from MongoDB.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/admin/content/section" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#a80f24] px-5 font-semibold text-white">
              Manage Homepage <ArrowRight size={17} />
            </Link>
            <Link to="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 font-semibold text-white">
              View Public Website <Globe2 size={17} />
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, count, icon: Icon, to }) => (
          <Link key={label} to={to} className="group rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-[#a80f24]">
                <Icon size={21} />
              </span>
              <ArrowRight size={18} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#a80f24]" />
            </div>
            <p className="mt-5 text-3xl font-bold text-[#071a33]">{count}</p>
            <p className="mt-1 font-semibold text-slate-600">{label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-7 rounded-[26px] border border-slate-200 bg-white p-6 sm:p-8">
        <h3 className="font-display text-2xl font-bold text-[#071a33]">Recommended publishing workflow</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ['01', 'Edit content', 'Open the correct content category and update text, images, links or metadata.'],
            ['02', 'Review status', 'Keep unfinished content as draft and publish only approved information.'],
            ['03', 'Verify publicly', 'Open the public website and confirm links, phone numbers, email and images.'],
          ].map(([number, title, description]) => (
            <article key={number} className="rounded-2xl bg-slate-50 p-5">
              <span className="text-xs font-bold tracking-[0.16em] text-[#a80f24]">STEP {number}</span>
              <h4 className="mt-3 font-bold text-[#071a33]">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
