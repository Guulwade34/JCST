import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Archive,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  Pencil,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useParams } from 'react-router-dom';
import {
  WEBSITE_CONTENT_TYPES,
  type WebsiteContentRecord,
  type WebsiteContentType,
} from '@jcst/shared';
import { websiteApi } from '@/features/website/websiteApi';

interface FormValues {
  type: WebsiteContentType;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  icon: string;
  order: number;
  featured: boolean;
  published: boolean;
  metadataText: string;
}

const labels: Record<WebsiteContentType, { title: string; description: string; singular: string }> = {
  setting: { title: 'Site Settings', description: 'Manage the logo, contact details, brand colours and institutional identity.', singular: 'setting' },
  navigation: { title: 'Public Navigation', description: 'Manage header menu labels, links, dropdowns, order and visibility.', singular: 'navigation menu' },
  footer: { title: 'Public Footer', description: 'Manage footer text, quick links, legal links, social media and newsletter settings.', singular: 'footer' },
  copy: { title: 'Reusable Website Text', description: 'Manage small labels, button text, messages and reusable public wording.', singular: 'text item' },
  page: { title: 'Public Pages', description: 'Manage page headings, introductions, SEO information, images and page content.', singular: 'page' },
  section: { title: 'Homepage Sections', description: 'Manage homepage sections, ordering, visibility, headings, images and calls to action.', singular: 'section' },
  department: { title: 'Departments', description: 'Manage department profiles, heads, contacts, images, programs and facilities.', singular: 'department' },
  program: { title: 'Academic Programs', description: 'Manage programs, fees, duration, coordinators, requirements and outcomes.', singular: 'program' },
  course: { title: 'Courses & E-Learning', description: 'Manage course details, fees, instructors, previews, lessons and access information.', singular: 'course' },
  lecturer: { title: 'Lecturers', description: 'Manage lecturer profiles, qualifications, contacts, departments and profile photos.', singular: 'lecturer' },
  announcement: { title: 'Announcements', description: 'Publish and update public college notices and important announcements.', singular: 'announcement' },
  faq: { title: 'Frequently Asked Questions', description: 'Manage public questions and answers displayed across the website.', singular: 'FAQ' },
  facility: { title: 'Facilities', description: 'Manage college facility descriptions, images, locations and availability.', singular: 'facility' },
  testimonial: { title: 'Testimonials', description: 'Manage student and alumni experiences displayed on the public website.', singular: 'testimonial' },
  statistic: { title: 'Website Statistics', description: 'Manage headline numbers and institutional achievements shown publicly.', singular: 'statistic' },
};

const defaults = (type: WebsiteContentType): FormValues => ({
  type,
  slug: '',
  title: '',
  excerpt: '',
  body: '',
  imageUrl: '',
  icon: '',
  order: 0,
  featured: false,
  published: true,
  metadataText: '{}',
});

