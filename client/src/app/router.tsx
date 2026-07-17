import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { HomePage } from '@/pages/public/HomePage';
import { AboutPage } from '@/pages/public/AboutPage';
import { AcademicsPage } from '@/pages/public/AcademicsPage';
import { DepartmentsPage } from '@/pages/public/DepartmentsPage';
import { DepartmentDetailPage } from '@/pages/public/DepartmentDetailPage';
import { ProgramsPage } from '@/pages/public/ProgramsPage';
import { ProgramDetailPage } from '@/pages/public/ProgramDetailPage';
import { CoursesPage } from '@/pages/public/CoursesPage';
import { CourseDetailPage } from '@/pages/public/CourseDetailPage';
import { AdmissionsPage } from '@/pages/public/AdmissionsPage';
import { ApplyPage } from '@/pages/public/ApplyPage';
import { ApplicationStatusPage } from '@/pages/public/ApplicationStatusPage';
import { ELearningPage } from '@/pages/public/ELearningPage';
import { ELearningCourseDetailPage } from '@/pages/public/ELearningCourseDetailPage';
import { CourseCheckoutPage } from '@/pages/public/CourseCheckoutPage';
import { LecturersPage } from '@/pages/public/LecturersPage';
import { LecturerDetailPage } from '@/pages/public/LecturerDetailPage';
import { AnnouncementsPage } from '@/pages/public/AnnouncementsPage';
import { FaqPage } from '@/pages/public/FaqPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { RegisterPage } from '@/pages/public/RegisterPage';
import { ForgotPasswordPage } from '@/pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/public/ResetPasswordPage';
import { VerifyEmailPage } from '@/pages/public/VerifyEmailPage';
import { PrivacyPolicyPage } from '@/pages/public/PrivacyPolicyPage';
import { TermsPage } from '@/pages/public/TermsPage';
import { CertificateVerificationPage } from '@/pages/public/CertificateVerificationPage';
import { TranscriptVerificationPage } from '@/pages/public/TranscriptVerificationPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { WebsiteCmsPage } from '@/pages/admin/WebsiteCmsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PublicRouteErrorPage } from '@/pages/PublicRouteErrorPage';
import { PublicWebsiteProvider } from '@/features/website/context/PublicWebsiteContext';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <PublicRouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'academics', element: <AcademicsPage /> },
      { path: 'departments', element: <DepartmentsPage /> },
      { path: 'departments/:slug', element: <DepartmentDetailPage /> },
      { path: 'programs', element: <ProgramsPage /> },
      { path: 'programs/:slug', element: <ProgramDetailPage /> },
      { path: 'courses', element: <CoursesPage /> },
      { path: 'courses/:slug', element: <CourseDetailPage /> },
      { path: 'admissions', element: <AdmissionsPage /> },
      { path: 'apply', element: <ApplyPage /> },
      { path: 'application-status', element: <ApplicationStatusPage /> },
      { path: 'e-learning', element: <ELearningPage /> },
      { path: 'e-learning/courses/:slug', element: <ELearningCourseDetailPage /> },
      { path: 'checkout/course/:slug', element: <CourseCheckoutPage /> },
      { path: 'lecturers', element: <LecturersPage /> },
      { path: 'lecturers/:slug', element: <LecturerDetailPage /> },
      { path: 'announcements', element: <AnnouncementsPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'terms-and-conditions', element: <TermsPage /> },
      { path: 'certificate-verification', element: <CertificateVerificationPage /> },
      { path: 'transcript-verification', element: <TranscriptVerificationPage /> },
    ],
  },
  {
    path: '/login',
    element: (
      <PublicWebsiteProvider>
        <LoginPage />
      </PublicWebsiteProvider>
    ),
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'website', element: <Navigate to="/admin/content/page" replace /> },
      { path: 'content/:type', element: <WebsiteCmsPage /> },
    ],
  },
  {
    path: '*',
    element: (
      <PublicWebsiteProvider>
        <NotFoundPage />
      </PublicWebsiteProvider>
    ),
  },
]);