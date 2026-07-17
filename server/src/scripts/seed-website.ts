/* eslint-disable */
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { logger } from '../config/logger.js';
import { WebsiteContentModel } from '../modules/website/website-content.model.js';

const records = [
  {
    type: 'page',
    slug: 'home',
    title: 'Empowering Minds. Building Futures.',
    excerpt: 'Quality Education, Modern Learning, and Technology for a Better Tomorrow.',
    body: 'JCST equips learners with academic knowledge, practical skills, ethical leadership, and technology-driven solutions for Jubbaland and beyond.',
    order: 1,
    featured: true,
    metadata: {
      eyebrow: 'Welcome to JCST',
      primaryAction: 'Explore Programs',
      secondaryAction: 'Apply for Admission',
    },
  },
  {
    type: 'page',
    slug: 'academics',
    title: 'Academic Excellence at JCST',
    excerpt:
      'Programmes built around strong curricula, practical learning, continuous assessment, and career readiness.',
    body: 'JCST academic delivery combines lectures, laboratories, projects, independent learning, internships, advising, and transparent assessment. Curriculum versions, prerequisites, credit hours, progression rules, and graduation requirements are managed consistently.',
    order: 3,
  },
  {
    type: 'page',
    slug: 'admissions',
    title: 'Join JCST',
    excerpt: 'Begin a clear, secure, and student-friendly admission journey.',
    body: 'Applicants select a programme and intake, submit their academic information, receive a reference number, and track the progress of their application online.',
    order: 4,
    metadata: {
      requirements: [
        'Completed application form',
        'Previous academic certificate',
        'Academic transcript or result slip',
        'Identity document',
        'Recent passport-size photograph',
      ],
      intakes: ['January', 'May', 'September'],
    },
  },
  {
    type: 'page',
    slug: 'e-learning',
    title: 'Learning Without Limits',
    excerpt:
      'A modern digital learning environment supporting lessons, resources, assignments, assessments, and progress tracking.',
    body: 'JCST e-learning connects students and lecturers through structured course spaces. Students can access lessons and files, submit assignments, participate in discussions, and monitor progress.',
    order: 5,
  },
  {
    type: 'page',
    slug: 'contact',
    title: 'Contact JCST',
    excerpt: 'Our team is ready to assist applicants, students, parents, lecturers, and partners.',
    body: 'Use the contact form for admissions, academics, finance, e-learning, or general enquiries.',
    order: 6,
  },
  {
    type: 'page',
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    excerpt: 'How JCST handles personal and academic information.',
    body: 'JCST collects information required to provide admissions, academic, financial, library, communication, and support services. Access is restricted by role and permission. Critical records are retained according to institutional policy. Users may contact the college regarding correction of inaccurate information.',
    order: 7,
  },
  {
    type: 'page',
    slug: 'terms-and-conditions',
    title: 'Terms and Conditions',
    excerpt: 'Rules governing use of JCST digital services.',
    body: 'Users must provide accurate information, protect their credentials, use the platform lawfully, respect academic integrity, and avoid unauthorized access. JCST may suspend access when security, disciplinary, or policy concerns require investigation.',
    order: 8,
  },
  {
    type: 'department',
    slug: 'computer-science',
    title: 'Department of Computer Science',
    excerpt: 'Software, information systems, networking, databases, and digital innovation.',
    body: 'The department prepares students to design, build, secure, and manage modern computing solutions.',
    order: 1,
    featured: true,
    metadata: { head: 'Head of Department', email: 'computing@jcst.edu.so' },
  },
  {
    type: 'department',
    slug: 'business-management',
    title: 'Department of Business and Management',
    excerpt:
      'Entrepreneurship, accounting, management, leadership, and organizational development.',
    body: 'The department develops ethical, analytical, and entrepreneurial professionals for private, public, and community organizations.',
    order: 2,
    featured: true,
  },
  {
    type: 'department',
    slug: 'health-sciences',
    title: 'Department of Health Sciences',
    excerpt:
      'Community health, healthcare support, public health awareness, and evidence-based practice.',
    body: 'The department advances practical health knowledge and responsible service to communities.',
    order: 3,
    featured: true,
  },
  {
    type: 'program',
    slug: 'bachelor-information-technology',
    title: 'Bachelor of Information Technology',
    excerpt:
      'A four-year degree in software, systems, networks, databases, cybersecurity, and IT management.',
    body: 'Students develop strong technical and professional capabilities through coursework, laboratories, projects, and internship experience.',
    order: 1,
    featured: true,
    metadata: {
      code: 'BIT',
      department: 'computer-science',
      qualification: 'Bachelor Degree',
      duration: '4 years',
      semesters: 8,
      studyModes: ['Regular', 'Weekend'],
      requiredCredits: 120,
    },
  },
  {
    type: 'program',
    slug: 'diploma-computer-science',
    title: 'Diploma in Computer Science',
    excerpt:
      'A practical programme focused on programming, databases, web technologies, and computer systems.',
    body: 'Graduates are prepared for entry-level technology roles and further academic progression.',
    order: 2,
    featured: true,
    metadata: {
      code: 'DCS',
      department: 'computer-science',
      qualification: 'Diploma',
      duration: '2 years',
      semesters: 4,
      studyModes: ['Regular', 'Weekend'],
      requiredCredits: 60,
    },
  },
  {
    type: 'program',
    slug: 'bachelor-business-administration',
    title: 'Bachelor of Business Administration',
    excerpt:
      'Management, finance, marketing, entrepreneurship, strategy, and organizational leadership.',
    body: 'The programme develops business professionals who can lead and grow resilient organizations.',
    order: 3,
    featured: true,
    metadata: {
      code: 'BBA',
      department: 'business-management',
      qualification: 'Bachelor Degree',
      duration: '4 years',
      semesters: 8,
      studyModes: ['Regular', 'Weekend'],
      requiredCredits: 120,
    },
  },
  {
    type: 'program',
    slug: 'diploma-public-health',
    title: 'Diploma in Public Health',
    excerpt:
      'Community health promotion, disease prevention, health education, and basic epidemiology.',
    body: 'Students gain practical skills to support healthier communities and public-health programmes.',
    order: 4,
    featured: true,
    metadata: {
      code: 'DPH',
      department: 'health-sciences',
      qualification: 'Diploma',
      duration: '2 years',
      semesters: 4,
      studyModes: ['Regular'],
      requiredCredits: 64,
    },
  },
  {
    type: 'course',
    slug: 'introduction-to-programming',
    title: 'Introduction to Programming',
    excerpt:
      'Problem solving, algorithms, variables, control flow, functions, and structured programming.',
    body: 'A foundational course for computing students.',
    order: 1,
    metadata: {
      code: 'CSC101',
      credits: 3,
      department: 'computer-science',
      level: 'Year 1',
      semester: 'Semester 1',
    },
  },
  {
    type: 'course',
    slug: 'database-systems',
    title: 'Database Systems',
    excerpt:
      'Relational modelling, SQL, normalization, transactions, security, and database applications.',
    body: 'Students design and implement reliable data-driven systems.',
    order: 2,
    metadata: {
      code: 'CSC204',
      credits: 3,
      department: 'computer-science',
      level: 'Year 2',
      semester: 'Semester 1',
    },
  },
  {
    type: 'course',
    slug: 'principles-of-management',
    title: 'Principles of Management',
    excerpt: 'Planning, organizing, leadership, decision-making, and organizational control.',
    body: 'A core foundation for business and management learners.',
    order: 3,
    metadata: {
      code: 'BUS101',
      credits: 3,
      department: 'business-management',
      level: 'Year 1',
      semester: 'Semester 1',
    },
  },
  {
    type: 'lecturer',
    slug: 'dr-aamina-hassan',
    title: 'Dr. Aamina Hassan',
    excerpt: 'Senior Lecturer in Information Systems',
    body: 'Dr. Aamina teaches information systems, databases, research methods, and digital transformation.',
    order: 1,
    featured: true,
    metadata: {
      qualification: 'PhD Information Systems',
      department: 'computer-science',
      specialization: 'Information Systems and Data Management',
    },
  },
  {
    type: 'lecturer',
    slug: 'mohamed-abdi',
    title: 'Mohamed Abdi',
    excerpt: 'Lecturer in Business Administration',
    body: 'Mohamed teaches entrepreneurship, strategic management, and organizational behaviour.',
    order: 2,
    featured: true,
    metadata: {
      qualification: 'MBA',
      department: 'business-management',
      specialization: 'Strategy and Entrepreneurship',
    },
  },
  {
    type: 'lecturer',
    slug: 'sahra-ali',
    title: 'Sahra Ali',
    excerpt: 'Lecturer in Public Health',
    body: 'Sahra teaches community health, health promotion, and public-health programme planning.',
    order: 3,
    featured: true,
    metadata: {
      qualification: 'MPH',
      department: 'health-sciences',
      specialization: 'Community Health',
    },
  },
  {
    type: 'announcement',
    slug: 'september-intake-applications',
    title: 'September Intake Applications Open',
    excerpt: 'Applications are open for selected diploma and bachelor programmes.',
    body: 'Prospective students can review programmes, requirements, and submit an online application through the Apply page.',
    order: 1,
    featured: true,
    metadata: { priority: 'Important', audience: 'Public', publishedDate: '2026-07-11' },
  },
  {
    type: 'announcement',
    slug: 'student-portal-guidance',
    title: 'Student Portal Account Guidance',
    excerpt: 'Students should protect their passwords and use only official JCST login pages.',
    body: 'Never share your account password. Contact IT Support when you suspect unauthorized access.',
    order: 2,
    metadata: { priority: 'Normal', audience: 'Students', publishedDate: '2026-07-11' },
  },
  {
    type: 'faq',
    slug: 'how-do-i-apply',
    title: 'How do I apply to JCST?',
    excerpt:
      'Open the Apply page, complete all required fields, submit the form, and keep your application reference number.',
    body: 'Use the Application Status page with your email and reference number to check progress.',
    order: 1,
  },
  {
    type: 'faq',
    slug: 'which-intakes-are-available',
    title: 'Which intakes are available?',
    excerpt: 'JCST can configure January, May, September, and other approved intakes.',
    body: 'Available intakes depend on the selected programme and academic calendar.',
    order: 2,
  },
  {
    type: 'faq',
    slug: 'does-jcst-support-e-learning',
    title: 'Does JCST support e-learning?',
    excerpt:
      'Yes. JCST provides structured course spaces, digital learning resources, assignments, assessments, and progress tracking.',
    body: 'Access depends on course registration and account permissions.',
    order: 3,
  },
  {
    type: 'facility',
    slug: 'computer-laboratory',
    title: 'Computer Laboratory',
    excerpt:
      'A practical environment for programming, networking, databases, and digital-skills training.',
    body: 'Laboratory schedules and capacity are managed to support effective learning.',
    order: 1,
    featured: true,
  },
  {
    type: 'facility',
    slug: 'college-library',
    title: 'College Library',
    excerpt: 'Academic books, references, study space, borrowing services, and learning support.',
    body: 'The library supports independent study and responsible use of academic resources.',
    order: 2,
    featured: true,
  },
  {
    type: 'facility',
    slug: 'lecture-rooms',
    title: 'Modern Lecture Rooms',
    excerpt: 'Comfortable teaching spaces designed for interactive higher-education delivery.',
    body: 'Rooms are assigned through conflict-aware academic timetables.',
    order: 3,
    featured: true,
  },
  {
    type: 'testimonial',
    slug: 'student-abdirahman',
    title: 'Abdirahman — IT Student',
    excerpt: 'JCST combines clear teaching with practical tasks that build confidence.',
    body: 'The programme has helped me connect programming concepts to real projects and career goals.',
    order: 1,
    featured: true,
  },
  {
    type: 'testimonial',
    slug: 'student-hodan',
    title: 'Hodan — Business Student',
    excerpt: 'The lecturers encourage participation, teamwork, and professional thinking.',
    body: 'I value the academic support and the focus on skills that employers and entrepreneurs need.',
    order: 2,
    featured: true,
  },
  {
    type: 'statistic',
    slug: 'students',
    title: 'Active Students',
    excerpt: '1,200+',
    body: 'Learners across JCST programmes.',
    order: 1,
    featured: true,
  },
  {
    type: 'statistic',
    slug: 'programs',
    title: 'Academic Programs',
    excerpt: '12+',
    body: 'Diploma and degree pathways.',
    order: 2,
    featured: true,
  },
  {
    type: 'statistic',
    slug: 'lecturers',
    title: 'Qualified Lecturers',
    excerpt: '45+',
    body: 'Academic and professional educators.',
    order: 3,
    featured: true,
  },
  {
    type: 'statistic',
    slug: 'graduate-employability',
    title: 'Career-Focused Learning',
    excerpt: '100%',
    body: 'Programmes designed around practical outcomes.',
    order: 4,
    featured: true,
  },
  {
    type: 'setting',
    slug: 'contact-information',
    title: 'Contact Information',
    excerpt: 'Official JCST contact details.',
    body: '',
    order: 1,
    metadata: {
      phone: '+252 61 0000000',
      email: 'info@jcst.edu.so',
      admissionsEmail: 'admissions@jcst.edu.so',
      address: 'Belet-Hawa, Gedo Region, Jubbaland State, Somalia',
      officeHours: 'Saturday–Thursday, 8:00 AM–4:00 PM',
    },
  },
  {
    type: 'setting',
    slug: 'social-links',
    title: 'Social Media Links',
    excerpt: 'Official channels.',
    body: '',
    order: 2,
    metadata: { facebook: '', linkedin: '', youtube: '', x: '' },
  },

  {
    type: 'setting',
    slug: 'site',
    title: 'Global Site Settings',
    excerpt: 'Brand, contact, and institutional settings used across all public pages.',
    order: 0,
    metadata: {
      institutionName: 'Jubbaland College of Science and Technology',
      shortName: 'JCST',
      motto: 'Empowering Minds, Building the Future.',
      establishedText: 'Established in 2025',
      logoUrl: '/branding/jcst-logo.png',
      logoAlt: 'Official Jubbaland College of Science and Technology logo',
      faviconUrl: '/branding/jcst-logo.png',
      address: 'Belet-Hawa, Gedo Region, Jubbaland State, Somalia',
      phone: '+252 61 0000000',
      email: 'info@jcst.edu.so',
      admissionsEmail: 'admissions@jcst.edu.so',
      officeHours: 'Saturday–Thursday, 8:00 AM–4:00 PM',
      primaryColor: '#082F63',
      secondaryColor: '#9B111E',
      accentColor: '#C58B14',
      darkColor: '#061A35',
      copyrightText: '© {year} Jubbaland College of Science and Technology. All rights reserved.',
    },
  },
  {
    type: 'navigation',
    slug: 'public-header',
    title: 'Public Header Navigation',
    excerpt: 'Editable navigation displayed on the public website.',
    order: 1,
    metadata: {
      items: [
        { id: 'home', label: 'Home', to: '/', enabled: true, order: 1 },
        { id: 'about', label: 'About', to: '/about', enabled: true, order: 2 },
        {
          id: 'academics',
          label: 'Academics',
          to: '/academics',
          enabled: true,
          order: 3,
          children: [
            { id: 'programs', label: 'Programs', to: '/programs', enabled: true, order: 1 },
            { id: 'courses', label: 'Courses', to: '/courses', enabled: true, order: 2 },
            {
              id: 'departments',
              label: 'Departments',
              to: '/departments',
              enabled: true,
              order: 3,
            },
          ],
        },
        { id: 'admissions', label: 'Admissions', to: '/admissions', enabled: true, order: 4 },
        { id: 'e-learning', label: 'E-Learning', to: '/e-learning', enabled: true, order: 5 },
        { id: 'lecturers', label: 'Lecturers', to: '/lecturers', enabled: true, order: 6 },
        {
          id: 'announcements',
          label: 'Announcements',
          to: '/announcements',
          enabled: true,
          order: 7,
        },
        { id: 'contact', label: 'Contact', to: '/contact', enabled: true, order: 8 },
      ],
    },
  },
  {
    type: 'footer',
    slug: 'public-footer',
    title: 'Public Footer',
    excerpt: 'Editable public website footer.',
    body: 'A higher education institution providing quality, affordable, competency-based, and career-oriented education through academic learning, practical training, innovation, and community engagement.',
    order: 1,
    metadata: {
      newsletterEnabled: true,
      columns: [
        {
          title: 'Quick Links',
          order: 1,
          enabled: true,
          links: [
            { label: 'Home', to: '/', enabled: true },
            { label: 'About JCST', to: '/about', enabled: true },
            { label: 'Admissions', to: '/admissions', enabled: true },
            { label: 'Contact Us', to: '/contact', enabled: true },
            { label: 'Announcements', to: '/announcements', enabled: true },
          ],
        },
        {
          title: 'Academics',
          order: 2,
          enabled: true,
          links: [
            { label: 'Programs', to: '/programs', enabled: true },
            { label: 'Courses', to: '/courses', enabled: true },
            { label: 'Departments', to: '/departments', enabled: true },
            { label: 'Lecturers', to: '/lecturers', enabled: true },
            { label: 'E-Learning', to: '/e-learning', enabled: true },
          ],
        },
        {
          title: 'Student Services',
          order: 3,
          enabled: true,
          links: [
            { label: 'Student Login', to: '/login', enabled: true },
            { label: 'Apply Online', to: '/apply', enabled: true },
            { label: 'Application Status', to: '/application-status', enabled: true },
            { label: 'Certificate Verification', to: '/certificate-verification', enabled: true },
            { label: 'Transcript Verification', to: '/transcript-verification', enabled: true },
          ],
        },
      ],
      legalLinks: [
        { label: 'Privacy Policy', to: '/privacy-policy', enabled: true },
        { label: 'Terms and Conditions', to: '/terms-and-conditions', enabled: true },
        { label: 'FAQ', to: '/faq', enabled: true },
      ],
      socialLinks: [],
    },
  },

  {
    type: 'copy',
    slug: 'global-logo-home-aria',
    title: 'Logo home link aria label',
    body: 'Go to the JCST public homepage',
    metadata: { key: 'global.logo.home-aria', group: 'Header' },
  },
  {
    type: 'copy',
    slug: 'global-header-topbar',
    title: 'Header top information bar',
    body: 'Quality, affordable, and career-oriented higher education in Belet-Hawa, Somalia',
    metadata: { key: 'global.header.topbar', group: 'Header' },
  },
  {
    type: 'copy',
    slug: 'global-header-primary-navigation-aria',
    title: 'Primary navigation aria label',
    body: 'Primary navigation',
    metadata: { key: 'global.header.primary-navigation-aria', group: 'Header' },
  },
  {
    type: 'copy',
    slug: 'global-header-dashboard',
    title: 'Dashboard label',
    body: 'Dashboard',
    metadata: { key: 'global.header.dashboard', group: 'Header' },
  },
  {
    type: 'copy',
    slug: 'global-header-sign-out-aria',
    title: 'Sign out aria label',
    body: 'Sign out',
    metadata: { key: 'global.header.sign-out-aria', group: 'Header' },
  },
  {
    type: 'copy',
    slug: 'global-header-login-url',
    title: 'Login URL',
    body: '/login',
    metadata: { key: 'global.header.login-url', group: 'Header' },
  },
  {
    type: 'copy',
    slug: 'global-header-login-label',
    title: 'Login button label',
    body: 'Login',
    metadata: { key: 'global.header.login-label', group: 'Header' },
  },
  {
    type: 'copy',
    slug: 'global-header-apply-url',
    title: 'Apply URL',
    body: '/apply',
    metadata: { key: 'global.header.apply-url', group: 'Header' },
  },
  {
    type: 'copy',
    slug: 'global-header-apply-label',
    title: 'Apply button label',
    body: 'Apply Now',
    metadata: { key: 'global.header.apply-label', group: 'Header' },
  },
  {
    type: 'copy',
    slug: 'global-header-open-menu-aria',
    title: 'Open menu aria label',
    body: 'Open menu',
    metadata: { key: 'global.header.open-menu-aria', group: 'Header' },
  },
  {
    type: 'copy',
    slug: 'global-header-close-menu-aria',
    title: 'Close menu aria label',
    body: 'Close menu',
    metadata: { key: 'global.header.close-menu-aria', group: 'Header' },
  },
  {
    type: 'copy',
    slug: 'global-page-hero-eyebrow',
    title: 'Public page hero eyebrow',
    body: 'Jubbaland College of Science and Technology',
    metadata: { key: 'global.page-hero.eyebrow', group: 'Global' },
  },
  {
    type: 'copy',
    slug: 'global-content-card-view-details',
    title: 'Content card action',
    body: 'View details',
    metadata: { key: 'global.content-card.view-details', group: 'Global' },
  },
  {
    type: 'copy',
    slug: 'global-errors-page-load',
    title: 'Page loading error',
    body: 'Unable to load this page. Please try again.',
    metadata: { key: 'global.errors.page-load', group: 'Errors' },
  },
  {
    type: 'copy',
    slug: 'global-errors-content-not-found',
    title: 'Content not found error',
    body: 'The requested content was not found.',
    metadata: { key: 'global.errors.content-not-found', group: 'Errors' },
  },
  {
    type: 'copy',
    slug: 'global-footer-newsletter-title',
    title: 'Newsletter title',
    body: 'Stay Connected with JCST',
    metadata: { key: 'global.footer.newsletter-title', group: 'Footer' },
  },
  {
    type: 'copy',
    slug: 'global-footer-newsletter-description',
    title: 'Newsletter description',
    body: 'Receive important information about admissions, academic programs, institutional announcements, and student opportunities.',
    metadata: { key: 'global.footer.newsletter-description', group: 'Footer' },
  },
  {
    type: 'copy',
    slug: 'global-footer-newsletter-aria',
    title: 'Newsletter email aria label',
    body: 'Newsletter email address',
    metadata: { key: 'global.footer.newsletter-aria', group: 'Footer' },
  },
  {
    type: 'copy',
    slug: 'global-footer-newsletter-placeholder',
    title: 'Newsletter placeholder',
    body: 'Enter your email address',
    metadata: { key: 'global.footer.newsletter-placeholder', group: 'Footer' },
  },
  {
    type: 'copy',
    slug: 'global-footer-newsletter-button',
    title: 'Newsletter button',
    body: 'Subscribe',
    metadata: { key: 'global.footer.newsletter-button', group: 'Footer' },
  },
  {
    type: 'copy',
    slug: 'global-footer-newsletter-submitting',
    title: 'Newsletter submitting label',
    body: 'Subscribing…',
    metadata: { key: 'global.footer.newsletter-submitting', group: 'Footer' },
  },
  {
    type: 'copy',
    slug: 'global-footer-newsletter-success',
    title: 'Newsletter success message',
    body: 'Thank you. Your subscription has been received.',
    metadata: { key: 'global.footer.newsletter-success', group: 'Footer' },
  },
  {
    type: 'copy',
    slug: 'global-footer-newsletter-error',
    title: 'Newsletter error message',
    body: 'Subscription could not be completed. Please try again.',
    metadata: { key: 'global.footer.newsletter-error', group: 'Footer' },
  },

  {
    type: 'section',
    slug: 'home-hero',
    title: 'Homepage Hero',
    excerpt: 'Main homepage introduction.',
    order: 1,
    metadata: {
      enabled: true,
      eyebrow: 'Welcome to JCST',
      titleLineOne: 'Empowering Minds.',
      titleLineTwo: 'Building the Future.',
      description:
        'Access quality, affordable, and career-oriented education designed to equip you with academic knowledge, practical skills, professional confidence, and strong ethical values.',
      primaryLabel: 'Explore Our Programs',
      primaryUrl: '/programs',
      secondaryLabel: 'Start E-Learning',
      secondaryUrl: '/e-learning',
      imageUrl:
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1800&q=90',
      imageAlt: 'Students learning in a modern college environment',
      imageEyebrow: 'Quality Higher Education',
      imageTitle: 'Learn Today. Lead Tomorrow.',
      imageDescription:
        'Preparing competent professionals and responsible citizens for Somalia and beyond.',
      location: 'Belet-Hawa, Gedo Region, Somalia',
      institutionLabel: 'Official Institution',
      badges: [
        { label: 'Established in 2025', icon: 'calendar' },
        { label: 'Qualified Instructors', icon: 'badge-check' },
        { label: 'Modern Learning Methods', icon: 'monitor' },
      ],
    },
  },
  {
    type: 'section',
    slug: 'home-statistics',
    title: 'Institutional Highlights',
    excerpt: '',
    order: 2,
    metadata: { enabled: true, limit: 4 },
  },
  {
    type: 'section',
    slug: 'home-programs',
    title: 'Career-focused programs for a changing world',
    excerpt:
      'JCST offers diploma and professional programs designed to develop practical competence, critical thinking, innovation, leadership, and professional confidence.',
    order: 3,
    metadata: {
      enabled: true,
      eyebrow: 'Explore Our Programs',
      viewAllLabel: 'Explore All Programs',
      viewAllUrl: '/programs',
      cardActionLabel: 'View Program',
      limit: 3,
    },
  },
  {
    type: 'section',
    slug: 'home-courses',
    title: 'Discover courses and meet your instructors',
    excerpt:
      'Explore available courses, review course information, and learn more about the qualified instructors responsible for guiding your academic journey.',
    order: 4,
    metadata: {
      enabled: true,
      eyebrow: 'Learn with JCST',
      viewAllLabel: 'Explore All Courses',
      viewAllUrl: '/courses',
      cardActionLabel: 'View Course',
      instructorLabel: 'Course Instructor',
      limit: 3,
    },
  },
  {
    type: 'section',
    slug: 'home-elearning',
    title: 'Flexible learning designed around your future',
    excerpt:
      'JCST combines modern teaching methodologies with digital learning opportunities to help students access educational content, strengthen practical skills, and continue learning wherever they are.',
    order: 5,
    metadata: {
      enabled: true,
      eyebrow: 'JCST Digital Learning',
      primaryLabel: 'Start Learning',
      primaryUrl: '/e-learning',
      secondaryLabel: 'Learn How It Works',
      secondaryUrl: '/e-learning',
      imageUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=90',
      imageAlt: 'Student using a laptop for digital learning',
      imageEyebrow: 'Connected Learning',
      imageTitle: 'Your classroom, wherever you are.',
      imageDescription:
        'A student-friendly digital environment supporting lessons, resources, assignments, assessments, and progress tracking.',
      progressEyebrow: 'Learning Progress',
      progressTitle: 'Continue your journey',
      progressLabel: 'Course progress',
      progressValue: '82%',
      progressPercent: 82,
      features: [
        {
          title: 'Learn with Flexibility',
          description:
            'Access your learning environment through a modern and student-friendly digital platform.',
          icon: 'laptop',
        },
        {
          title: 'Organized Course Materials',
          description:
            'Follow structured lessons and access academic resources related to your registered courses.',
          icon: 'book',
        },
        {
          title: 'Assignments and Assessments',
          description:
            'Complete learning activities, submit assignments, and receive academic feedback.',
          icon: 'badge-check',
        },
        {
          title: 'Track Your Progress',
          description: 'Follow lessons, academic activities, results, and overall course progress.',
          icon: 'target',
        },
      ],
    },
  },
  {
    type: 'section',
    slug: 'home-why-jcst',
    title: 'Education built on excellence, integrity, and innovation',
    excerpt:
      'JCST provides a supportive academic environment where students gain knowledge, practical competence, ethical values, and the confidence to contribute positively to society.',
    order: 6,
    metadata: {
      enabled: true,
      eyebrow: 'Why Choose JCST',
      features: [
        {
          title: 'Academic Excellence',
          description:
            'High standards in teaching, learning, assessment, student support, and institutional service.',
          icon: 'trophy',
        },
        {
          title: 'Practical Training',
          description:
            'Academic knowledge connected with practical activities and professional competencies.',
          icon: 'briefcase',
        },
        {
          title: 'Qualified Instructors',
          description:
            'Committed educators supporting academic progress, professional development, and responsible leadership.',
          icon: 'graduation',
        },
        {
          title: 'Innovation and Critical Thinking',
          description:
            'Creativity, problem-solving, research, continuous improvement, and responsible technology use.',
          icon: 'zap',
        },
      ],
    },
  },
  {
    type: 'section',
    slug: 'home-student-success',
    title: 'Learning today. Leading tomorrow.',
    excerpt:
      'Discover how JCST students are developing practical knowledge, professional skills, ethical responsibility, and the confidence to serve their communities.',
    order: 7,
    metadata: { enabled: true, eyebrow: 'Student Experiences', limit: 3 },
  },
  {
    type: 'section',
    slug: 'home-admissions',
    title: 'Begin your journey toward a stronger future',
    excerpt:
      'Apply to Jubbaland College of Science and Technology and gain access to quality, affordable, and career-oriented education in a supportive academic environment.',
    order: 8,
    metadata: {
      enabled: true,
      eyebrow: 'Admissions at JCST',
      imageUrl:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=90',
      imageAlt: 'Students preparing for admission and academic study',
      primaryLabel: 'Apply Now',
      primaryUrl: '/apply',
      secondaryLabel: 'View Admission Requirements',
      secondaryUrl: '/admissions',
      steps: [
        {
          number: '01',
          title: 'Choose Your Program',
          description: 'Explore available diploma and professional study opportunities.',
        },
        {
          number: '02',
          title: 'Submit Your Application',
          description:
            'Complete the application form and provide the required information and documents.',
        },
        {
          number: '03',
          title: 'Begin Your JCST Journey',
          description:
            'Receive your admission outcome and prepare to start your academic experience.',
        },
      ],
    },
  },

  {
    type: 'page',
    slug: 'home',
    title: 'Jubbaland College of Science and Technology',
    excerpt: 'Quality, affordable, and career-oriented higher education in Belet-Hawa, Somalia.',
    body: 'Empowering Minds, Building the Future.',
    order: 1,
    metadata: {
      seoTitle: 'Jubbaland College of Science and Technology | JCST',
      seoDescription:
        'Quality, affordable, practical, and career-oriented higher education in Belet-Hawa, Somalia.',
    },
  },
  {
    type: 'page',
    slug: 'programs',
    title: 'Academic Programs',
    excerpt:
      'Choose a diploma or professional pathway designed around academic quality, practical skills, and career readiness.',
    order: 20,
    metadata: { emptyMessage: 'No published programs are currently available.' },
  },
  {
    type: 'page',
    slug: 'courses',
    title: 'Course Catalog',
    excerpt:
      'Explore JCST courses, learning modes, academic levels, lesson information, and course instructors.',
    order: 21,
    metadata: { emptyMessage: 'No published courses are currently available.' },
  },
  {
    type: 'page',
    slug: 'departments',
    title: 'Academic Departments',
    excerpt:
      'Explore the academic communities responsible for teaching, curriculum development, advising, and professional growth.',
    order: 22,
    metadata: { emptyMessage: 'No published departments are currently available.' },
  },
  {
    type: 'page',
    slug: 'lecturers',
    title: 'Professional Lecturers',
    excerpt:
      'Meet educators and professionals committed to rigorous teaching, mentorship, and student success.',
    order: 23,
    metadata: { emptyMessage: 'No lecturer profiles are currently available.' },
  },
  {
    type: 'page',
    slug: 'announcements',
    title: 'Public Announcements',
    excerpt: 'Official academic, admission, and institutional notices from JCST.',
    order: 24,
    metadata: { emptyMessage: 'No public announcements are currently available.' },
  },
  {
    type: 'page',
    slug: 'faq',
    title: 'Frequently Asked Questions',
    excerpt: 'Clear answers about applications, programs, learning, and student services.',
    order: 25,
    metadata: { emptyMessage: 'No frequently asked questions are currently available.' },
  },
  {
    type: 'page',
    slug: 'contact',
    title: 'Contact JCST',
    excerpt: 'Send a verified enquiry to the appropriate JCST team.',
    body: 'Our team is ready to assist applicants, students, parents, lecturers, and partners.',
    order: 26,
    metadata: {
      contactPanelTitle: 'Institutional Contact',
      contactPanelDescription: 'Use the official information below when contacting JCST.',
      fullNameLabel: 'Full name',
      fullNamePlaceholder: 'Enter your full name',
      emailLabel: 'Email address',
      emailPlaceholder: 'Enter your email address',
      phoneLabel: 'Phone number',
      phonePlaceholder: 'Phone number (optional)',
      subjectLabel: 'Subject',
      subjectPlaceholder: 'How can we help?',
      messageLabel: 'Your message',
      messagePlaceholder: 'Write your message here',
      submitLabel: 'Send Message',
      submittingLabel: 'Sending…',
      successPrefix: 'Message received. Reference:',
      errorMessage: 'Message could not be sent. Please try again.',
    },
  },
  {
    type: 'page',
    slug: 'apply',
    title: 'Apply for Admission',
    excerpt:
      'Submit your initial JCST application securely and receive a reference number for status tracking.',
    order: 27,
    metadata: {
      successPrefix: 'Application submitted. Your reference number is',
      successSuffix: 'Save it safely.',
      errorMessage: 'Unable to submit the application. Review the fields and try again.',
      fullNameLabel: 'Full name',
      fullNameRequired: 'Full name is required',
      fullNameMinLength: 'Enter at least 3 characters',
      emailLabel: 'Email address',
      emailRequired: 'Email is required',
      phoneLabel: 'Phone number',
      phoneRequired: 'Phone is required',
      programLabel: 'Program',
      programRequired: 'Select a program',
      programPlaceholder: 'Select program',
      studyModeLabel: 'Study mode',
      studyModes: ['Regular', 'Weekend', 'Evening'],
      intakeLabel: 'Intake',
      intakes: ['January', 'May', 'September'],
      previousEducationLabel: 'Previous education',
      previousEducationRequired: 'Previous education is required',
      messageLabel: 'Additional message',
      submitLabel: 'Submit Application',
      submittingLabel: 'Submitting…',
    },
  },
  {
    type: 'page',
    slug: 'application-status',
    title: 'Application Status',
    excerpt:
      'Use your application reference number and email address to retrieve your current status securely.',
    order: 28,
    metadata: {
      referenceLabel: 'Reference number',
      referenceRequired: 'Reference number is required',
      emailLabel: 'Email address',
      emailRequired: 'Email is required',
      submitLabel: 'Check Status',
      checkingLabel: 'Checking…',
      notFoundMessage: 'No matching application was found.',
      statusLabel: 'Status',
      submittedLabel: 'Submitted',
    },
  },
  {
    type: 'page',
    slug: 'certificate-verification',
    title: 'Certificate Verification',
    excerpt: 'Confirm the validity and safe public details of a JCST certificate.',
    order: 29,
    metadata: {
      numberLabel: 'Certificate number',
      verifyLabel: 'Verify Certificate',
      verifyingLabel: 'Verifying…',
      notFoundMessage: 'No matching certificate was found.',
      recordLabel: 'certificate record',
      resultNumberLabel: 'Number',
      studentLabel: 'Student',
      programLabel: 'Program',
      issueDateLabel: 'Issue date',
    },
  },
  {
    type: 'page',
    slug: 'transcript-verification',
    title: 'Transcript Verification',
    excerpt: 'Confirm the validity and safe public details of a JCST transcript.',
    order: 30,
    metadata: {
      numberLabel: 'Transcript number',
      verifyLabel: 'Verify Transcript',
      verifyingLabel: 'Verifying…',
      notFoundMessage: 'No matching transcript was found.',
      recordLabel: 'transcript record',
      resultNumberLabel: 'Number',
      studentLabel: 'Student',
      programLabel: 'Program',
      issueDateLabel: 'Issue date',
    },
  },
  {
    type: 'page',
    slug: 'forgot-password',
    title: 'Forgot Password',
    excerpt: 'Request secure password-recovery assistance for your JCST account.',
    order: 31,
    metadata: {
      emailLabel: 'Account email',
      emailPlaceholder: 'Enter your account email',
      submitLabel: 'Request Recovery',
      sentMessage:
        'For account safety, contact JCST IT Support or the Registrar using the official contact page. Automated email recovery will be enabled after SMTP configuration.',
    },
  },
  {
    type: 'page',
    slug: 'register',
    title: 'Account Registration',
    excerpt:
      'JCST portal accounts are created through verified admission and staff onboarding workflows.',
    body: 'Submit an admission application first. Accepted applicants receive secure account activation instructions from JCST.',
    order: 32,
    metadata: {
      panelTitle: 'Prospective student?',
      buttonLabel: 'Apply for Admission',
      buttonUrl: '/apply',
    },
  },
  {
    type: 'page',
    slug: 'reset-password',
    title: 'Reset Password',
    excerpt: 'Password reset links are validated securely before a new password can be created.',
    body: 'This reset link is missing or invalid. Request assistance through the Forgot Password page or contact JCST IT Support.',
    order: 33,
  },
  {
    type: 'page',
    slug: 'verify-email',
    title: 'Email Verification',
    excerpt: 'JCST verifies account email addresses before granting full portal access.',
    body: 'A valid verification token is required. Open the official link sent by JCST or contact IT Support.',
    order: 34,
  },

  {
    type: 'program',
    slug: 'bachelor-information-technology',
    title: 'Bachelor of Information Technology',
    excerpt:
      'Build technical knowledge, digital skills, and problem-solving abilities for a technology-driven world.',
    body: 'Students develop strong technical and professional capabilities through coursework, laboratories, projects, and internship experience.',
    imageUrl:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=88',
    icon: 'monitor',
    order: 1,
    featured: true,
    metadata: {
      code: 'BIT',
      imageAlt: 'Students working with computers in a technology laboratory',
      highlights: ['Technology', 'Practical Learning', 'Career Focus'],
      publicDetails: [
        { label: 'Qualification', value: 'Bachelor Degree' },
        { label: 'Duration', value: '4 years' },
        { label: 'Study Mode', value: 'Regular and Weekend' },
      ],
    },
  },
  {
    type: 'program',
    slug: 'bachelor-business-administration',
    title: 'Bachelor of Business Administration',
    excerpt:
      'Develop management, communication, entrepreneurship, and leadership skills for modern organizations.',
    body: 'The program develops ethical, analytical, and entrepreneurial professionals for private, public, and community organizations.',
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=88',
    icon: 'briefcase',
    order: 2,
    featured: true,
    metadata: {
      code: 'BBA',
      imageAlt: 'Business students collaborating around a table',
      highlights: ['Business', 'Leadership', 'Entrepreneurship'],
      publicDetails: [
        { label: 'Qualification', value: 'Bachelor Degree' },
        { label: 'Duration', value: '4 years' },
        { label: 'Study Mode', value: 'Regular and Weekend' },
      ],
    },
  },
  {
    type: 'program',
    slug: 'diploma-public-health',
    title: 'Diploma in Public Health',
    excerpt:
      'Gain career-oriented knowledge and practical competencies for community health and professional service.',
    body: 'Students gain practical skills to support healthier communities, health education, prevention, and public-health programs.',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=88',
    icon: 'shield',
    order: 3,
    featured: true,
    metadata: {
      code: 'DPH',
      imageAlt: 'Health professional supporting community healthcare',
      highlights: ['Community Health', 'Professional Skills', 'Service'],
      publicDetails: [
        { label: 'Qualification', value: 'Diploma' },
        { label: 'Duration', value: '2 years' },
        { label: 'Study Mode', value: 'Regular' },
      ],
    },
  },
  {
    type: 'course',
    slug: 'introduction-to-programming',
    title: 'Introduction to Programming',
    excerpt:
      'Problem solving, algorithms, variables, control flow, functions, and structured programming.',
    body: 'A foundational course that develops logical thinking and practical programming skills through guided lessons and exercises.',
    imageUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=88',
    icon: 'laptop',
    order: 1,
    featured: true,
    metadata: {
      code: 'CSC101',
      lecturerSlug: 'dr-aamina-hassan',
      imageAlt: 'Programming code displayed on a laptop',
      highlights: ['12 Lessons', 'Blended', 'Year 1'],
      publicDetails: [
        { label: 'Credit Hours', value: '3' },
        { label: 'Academic Level', value: 'Year 1' },
        { label: 'Semester', value: 'Semester 1' },
        { label: 'Study Mode', value: 'Blended' },
      ],
    },
  },
  {
    type: 'course',
    slug: 'database-systems',
    title: 'Database Systems',
    excerpt:
      'Relational modeling, SQL, normalization, transactions, security, and database applications.',
    body: 'Students design, query, secure, and maintain reliable data-driven systems through practical database projects.',
    imageUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=88',
    icon: 'layers',
    order: 2,
    featured: true,
    metadata: {
      code: 'CSC204',
      lecturerSlug: 'dr-aamina-hassan',
      imageAlt: 'Modern data center and database infrastructure',
      highlights: ['16 Lessons', 'Blended', 'Year 2'],
      publicDetails: [
        { label: 'Credit Hours', value: '3' },
        { label: 'Academic Level', value: 'Year 2' },
        { label: 'Semester', value: 'Semester 1' },
        { label: 'Study Mode', value: 'Blended' },
      ],
    },
  },
  {
    type: 'course',
    slug: 'principles-of-management',
    title: 'Principles of Management',
    excerpt: 'Planning, organizing, leadership, decision-making, and organizational control.',
    body: 'A core course developing the knowledge and professional judgment required to manage teams and organizations responsibly.',
    imageUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=88',
    icon: 'briefcase',
    order: 3,
    featured: true,
    metadata: {
      code: 'BUS101',
      lecturerSlug: 'mohamed-abdi-nur',
      imageAlt: 'Business team discussing management strategy',
      highlights: ['14 Lessons', 'Campus', 'Year 1'],
      publicDetails: [
        { label: 'Credit Hours', value: '3' },
        { label: 'Academic Level', value: 'Year 1' },
        { label: 'Semester', value: 'Semester 1' },
        { label: 'Study Mode', value: 'Campus' },
      ],
    },
  },
  {
    type: 'lecturer',
    slug: 'dr-aamina-hassan',
    title: 'Dr. Aamina Hassan',
    excerpt: 'Senior Lecturer in Information Technology and digital systems.',
    body: 'Dr. Aamina teaches programming, databases, information systems, and technology-focused professional courses.',
    imageUrl:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=88',
    icon: 'graduation',
    order: 1,
    featured: true,
    metadata: {
      specialization: 'Information Technology',
      qualification: 'PhD in Information Systems',
      imageAlt: 'JCST lecturer Dr. Aamina Hassan',
      publicDetails: [
        { label: 'Specialization', value: 'Information Technology' },
        { label: 'Qualification', value: 'PhD in Information Systems' },
      ],
    },
  },
  {
    type: 'lecturer',
    slug: 'mohamed-abdi-nur',
    title: 'Mohamed Abdi Nur',
    excerpt: 'Lecturer in Business, management, and entrepreneurship.',
    body: 'Mohamed supports students in management, entrepreneurship, leadership, and professional business development.',
    imageUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=88',
    icon: 'briefcase',
    order: 2,
    featured: true,
    metadata: {
      specialization: 'Business and Management',
      qualification: 'MBA',
      imageAlt: 'JCST lecturer Mohamed Abdi Nur',
      publicDetails: [
        { label: 'Specialization', value: 'Business and Management' },
        { label: 'Qualification', value: 'MBA' },
      ],
    },
  },
  {
    type: 'testimonial',
    slug: 'student-experience-one',
    title: 'JCST Student Experience',
    excerpt: 'Verified student experience.',
    body: 'JCST has helped me strengthen my knowledge, practical skills, and confidence. The supportive learning environment encourages me to work toward my professional goals.',
    imageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=88',
    order: 1,
    featured: true,
    metadata: {
      program: 'Information Technology Student',
      rating: 5,
      imageAlt: 'JCST student learning with classmates',
    },
  },
  {
    type: 'testimonial',
    slug: 'student-experience-two',
    title: 'JCST Learning Community',
    excerpt: 'Verified student experience.',
    body: 'Modern teaching, practical training, and digital access connect learning with the skills required in professional life.',
    imageUrl:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=88',
    order: 2,
    featured: true,
    metadata: {
      program: 'Business Student',
      rating: 5,
      imageAlt: 'Student participating in a modern learning environment',
    },
  },
  {
    type: 'testimonial',
    slug: 'student-experience-three',
    title: 'JCST Academic Journey',
    excerpt: 'Verified student experience.',
    body: 'Integrity, innovation, and lifelong learning prepare students to serve their communities and pursue meaningful careers.',
    imageUrl:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=88',
    order: 3,
    featured: true,
    metadata: {
      program: 'Professional Program Student',
      rating: 5,
      imageAlt: 'Student celebrating academic progress',
    },
  },
  {
    type: 'statistic',
    slug: 'established',
    title: 'Established',
    excerpt: '2025',
    body: 'Building a modern institution for education and innovation.',
    icon: 'calendar',
    order: 1,
    featured: true,
  },
  {
    type: 'statistic',
    slug: 'program-types',
    title: 'Diploma and Professional Programs',
    excerpt: 'Career-Oriented',
    body: 'Programs designed for the modern labor market.',
    icon: 'graduation',
    order: 2,
    featured: true,
  },
  {
    type: 'statistic',
    slug: 'learning-model',
    title: 'Competency-Based Learning',
    excerpt: 'Practical',
    body: 'Academic knowledge connected to professional skills.',
    icon: 'book-open-check',
    order: 3,
    featured: true,
  },
  {
    type: 'statistic',
    slug: 'delivery-mode',
    title: 'Learning Access',
    excerpt: 'Online and Campus',
    body: 'Flexible learning through connected delivery modes.',
    icon: 'monitor',
    order: 4,
    featured: true,
  },

  {
    type: 'page',
    slug: 'about',
    title: 'About Jubbaland College of Science and Technology',
    excerpt:
      'A modern higher education institution providing quality, affordable, competency-based, and career-oriented education in Belet-Hawa, Somalia.',
    body:
      'Jubbaland College of Science and Technology was established in 2025 to equip students with academic knowledge, practical skills, professional confidence, and ethical values required to contribute to national development. JCST offers diploma and professional programs designed for the modern labor market while advancing academic excellence, innovation, entrepreneurship, research, and community service.',
    imageUrl:
      '',
    icon: 'graduation',
    order: 2,
    featured: true,
    published: true,
    metadata: {
      seoTitle: 'About JCST | Jubbaland College of Science and Technology',
      seoDescription:
        'Learn about JCST, its mission, vision, values, educational approach, and commitment to quality higher education in Belet-Hawa, Somalia.',
  
      eyebrow: 'About JCST',
      titleLineOne: 'Knowledge for Today.',
      titleLineTwo: 'Leadership for Tomorrow.',
      heroDescription:
        'Discover an institution committed to accessible education, practical competence, ethical leadership, innovation, and sustainable development in Somalia and beyond.',
      heroImageUrl:
        '',
      heroImageAlt:
        'Students walking through a modern higher education campus',
      imageEyebrow: 'Quality Higher Education',
      imageTitle: 'A college built to develop competent professionals',
      imageDescription:
        'JCST connects academic learning, practical training, technology, ethical values, and community responsibility.',
      primaryLabel: 'Explore Programs',
      primaryUrl: '/programs',
      secondaryLabel: 'Apply for Admission',
      secondaryUrl: '/apply',
      establishedLabel: 'Institution',
      locationLabel: 'Location',
      badges: [
        { label: 'Established in 2025', icon: 'calendar' },
        { label: 'Career-Oriented Education', icon: 'briefcase' },
        { label: 'Competency-Based Learning', icon: 'book' },
      ],
  
      metrics: [
        {
          value: '2025',
          label: 'Established in Belet-Hawa',
          icon: 'calendar',
        },
        {
          value: 'Diploma & Professional',
          label: 'Career-Focused Programs',
          icon: 'graduation',
        },
        {
          value: 'Practical',
          label: 'Competency-Based Learning',
          icon: 'book',
        },
        {
          value: 'Somalia & Beyond',
          label: 'Graduate Readiness',
          icon: 'globe',
        },
      ],
  
      storyEyebrow: 'Who We Are',
      storyTitle: 'An institution shaped by purpose, opportunity, and service',
      storyDescription:
        'Jubbaland College of Science and Technology is a higher education institution established in 2025 in Belet-Hawa, Gedo Region, Jubbaland State, Somalia. The college provides quality, affordable, and career-oriented education that equips students with knowledge, practical skills, professional confidence, and ethical values.',
      storyImageUrl:
        '',
      storyImageAlt:
        'College students collaborating in a supportive learning environment',
      storyImageEyebrow: 'Student-Centered Education',
      storyImageTitle: 'Learning that connects knowledge with practice',
      storyCardEyebrow: 'Our Commitment',
      storyCardTitle: 'Competent professionals. Responsible citizens.',
      storyHighlights: [
        {
          title: 'Accessible Education',
          description:
            'Quality learning opportunities designed to remain relevant, supportive, and responsive to student needs.',
          icon: 'users',
        },
        {
          title: 'Career Orientation',
          description:
            'Programs shaped by professional competence, modern labor-market needs, and employable skills.',
          icon: 'briefcase',
        },
        {
          title: 'Ethical Leadership',
          description:
            'An academic culture that promotes integrity, responsibility, discipline, and service.',
          icon: 'shield',
        },
        {
          title: 'National Development',
          description:
            'Education that empowers graduates to contribute to sustainable social and economic progress.',
          icon: 'globe',
        },
      ],
  
      directionEyebrow: 'Our Direction',
      directionTitle: 'A clear mission and an ambitious vision',
      directionDescription:
        'JCST is guided by a commitment to accessible learning, practical excellence, innovation, research, ethical leadership, and positive social impact.',
      missionEyebrow: 'Our Mission',
      missionTitle: 'Education that empowers people and communities',
      missionBody:
        'To provide accessible, high-quality, and competency-based education through innovative teaching, practical training, research, and community engagement, empowering students with the knowledge, skills, and values needed to become ethical professionals and leaders who contribute to sustainable development in Somalia and beyond.',
      visionEyebrow: 'Our Vision',
      visionTitle: 'A leading center of excellence in Somalia',
      visionBody:
        'To become a leading center of excellence in science, technology, business, and professional education in Somalia, recognized for academic excellence, innovation, research, and the development of competent graduates who positively impact society.',
  
      valuesEyebrow: 'Our Core Values',
      valuesTitle: 'The principles that guide every part of JCST',
      valuesDescription:
        'These values shape our teaching, leadership, student support, professional conduct, partnerships, and responsibility to society.',
      values: [
        {
          title: 'Excellence',
          description:
            'Striving for the highest standards in education and service.',
          icon: 'award',
        },
        {
          title: 'Integrity',
          description:
            'Promoting honesty, accountability, and ethical conduct.',
          icon: 'shield',
        },
        {
          title: 'Innovation',
          description:
            'Encouraging creativity, critical thinking, and continuous improvement.',
          icon: 'innovation',
        },
        {
          title: 'Professionalism',
          description:
            'Maintaining competence, discipline, and respect in all activities.',
          icon: 'briefcase',
        },
        {
          title: 'Inclusiveness',
          description:
            'Providing equal opportunities regardless of gender, background, or ability.',
          icon: 'users',
        },
        {
          title: 'Community Service',
          description:
            'Contributing to the social and economic development of society.',
          icon: 'globe',
        },
        {
          title: 'Collaboration',
          description:
            'Building strong partnerships with stakeholders for mutual growth.',
          icon: 'handshake',
        },
        {
          title: 'Lifelong Learning',
          description:
            'Inspiring continuous personal and professional development.',
          icon: 'book',
        },
      ],
  
      approachEyebrow: 'How We Educate',
      approachTitle: 'A modern approach built around competence and impact',
      approachDescription:
        'Through qualified instructors, practical training, modern teaching methodologies, research, entrepreneurship, and strong community partnerships, JCST prepares graduates to compete nationally and internationally.',
      approachItems: [
        {
          title: 'Qualified Instructors',
          description:
            'Committed educators who connect academic knowledge with professional guidance and mentorship.',
          icon: 'graduation',
        },
        {
          title: 'Practical Training',
          description:
            'Learning activities that develop applied competence, confidence, and workplace readiness.',
          icon: 'briefcase',
        },
        {
          title: 'Modern Teaching',
          description:
            'Student-centered methods supported by technology, critical thinking, and continuous improvement.',
          icon: 'innovation',
        },
        {
          title: 'Community Partnerships',
          description:
            'Collaboration that connects education with real social, professional, and development needs.',
          icon: 'handshake',
        },
      ],
      approachImageUrl:
        '',
      approachImageAlt:
        'Lecturer guiding students during an interactive college class',
      impactEyebrow: 'Education with Purpose',
      impactTitle: 'Preparing graduates for meaningful contribution',
      impactItems: [
        'Academic excellence supported by practical competence.',
        'Innovation, entrepreneurship, and responsible problem-solving.',
        'Research and community engagement linked to development needs.',
        'Graduates prepared to compete nationally and internationally.',
      ],
      impactCardEyebrow: 'Graduate Outcome',
      impactCardTitle: 'Skilled, ethical, confident, and community-minded.',
  
      mottoEyebrow: 'Our Motto',
      mottoDescription:
        'A commitment to strengthen knowledge, develop character, unlock professional potential, and build a better future through education.',
  
      ctaEyebrow: 'Become Part of JCST',
      ctaTitle: 'Build your future through knowledge, skills, and purpose',
      ctaDescription:
        'Explore our diploma and professional programs or begin your admission journey today.',
      ctaPrimaryLabel: 'Apply Now',
      ctaPrimaryUrl: '/apply',
      ctaSecondaryLabel: 'Explore Programs',
      ctaSecondaryUrl: '/programs',
      ctaImageUrl:
        '',
      ctaImageAlt:
        'Students learning and collaborating at college',
    },
  },
  {
    type: 'page',
    slug: 'academics',
    title: 'Academic Excellence at JCST',
    excerpt:
      'Competency-based programs combining academic knowledge, practical training, innovation, and professional development.',
    body: 'JCST academic delivery combines lectures, practical activities, digital learning, projects, assessments, research, and student support.',
    order: 3,
    metadata: {
      sections: [
        {
          title: 'Academic Approach',
          body: 'Our teaching methods encourage creativity, critical thinking, practical competence, ethical conduct, and continuous improvement.',
        },
        {
          title: 'Professional Preparation',
          body: 'Programs are designed to respond to the modern labor market and prepare graduates to compete nationally and internationally.',
        },
      ],
    },
  },
  {
    type: 'page',
    slug: 'admissions',
    title: 'Join JCST',
    excerpt: 'Begin a clear, accessible, and student-friendly admission journey.',
    body: 'Applicants select a program and intake, submit the required academic information and documents, receive a reference number, and track their application online.',
    order: 4,
    metadata: {
      sections: [
        {
          title: 'Admission Requirements',
          body: 'Applicants should prepare the required documents before starting the application.',
          items: [
            'Completed application form',
            'Previous academic certificate',
            'Academic transcript or result slip',
            'Identity document',
            'Recent passport-size photograph',
          ],
        },
        {
          title: 'Available Intakes',
          body: 'Available intakes depend on the selected program and academic calendar.',
          items: ['January', 'May', 'September'],
        },
      ],
    },
  },
  {
    type: 'page',
    slug: 'e-learning',
    title: 'Learning Without Limits',
    excerpt:
      'A modern digital learning environment supporting lessons, resources, assignments, assessments, and progress tracking.',
    body: 'JCST e-learning connects students and lecturers through structured course spaces designed to support flexible and blended learning.',
    order: 5,
    metadata: {
      sections: [
        {
          title: 'Digital Course Access',
          body: 'Registered students can access course lessons, learning files, instructor guidance, and approved digital resources.',
        },
        {
          title: 'Assignments and Assessments',
          body: 'Students can complete activities, submit assignments, participate in assessments, and receive academic feedback.',
        },
        {
          title: 'Progress Tracking',
          body: 'The learning environment helps students follow lesson completion, academic activities, assessment results, and course progress.',
        },
      ],
    },
  },
  {
    type: 'page',
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    excerpt: 'How JCST collects, protects, uses, and manages personal and academic information.',
    body: 'JCST collects information required to provide admissions, academic, financial, communication, verification, and support services. Access is restricted by authentication, role, permission, and institutional responsibility.',
    order: 40,
    metadata: {
      sections: [
        {
          title: 'Information Protection',
          body: 'The college applies administrative and technical safeguards to protect personal, academic, and institutional records.',
        },
        {
          title: 'Data Accuracy',
          body: 'Users may contact JCST to request correction of inaccurate personal information according to institutional procedures.',
        },
      ],
    },
  },
  {
    type: 'page',
    slug: 'terms-and-conditions',
    title: 'Terms and Conditions',
    excerpt: 'Rules governing the responsible use of JCST websites, portals, and digital services.',
    body: 'Users must provide accurate information, protect account credentials, use the platform lawfully, respect academic integrity, and avoid unauthorized access or misuse.',
    order: 41,
    metadata: {
      sections: [
        {
          title: 'Responsible Use',
          body: 'Users are responsible for activity performed through their accounts and must immediately report suspected unauthorized access.',
        },
        {
          title: 'Institutional Action',
          body: 'JCST may restrict or suspend access when security, disciplinary, legal, or policy concerns require investigation.',
        },
      ],
    },
  },

  {
    type: 'page',
    slug: 'login',
    title: 'JCST Portal Login',
    excerpt:
      'Use your authorized college account. Access is recorded and protected by server-side controls.',
    body: '',
    order: 35,
    metadata: {
      eyebrow: 'Secure Access',
      backLabel: 'Back to Public Website',
      backUrl: '/',
      emailLabel: 'Email Address',
      emailRequired: 'Email address is required',
      emailInvalid: 'Enter a valid email address',
      passwordLabel: 'Password',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must contain at least 8 characters',
      forgotLabel: 'Forgot Password?',
      forgotUrl: '/forgot-password',
      submitLabel: 'Sign In Securely',
      submittingLabel: 'Signing In…',
      errorMessage: 'Login could not be completed. Check your credentials and try again.',
    },
  },
  {
    type: 'page',
    slug: 'not-found',
    title: 'Page Not Found',
    excerpt: 'The requested JCST page does not exist.',
    body: '',
    order: 99,
    metadata: { code: '404', buttonLabel: 'Return Home', buttonUrl: '/' },
  },
].map((record) =>
  Object.assign(
    {
      imageUrl: '',
      icon: '',
      published: true,
      featured: false,
      order: 0,
      excerpt: '',
      body: '',
      metadata: {},
    },
    record,
  ),
);

const force = process.argv.includes('--force');

const run = async () => {
  await connectDatabase();
  for (const record of records) {
    await WebsiteContentModel.findOneAndUpdate(
      { type: record.type, slug: record.slug } as any,
      force ? { $set: record } : { $setOnInsert: record },
      { upsert: true, returnDocument: 'after', runValidators: true },
    );
  }
  logger.info(
    { count: records.length, mode: force ? 'force-update' : 'insert-missing-only' },
    force
      ? 'Public website content was reset to the official seeded values'
      : 'Missing public website content was created without overwriting admin changes',
  );
  await disconnectDatabase();
};

run().catch(async (error) => {
  logger.error(error, 'Failed to seed public website content');
  await disconnectDatabase();
  process.exitCode = 1;
});