export const WebsiteCmsPage = () => {
  const params = useParams();
  const routeType = params['type'] as WebsiteContentType | undefined;
  const type = routeType && WEBSITE_CONTENT_TYPES.includes(routeType) ? routeType : undefined;
  const [editing, setEditing] = useState<WebsiteContentRecord | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({ defaultValues: defaults(type ?? 'page') });
  const watchedImage = form.watch('imageUrl');

  const query = useQuery({
    queryKey: ['admin-website', type],
    queryFn: () => websiteApi.adminList(type),
    enabled: Boolean(type),
  });

  const filtered = useMemo(() => {
    const items = query.data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      [item.title, item.slug, item.excerpt, item.body].join(' ').toLowerCase().includes(term),
    );
  }, [query.data, search]);

  if (!type) return <Navigate to="/admin/content/page" replace />;
  const pageLabel = labels[type];

  const close = () => {
    setOpen(false);
    setEditing(null);
    setShowAdvanced(false);
    form.reset(defaults(type));
  };

  const save = useMutation({
    mutationFn: async (values: FormValues) => {
      let metadata: Record<string, unknown>;
      try {
        metadata = JSON.parse(values.metadataText) as Record<string, unknown>;
      } catch {
        throw new Error('Advanced metadata must be valid JSON.');
      }
      const payload = {
        type,
        slug: values.slug.trim(),
        title: values.title.trim(),
        excerpt: values.excerpt.trim(),
        body: values.body.trim(),
        imageUrl: values.imageUrl.trim(),
        icon: values.icon.trim(),
        order: Number(values.order),
        featured: values.featured,
        published: values.published,
        metadata,
      };
      return editing ? websiteApi.update(editing.id, payload) : websiteApi.create(payload);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-website'] }),
        queryClient.invalidateQueries({ queryKey: ['website'] }),
      ]);
      close();
    },
    onError: (error) => {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Unable to save this content.',
      });
    },
  });

  const archive = useMutation({
    mutationFn: websiteApi.archive,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-website', type] }),
        queryClient.invalidateQueries({ queryKey: ['website'] }),
      ]);
    },
  });

  const create = () => {
    form.reset(defaults(type));
    setEditing(null);
    setShowAdvanced(false);
    setOpen(true);
  };

  const edit = (item: WebsiteContentRecord) => {
    setEditing(item);
    setShowAdvanced(false);
    form.reset({
      type,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      body: item.body,
      imageUrl: item.imageUrl,
      icon: item.icon,
      order: item.order,
      featured: item.featured,
      published: item.published,
      metadataText: JSON.stringify(item.metadata, null, 2),
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a80f24]">Website Content</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#071a33] sm:text-4xl">{pageLabel.title}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">{pageLabel.description}</p>
          </div>
          <button
            type="button"
            onClick={create}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#a80f24] px-5 font-semibold text-white shadow-lg shadow-red-950/15 transition hover:-translate-y-0.5"
          >
            <Plus size={18} /> Add {pageLabel.singular}
          </button>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-sm">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${pageLabel.title.toLowerCase()}...`}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
            />
          </label>
          <div className="flex gap-3 text-sm">
            <span className="rounded-full bg-slate-100 px-4 py-2 font-semibold text-slate-600">{filtered.length} records</span>
            <span className="rounded-full bg-emerald-50 px-4 py-2 font-semibold text-emerald-700">
              {filtered.filter((item) => item.published).length} published
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {filtered.map((item) => (
          <article key={item.id} className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-40 bg-slate-100">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#eef2f7,#dbe3ec)] text-slate-400">
                  <ImageIcon size={34} />
                </div>
              )}
              <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold ${item.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                {item.published ? 'Published' : 'Draft'}
              </span>
              {item.featured ? (
                <span className="absolute right-4 top-4 rounded-full bg-[#071a33] px-3 py-1.5 text-xs font-bold text-white">Featured</span>
              ) : null}
            </div>
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#a80f24]">/{item.slug}</p>
              <h3 className="mt-2 line-clamp-2 font-display text-xl font-bold text-[#071a33]">{item.title}</h3>
              <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">{item.excerpt || item.body || 'No public description added yet.'}</p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-slate-400">Order {item.order}</span>
                <div className="flex gap-2">
                  <a
                    href={publicUrl(item)}
                    target="_blank"
                    rel="noreferrer"
                    title="Preview public content"
                    className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <Eye size={17} />
                  </a>
                  <button type="button" onClick={() => edit(item)} className="grid h-10 w-10 place-items-center rounded-xl bg-[#071a33] text-white" title="Edit">
                    <Pencil size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Archive “${item.title}”?`)) archive.mutate(item.id);
                    }}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-red-200 bg-red-50 text-red-700"
                    title="Archive"
                  >
                    <Archive size={17} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!query.isLoading && !filtered.length ? (
        <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center">
          <ImageIcon className="mx-auto text-slate-300" size={36} />
          <h3 className="mt-4 font-display text-2xl font-bold text-[#071a33]">No content found</h3>
          <p className="mt-2 text-slate-500">Create the first {pageLabel.singular} or change your search.</p>
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/65 p-3 sm:p-6">
          <form
            onSubmit={form.handleSubmit((values) => save.mutate(values))}
            className="mx-auto my-3 max-w-4xl overflow-hidden rounded-[30px] bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a80f24]">{editing ? 'Update record' : 'New record'}</p>
                <h3 className="mt-1 font-display text-2xl font-bold text-[#071a33]">{editing ? `Edit ${pageLabel.singular}` : `Add ${pageLabel.singular}`}</h3>
              </div>
              <button type="button" onClick={close} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600"><X size={18} /></button>
            </div>

            <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[1fr_280px]">
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Title" required>
                    <input className="input" {...form.register('title', { required: 'Title is required' })} />
                  </Field>
                  <Field label="Slug" required hint="Lowercase words separated by hyphens.">
                    <input className="input" {...form.register('slug', { required: 'Slug is required', pattern: { value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: 'Use lowercase letters, numbers and hyphens only.' } })} />
                  </Field>
                </div>
                <Field label="Short public description">
                  <textarea className="input min-h-28 py-3" {...form.register('excerpt')} />
                </Field>
                <Field label="Main public content">
                  <textarea className="input min-h-44 py-3" {...form.register('body')} />
                </Field>
                <Field label="Image URL" hint="Use an uploaded media URL or a secure HTTPS image URL.">
                  <input className="input" placeholder="https://..." {...form.register('imageUrl')} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Icon key">
                    <input className="input" placeholder="book, users, building..." {...form.register('icon')} />
                  </Field>
                  <Field label="Display order">
                    <input type="number" className="input" {...form.register('order', { valueAsNumber: true })} />
                  </Field>
                </div>
                <button type="button" onClick={() => setShowAdvanced((value) => !value)} className="w-fit text-sm font-bold text-[#a80f24]">
                  {showAdvanced ? 'Hide advanced fields' : 'Show advanced fields'}
                </button>
                {showAdvanced ? (
                  <Field label="Advanced metadata (JSON)" hint="Used for page-specific fields such as contact details, prices, links, lessons and feature lists.">
                    <textarea className="input min-h-72 font-mono text-xs" {...form.register('metadataText')} />
                  </Field>
                ) : null}
              </div>

              <aside>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="grid h-44 place-items-center bg-slate-100">
                    {watchedImage ? <img src={watchedImage} alt="Preview" className="h-full w-full object-cover" /> : <ImageIcon className="text-slate-300" size={34} />}
                  </div>
                  <div className="p-4 text-sm text-slate-600">Image preview</div>
                </div>
                <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 p-4">
                  <label className="flex items-center justify-between gap-4 text-sm font-semibold text-slate-700">
                    Published
                    <input type="checkbox" className="h-5 w-5 rounded" {...form.register('published')} />
                  </label>
                  <label className="flex items-center justify-between gap-4 text-sm font-semibold text-slate-700">
                    Featured
                    <input type="checkbox" className="h-5 w-5 rounded" {...form.register('featured')} />
                  </label>
                </div>
                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                  Published changes appear on the public website after saving.
                </div>
              </aside>
            </div>

            {form.formState.errors.root?.message ? (
              <p className="mx-6 mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 sm:mx-8">{form.formState.errors.root.message}</p>
            ) : null}
            {form.formState.errors.slug?.message ? (
              <p className="mx-6 mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 sm:mx-8">{form.formState.errors.slug.message}</p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
              <button type="button" onClick={close} className="min-h-12 rounded-xl border border-slate-200 bg-white px-5 font-semibold text-slate-700">Cancel</button>
              <button type="submit" disabled={save.isPending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#a80f24] px-6 font-semibold text-white disabled:opacity-60">
                <CheckCircle2 size={18} /> {save.isPending ? 'Saving...' : 'Save & Publish Changes'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

const Field = ({ label, hint, required = false, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) => (
  <label className="grid gap-2 text-sm font-bold text-slate-800">
    <span>{label}{required ? <span className="text-[#a80f24]"> *</span> : null}</span>
    {children}
    {hint ? <span className="text-xs font-normal leading-5 text-slate-500">{hint}</span> : null}
  </label>
);

const publicUrl = (item: WebsiteContentRecord): string => {
  if (item.type === 'page') return item.slug === 'home' ? '/' : `/${item.slug}`;
  if (item.type === 'program') return `/programs/${item.slug}`;
  if (item.type === 'course') return `/courses/${item.slug}`;
  if (item.type === 'department') return `/departments/${item.slug}`;
  if (item.type === 'lecturer') return `/lecturers/${item.slug}`;
  if (item.type === 'announcement') return '/announcements';
  return '/';
};
