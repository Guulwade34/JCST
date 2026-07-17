import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  GraduationCap,
  IdCard,
  Mail,
  MessageCircle,
  Phone,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  UserRound,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PageError, PageLoading } from '@/components/common/PageState';
import { useWebsiteItem } from '@/features/website/useWebsiteContent';
import { usePublicWebsite } from '@/features/website/context/PublicWebsiteContext';
import { useAuthStore } from '@/store/authStore';

interface PaymentAccount {
  id: string;
  provider: string;
  accountNumber: string;
  accountName: string;
  instructions?: string;
  type?: 'mobile-money' | 'bank';
  enabled?: boolean;
}

interface EnrollmentFormState {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  learnerType: 'new-student' | 'existing-student';
  studentId: string;
  payerNumber: string;
  transactionReference: string;
  note: string;
  agreed: boolean;
}

const initialForm: EnrollmentFormState = {
  fullName: '',
  email: '',
  phone: '',
  whatsapp: '',
  learnerType: 'new-student',
  studentId: '',
  payerNumber: '',
  transactionReference: '',
  note: '',
  agreed: false,
};

export const CourseCheckoutPage = () => {
  const { slug = '' } = useParams();
  const courseQuery = useWebsiteItem('course', slug);
  const paymentPageQuery = useWebsiteItem('page', 'e-learning');
  const { text } = usePublicWebsite();
  const user = useAuthStore((state) => state.user);

  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [copiedAccountId, setCopiedAccountId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<EnrollmentFormState>(() => ({
    ...initialForm,
    fullName: user?.displayName ?? '',
    email: user?.email ?? '',
  }));

  const course = courseQuery.data;
  const courseMetadata = course?.metadata ?? {};
  const paymentMetadata = paymentPageQuery.data?.metadata ?? {};

  const paymentAccounts = useMemo(
    () =>
      getObjectArray<PaymentAccount>(
        paymentMetadata,
        'paymentAccounts',
      ).filter((account) => account.enabled !== false),
    [paymentMetadata],
  );

  const selectedAccount = useMemo(
    () =>
      paymentAccounts.find(
        (account) => account.id === selectedAccountId,
      ) ?? paymentAccounts[0],
    [paymentAccounts, selectedAccountId],
  );

  const price = getNumber(courseMetadata, 'price');
  const currency = getString(courseMetadata, 'currency') || 'USD';
  const supportWhatsapp = getString(
    paymentMetadata,
    'paymentSupportWhatsapp',
  );
  const supportEmail = getString(
    paymentMetadata,
    'paymentSupportEmail',
  );

  const orderReference = useMemo(() => {
    const code = getString(courseMetadata, 'code') || slug || 'COURSE';
    const datePart = new Date()
      .toISOString()
      .slice(0, 10)
      .replaceAll('-', '');

    return `JCST-${code.replace(/\s+/g, '').toUpperCase()}-${datePart}`;
  }, [courseMetadata, slug]);

  useEffect(() => {
    if (!selectedAccountId && paymentAccounts[0]) {
      setSelectedAccountId(paymentAccounts[0].id);
    }
  }, [paymentAccounts, selectedAccountId]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm((current) => ({
      ...current,
      fullName: current.fullName || user.displayName || '',
      email: current.email || user.email || '',
    }));
  }, [user]);

  if (courseQuery.isLoading) {
    return <PageLoading />;
  }

  if (courseQuery.isError || !course) {
    return <PageError message={text('global.errors.content-not-found')} />;
  }

  const accountConfigured = isConfiguredAccount(selectedAccount);

  const updateField = <K extends keyof EnrollmentFormState>(
    key: K,
    value: EnrollmentFormState[K],
  ) => {
    setSubmitted(false);
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const copyAccountNumber = async (account: PaymentAccount) => {
    if (!isConfiguredAccount(account)) {
      return;
    }

    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopiedAccountId(account.id);
      window.setTimeout(() => setCopiedAccountId(''), 1800);
    } catch {
      setCopiedAccountId('');
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAccount || !accountConfigured || !form.agreed) {
      return;
    }

    setSubmitted(true);

    window.requestAnimationFrame(() => {
      document
        .getElementById('payment-submission-result')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
    });
  };

  const confirmationMessage = buildConfirmationMessage({
    courseTitle: course.title,
    courseCode: getString(courseMetadata, 'code'),
    amount: formatMoney(price, currency),
    orderReference,
    paymentProvider: selectedAccount?.provider ?? '',
    paymentAccount: selectedAccount?.accountNumber ?? '',
    form,
  });

  const whatsappUrl = createWhatsappUrl(
    supportWhatsapp,
    confirmationMessage,
  );

  const emailUrl = supportEmail
    ? `mailto:${encodeURIComponent(
        supportEmail,
      )}?subject=${encodeURIComponent(
        `JCST Course Payment Confirmation — ${orderReference}`,
      )}&body=${encodeURIComponent(confirmationMessage)}`
    : '';

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to={`/e-learning/courses/${course.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-jcst-crimson"
        >
          <ArrowLeft size={17} />
          Back to Course
        </Link>

        <div className="mt-7 grid items-start gap-8 lg:grid-cols-[1fr_400px]">
          <main className="space-y-7">
            <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_52px_rgba(15,23,42,.08)] sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-jcst-crimson">
                    Course Enrollment
                  </p>
                  <h1 className="mt-4 font-display text-3xl font-bold text-jcst-navy sm:text-4xl">
                    Enter your student and payment details
                  </h1>
                  <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                    You do not need the admin login. Complete this public
                    enrollment form, send the exact course fee to an official
                    JCST payment account, then provide your transaction
                    reference for verification.
                  </p>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
                  <ShieldCheck size={15} />
                  Secure verification flow
                </span>
              </div>
            </section>

            <form
              onSubmit={handleSubmit}
              className="space-y-7"
            >
              <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_52px_rgba(15,23,42,.08)] sm:p-8">
                <StepHeading
                  number="01"
                  title="Student information"
                  description="The verified enrollment will be linked to these details."
                />

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    icon={<UserRound size={17} />}
                    required
                  >
                    <input
                      value={form.fullName}
                      onChange={(event) =>
                        updateField('fullName', event.target.value)
                      }
                      required
                      autoComplete="name"
                      placeholder="Enter your full name"
                      className={inputClassName}
                    />
                  </Field>

                  <Field
                    label="Email address"
                    icon={<Mail size={17} />}
                    required
                  >
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField('email', event.target.value)
                      }
                      required
                      autoComplete="email"
                      placeholder="student@example.com"
                      className={inputClassName}
                    />
                  </Field>

                  <Field
                    label="Phone number"
                    icon={<Phone size={17} />}
                    required
                  >
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField('phone', event.target.value)
                      }
                      required
                      autoComplete="tel"
                      placeholder="+252 6X XXX XXXX"
                      className={inputClassName}
                    />
                  </Field>

                  <Field
                    label="WhatsApp number"
                    icon={<MessageCircle size={17} />}
                  >
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(event) =>
                        updateField('whatsapp', event.target.value)
                      }
                      autoComplete="tel"
                      placeholder="Leave blank if same as phone"
                      className={inputClassName}
                    />
                  </Field>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-bold text-slate-800">
                    Student type
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <ChoiceCard
                      selected={form.learnerType === 'new-student'}
                      title="New student"
                      description="I need a JCST learning account after verification."
                      icon={<GraduationCap size={20} />}
                      onClick={() =>
                        updateField('learnerType', 'new-student')
                      }
                    />

                    <ChoiceCard
                      selected={form.learnerType === 'existing-student'}
                      title="Existing JCST student"
                      description="I already have a student record or learning account."
                      icon={<IdCard size={20} />}
                      onClick={() =>
                        updateField('learnerType', 'existing-student')
                      }
                    />
                  </div>
                </div>

                {form.learnerType === 'existing-student' ? (
                  <div className="mt-5">
                    <Field
                      label="Student ID"
                      icon={<IdCard size={17} />}
                      required
                    >
                      <input
                        value={form.studentId}
                        onChange={(event) =>
                          updateField('studentId', event.target.value)
                        }
                        required
                        placeholder="Enter your JCST student ID"
                        className={inputClassName}
                      />
                    </Field>
                  </div>
                ) : null}
              </section>

              <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_52px_rgba(15,23,42,.08)] sm:p-8">
                <StepHeading
                  number="02"
                  title="Choose where to send the payment"
                  description={`Send exactly ${formatMoney(
                    price,
                    currency,
                  )} to one official JCST account below.`}
                />

                {paymentAccounts.length ? (
                  <div className="mt-7 grid gap-4">
                    {paymentAccounts.map((account) => {
                      const configured = isConfiguredAccount(account);
                      const selected =
                        selectedAccount?.id === account.id;

                      return (
                        <button
                          key={account.id}
                          type="button"
                          onClick={() =>
                            setSelectedAccountId(account.id)
                          }
                          className={`rounded-[22px] border p-5 text-left transition ${
                            selected
                              ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-100'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <span
                              className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                                selected
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {account.type === 'bank' ? (
                                <Building2 size={21} />
                              ) : (
                                <Smartphone size={21} />
                              )}
                            </span>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="font-bold text-jcst-navy">
                                    {account.provider}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    {account.accountName}
                                  </p>
                                </div>

                                {configured ? (
                                  <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold text-green-700">
                                    Available
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold text-red-700">
                                    Admin setup required
                                  </span>
                                )}
                              </div>

                              <p className="mt-4 break-all font-display text-xl font-bold text-jcst-crimson sm:text-2xl">
                                {configured
                                  ? account.accountNumber
                                  : 'Official number not configured'}
                              </p>

                              {account.instructions ? (
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                  {account.instructions}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-7 rounded-[22px] border border-red-200 bg-red-50 p-5">
                    <p className="font-bold text-red-900">
                      Official payment numbers are not configured
                    </p>
                    <p className="mt-2 text-sm leading-6 text-red-700">
                      Add the official JCST EVC Plus, ZAAD, Sahal, or bank
                      account details to the E-Learning page metadata before
                      accepting payments.
                    </p>
                  </div>
                )}

                {selectedAccount ? (
                  <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                          Send the course fee to
                        </p>
                        <p
                          className="mt-2 font-display text-2xl font-bold"
                          style={{ color: 'var(--jcst-primary)' }}
                        >
                          {selectedAccount.provider}
                        </p>
                        <p className="mt-2 break-all text-xl font-bold text-jcst-crimson">
                          {accountConfigured
                            ? selectedAccount.accountNumber
                            : 'Not configured'}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Account name: {selectedAccount.accountName}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={!accountConfigured}
                        onClick={() =>
                          copyAccountNumber(selectedAccount)
                        }
                        className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {copiedAccountId === selectedAccount.id ? (
                          <>
                            <Check size={17} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={17} />
                            Copy Number
                          </>
                        )}
                      </button>
                    </div>

                    <div className="mt-5 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
                      <SummaryTile
                        label="Exact amount"
                        value={formatMoney(price, currency)}
                      />
                      <SummaryTile
                        label="Order reference"
                        value={orderReference}
                      />
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_52px_rgba(15,23,42,.08)] sm:p-8">
                <StepHeading
                  number="03"
                  title="Enter payment confirmation details"
                  description="Complete these fields after sending the payment."
                />

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Number used to pay"
                    icon={<Smartphone size={17} />}
                    required
                  >
                    <input
                      type="tel"
                      value={form.payerNumber}
                      onChange={(event) =>
                        updateField('payerNumber', event.target.value)
                      }
                      required
                      placeholder="+252 6X XXX XXXX"
                      className={inputClassName}
                    />
                  </Field>

                  <Field
                    label="Transaction reference"
                    icon={<ReceiptText size={17} />}
                    required
                  >
                    <input
                      value={form.transactionReference}
                      onChange={(event) =>
                        updateField(
                          'transactionReference',
                          event.target.value,
                        )
                      }
                      required
                      placeholder="Enter transaction ID/reference"
                      className={inputClassName}
                    />
                  </Field>
                </div>

                <div className="mt-5">
                  <Field
                    label="Additional note"
                    icon={<CreditCard size={17} />}
                  >
                    <textarea
                      value={form.note}
                      onChange={(event) =>
                        updateField('note', event.target.value)
                      }
                      rows={4}
                      placeholder="Optional payment or enrollment note"
                      className={`${inputClassName} min-h-[110px] resize-y py-3`}
                    />
                  </Field>
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-[18px] border border-slate-200 bg-slate-50 p-4">
                  <input
                    type="checkbox"
                    checked={form.agreed}
                    onChange={(event) =>
                      updateField('agreed', event.target.checked)
                    }
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-jcst-crimson"
                  />
                  <span className="text-sm leading-6 text-slate-600">
                    I confirm that the information is correct and understand
                    that course access is unlocked only after JCST verifies
                    the payment.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!accountConfigured || !form.agreed}
                  className="mt-7 inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl px-6 font-semibold text-white shadow-xl transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none"
                  style={
                    accountConfigured && form.agreed
                      ? { background: 'var(--jcst-secondary)' }
                      : undefined
                  }
                >
                  Submit Enrollment & Payment Details
                  <ArrowRight size={18} />
                </button>

                {!accountConfigured ? (
                  <p className="mt-3 text-center text-xs font-semibold text-red-600">
                    Submission remains disabled until an official payment
                    number is configured.
                  </p>
                ) : null}
              </section>
            </form>

            {submitted ? (
              <section
                id="payment-submission-result"
                className="rounded-[30px] border border-green-200 bg-green-50 p-6 shadow-[0_20px_52px_rgba(15,23,42,.08)] sm:p-8"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-green-100 text-green-700">
                  <CheckCircle2 size={25} />
                </span>

                <h2 className="mt-5 font-display text-3xl font-bold text-green-950">
                  Payment details are ready for verification
                </h2>

                <p className="mt-4 leading-7 text-green-900">
                  Review the information below and send it to the official
                  JCST payment support channel. Course access remains locked
                  until the finance team verifies the transaction.
                </p>

                <div className="mt-6 grid gap-3 rounded-[22px] border border-green-200 bg-white/80 p-5 text-sm sm:grid-cols-2">
                  <SummaryRow
                    label="Student"
                    value={form.fullName}
                  />
                  <SummaryRow
                    label="Course"
                    value={course.title}
                  />
                  <SummaryRow
                    label="Paid through"
                    value={selectedAccount?.provider ?? ''}
                  />
                  <SummaryRow
                    label="Transaction"
                    value={form.transactionReference}
                  />
                  <SummaryRow
                    label="Amount"
                    value={formatMoney(price, currency)}
                  />
                  <SummaryRow
                    label="Reference"
                    value={orderReference}
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 font-semibold text-white transition hover:bg-green-700"
                    >
                      <MessageCircle size={18} />
                      Send Confirmation on WhatsApp
                    </a>
                  ) : null}

                  {emailUrl ? (
                    <a
                      href={emailUrl}
                      className="inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-xl border border-green-300 bg-white px-5 font-semibold text-green-800 transition hover:bg-green-100"
                    >
                      <Mail size={18} />
                      Send by Email
                    </a>
                  ) : null}
                </div>

                {!whatsappUrl && !emailUrl ? (
                  <p className="mt-5 rounded-xl bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-900">
                    Payment-support WhatsApp and email are not configured yet.
                    Save the transaction reference and contact the JCST finance
                    office directly.
                  </p>
                ) : null}
              </section>
            ) : null}
          </main>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_52px_rgba(15,23,42,.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-jcst-crimson">
                Order Summary
              </p>

              <h2 className="mt-4 font-display text-2xl font-bold text-jcst-navy">
                {course.title}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {getString(courseMetadata, 'code')}
              </p>

              <div className="mt-6 space-y-3 border-y border-slate-100 py-5 text-sm">
                <SummaryRow
                  label="Course fee"
                  value={formatMoney(price, currency)}
                />
                <SummaryRow
                  label="Processing fee"
                  value={formatMoney(0, currency)}
                />
                <SummaryRow
                  label="Discount"
                  value={formatMoney(0, currency)}
                />
              </div>

              <div className="mt-5 flex items-end justify-between gap-4">
                <span className="font-bold text-slate-700">
                  Total
                </span>
                <span className="font-display text-3xl font-bold text-jcst-crimson">
                  {formatMoney(price, currency)}
                </span>
              </div>

              <div className="mt-7 space-y-3 rounded-[20px] bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <BadgeCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-green-600"
                  />
                  <span>
                    One introduction lesson remains available before payment.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-green-600"
                  />
                  <span>
                    Full lessons unlock only after verified payment.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-700"
                  />
                  <span>
                    Never send money to a number that is not displayed as an
                    official JCST account.
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-[18px] border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-800">
                  Important
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-900">
                  This form prepares the verification request. Permanent
                  database storage and automatic enrollment require the
                  payment backend module.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const StepHeading = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-4">
    <span
      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-bold text-white"
      style={{ background: 'var(--jcst-primary)' }}
    >
      {number}
    </span>

    <div>
      <h2
        className="font-display text-2xl font-bold"
        style={{ color: 'var(--jcst-primary)' }}
      >
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  </div>
);

const Field = ({
  label,
  icon,
  required = false,
  children,
}: {
  label: string;
  icon: ReactNode;
  required?: boolean;
  children: ReactNode;
}) => (
  <label className="block">
    <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
      <span style={{ color: 'var(--jcst-secondary)' }}>
        {icon}
      </span>
      {label}
      {required ? (
        <span className="text-jcst-crimson">*</span>
      ) : null}
    </span>
    <span className="mt-2 block">{children}</span>
  </label>
);

const ChoiceCard = ({
  selected,
  title,
  description,
  icon,
  onClick,
}: {
  selected: boolean;
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-start gap-4 rounded-[20px] border p-5 text-left transition ${
      selected
        ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-100'
        : 'border-slate-200 bg-white hover:border-slate-300'
    }`}
  >
    <span
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
        selected
          ? 'bg-amber-100 text-amber-700'
          : 'bg-slate-100 text-slate-600'
      }`}
    >
      {icon}
    </span>
    <span>
      <span className="block font-bold text-jcst-navy">
        {title}
      </span>
      <span className="mt-1 block text-sm leading-6 text-slate-600">
        {description}
      </span>
    </span>
  </button>
);

const SummaryTile = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
      {label}
    </p>
    <p className="mt-2 break-all text-sm font-bold text-slate-800">
      {value}
    </p>
  </div>
);

const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-slate-500">{label}</span>
    <span className="max-w-[62%] break-words text-right font-semibold text-slate-800">
      {value}
    </span>
  </div>
);

const inputClassName =
  'min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100';

const isConfiguredValue = (value: string): boolean => {
  const normalized = value.trim();

  return Boolean(normalized) &&
    !/(ENTER_|REPLACE_|ADD_|XXX|NOT_CONFIGURED)/i.test(normalized);
};

const isConfiguredAccount = (
  account: PaymentAccount | undefined,
): account is PaymentAccount => {
  if (!account) {
    return false;
  }

  return isConfiguredValue(account.accountNumber);
};

const createWhatsappUrl = (
  number: string,
  message: string,
): string => {
  if (!isConfiguredValue(number)) {
    return '';
  }

  const cleanNumber = number.replace(/\D/g, '');

  return cleanNumber
    ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
    : '';
};

const buildConfirmationMessage = ({
  courseTitle,
  courseCode,
  amount,
  orderReference,
  paymentProvider,
  paymentAccount,
  form,
}: {
  courseTitle: string;
  courseCode: string;
  amount: string;
  orderReference: string;
  paymentProvider: string;
  paymentAccount: string;
  form: EnrollmentFormState;
}): string =>
  [
    'JCST COURSE PAYMENT CONFIRMATION',
    '',
    `Student: ${form.fullName}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    `WhatsApp: ${form.whatsapp || form.phone}`,
    `Student type: ${
      form.learnerType === 'existing-student'
        ? 'Existing JCST student'
        : 'New student'
    }`,
    form.studentId ? `Student ID: ${form.studentId}` : '',
    '',
    `Course: ${courseTitle}`,
    courseCode ? `Course code: ${courseCode}` : '',
    `Amount: ${amount}`,
    `Payment provider: ${paymentProvider}`,
    `Payment account: ${paymentAccount}`,
    `Number used to pay: ${form.payerNumber}`,
    `Transaction reference: ${form.transactionReference}`,
    `Order reference: ${orderReference}`,
    form.note ? `Note: ${form.note}` : '',
  ]
    .filter(Boolean)
    .join('\n');

const getString = (
  metadata: Record<string, unknown>,
  key: string,
): string =>
  typeof metadata[key] === 'string'
    ? (metadata[key] as string)
    : '';

const getNumber = (
  metadata: Record<string, unknown>,
  key: string,
): number =>
  typeof metadata[key] === 'number'
    ? (metadata[key] as number)
    : 0;

const getObjectArray = <T extends object>(
  metadata: Record<string, unknown>,
  key: string,
): T[] => {
  const value = metadata[key];

  return Array.isArray(value)
    ? value.filter(
        (item): item is T =>
          Boolean(item) &&
          typeof item === 'object' &&
          !Array.isArray(item),
      )
    : [];
};

const formatMoney = (
  amount: number,
  currency: string,
): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);