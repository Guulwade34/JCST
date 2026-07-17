/* eslint-disable */
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { logger } from '../config/logger.js';
import { WebsiteContentModel } from '../modules/website/website-content.model.js';

const courseCommercialData: Record<string, Record<string, unknown>> = {
  'introduction-to-information-technology': {
    category: 'Computing & Technology',
    price: 35,
    originalPrice: 45,
    currency: 'USD',
    duration: '8 Weeks',
    language: 'English',
    totalLessons: 18,
    totalVideoMinutes: 420,
    isPaidCourse: true,
    accessDurationDays: 180,
    certificateAvailable: true,
    requirements: [
      'Basic ability to use a computer or smartphone.',
      'A reliable internet connection for digital learning activities.',
      'Commitment to complete lessons, quizzes, and practical tasks.',
    ],
    includes: [
      '18 structured lessons',
      'Downloadable learning resources',
      'Quizzes and practical activities',
      'Lecturer guidance and feedback',
      'Progress tracking',
      'Certificate eligibility after successful completion',
    ],
    publicCurriculum: [
      {
        title: 'Section 1: Course Orientation',
        description: 'Understand the course structure, learning outcomes, and platform expectations.',
        lessons: [
          { title: 'Welcome and Course Introduction', type: 'video', duration: '04:30', isPreview: true, previewVideoUrl: '' },
          { title: 'How to Use the JCST Learning Platform', type: 'video', duration: '08:20', isPreview: false },
          { title: 'Course Expectations and Study Plan', type: 'text', duration: '06 min', isPreview: false },
        ],
      },
      {
        title: 'Section 2: Computer Systems and Digital Tools',
        lessons: [
          { title: 'Understanding Computer Hardware', type: 'video', duration: '16:40', isPreview: false },
          { title: 'Software and Operating Systems', type: 'video', duration: '18:10', isPreview: false },
          { title: 'Productivity Tools Practical Activity', type: 'assignment', duration: '45 min', isPreview: false },
          { title: 'Section Quiz', type: 'quiz', duration: '15 min', isPreview: false },
        ],
      },
      {
        title: 'Section 3: Networks, Data, and Cybersecurity',
        lessons: [
          { title: 'Internet and Network Foundations', type: 'video', duration: '20:15', isPreview: false },
          { title: 'Data, Cloud Services, and Privacy', type: 'video', duration: '17:45', isPreview: false },
          { title: 'Cybersecurity Awareness', type: 'video', duration: '22:00', isPreview: false },
          { title: 'Security Awareness Assignment', type: 'assignment', duration: '60 min', isPreview: false },
        ],
      },
      {
        title: 'Section 4: Completion and Certification',
        lessons: [
          { title: 'Course Review', type: 'video', duration: '14:20', isPreview: false },
          { title: 'Final Project', type: 'assignment', duration: '2 hours', isPreview: false },
          { title: 'Final Examination', type: 'exam', duration: '60 min', isPreview: false },
        ],
      },
    ],
  },
  'introduction-to-programming': {
    category: 'Computing & Technology',
    price: 45,
    originalPrice: 60,
    currency: 'USD',
    duration: '10 Weeks',
    language: 'English',
    totalLessons: 24,
    totalVideoMinutes: 610,
    isPaidCourse: true,
    accessDurationDays: 240,
    certificateAvailable: true,
    requirements: [
      'Basic computer literacy.',
      'Elementary mathematics and logical reasoning.',
      'Access to a laptop or desktop computer for programming exercises.',
    ],
    includes: [
      '24 structured lessons',
      'Programming demonstrations',
      'Practice exercises and projects',
      'Quizzes and final assessment',
      'Lecturer feedback',
      'Certificate eligibility after successful completion',
    ],
    publicCurriculum: [
      {
        title: 'Section 1: Programming Orientation',
        lessons: [
          { title: 'Welcome to Programming', type: 'video', duration: '05:10', isPreview: true, previewVideoUrl: '' },
          { title: 'Installing the Required Tools', type: 'video', duration: '12:40', isPreview: false },
          { title: 'Your First Program', type: 'video', duration: '15:20', isPreview: false },
        ],
      },
      {
        title: 'Section 2: Variables, Data, and Decisions',
        lessons: [
          { title: 'Variables and Data Types', type: 'video', duration: '21:00', isPreview: false },
          { title: 'Input, Output, and Operators', type: 'video', duration: '19:30', isPreview: false },
          { title: 'Conditional Statements', type: 'video', duration: '24:15', isPreview: false },
          { title: 'Decision-Making Practice', type: 'assignment', duration: '60 min', isPreview: false },
        ],
      },
      {
        title: 'Section 3: Loops, Functions, and Collections',
        lessons: [
          { title: 'Working with Loops', type: 'video', duration: '26:40', isPreview: false },
          { title: 'Building Reusable Functions', type: 'video', duration: '23:25', isPreview: false },
          { title: 'Arrays and Basic Collections', type: 'video', duration: '28:10', isPreview: false },
          { title: 'Section Quiz', type: 'quiz', duration: '20 min', isPreview: false },
        ],
      },
      {
        title: 'Section 4: Project and Completion',
        lessons: [
          { title: 'Debugging and Code Quality', type: 'video', duration: '20:45', isPreview: false },
          { title: 'Final Programming Project', type: 'assignment', duration: '3 hours', isPreview: false },
          { title: 'Final Examination', type: 'exam', duration: '75 min', isPreview: false },
        ],
      },
    ],
  },
  'database-systems-one': {
    category: 'Computing & Technology',
    price: 50,
    originalPrice: 65,
    currency: 'USD',
    duration: '10 Weeks',
    language: 'English',
    totalLessons: 22,
    totalVideoMinutes: 580,
    isPaidCourse: true,
    accessDurationDays: 240,
    certificateAvailable: true,
    requirements: [
      'Basic computer literacy.',
      'Introductory programming or information technology knowledge.',
      'Access to a computer capable of running a database management system.',
    ],
    includes: [
      '22 video and text lessons',
      'SQL demonstrations and exercises',
      'Database design project',
      'Quizzes and examinations',
      'Instructor feedback',
      'Certificate eligibility after successful completion',
    ],
    publicCurriculum: [
      {
        title: 'Section 1: Database Introduction',
        lessons: [
          { title: 'Introduction to Database Systems', type: 'video', duration: '05:20', isPreview: true, previewVideoUrl: '' },
          { title: 'Database Management Systems', type: 'video', duration: '17:30', isPreview: false },
          { title: 'Relational Database Concepts', type: 'video', duration: '21:10', isPreview: false },
        ],
      },
      {
        title: 'Section 2: Data Modeling and Design',
        lessons: [
          { title: 'Entities, Attributes, and Relationships', type: 'video', duration: '24:10', isPreview: false },
          { title: 'Entity Relationship Diagrams', type: 'video', duration: '27:40', isPreview: false },
          { title: 'Database Design Assignment', type: 'assignment', duration: '90 min', isPreview: false },
        ],
      },
      {
        title: 'Section 3: SQL and Data Operations',
        lessons: [
          { title: 'Creating Tables and Constraints', type: 'video', duration: '29:00', isPreview: false },
          { title: 'Queries, Filtering, and Sorting', type: 'video', duration: '31:20', isPreview: false },
          { title: 'Joins and Aggregate Functions', type: 'video', duration: '34:10', isPreview: false },
          { title: 'SQL Practical Quiz', type: 'quiz', duration: '25 min', isPreview: false },
        ],
      },
      {
        title: 'Section 4: Completion',
        lessons: [
          { title: 'Normalization', type: 'video', duration: '26:30', isPreview: false },
          { title: 'Final Database Project', type: 'assignment', duration: '4 hours', isPreview: false },
          { title: 'Final Examination', type: 'exam', duration: '90 min', isPreview: false },
        ],
      },
    ],
  },
  'web-application-development': {
    category: 'Computing & Technology',
    price: 60,
    originalPrice: 80,
    currency: 'USD',
    duration: '12 Weeks',
    language: 'English',
    totalLessons: 30,
    totalVideoMinutes: 760,
    isPaidCourse: true,
    accessDurationDays: 300,
    certificateAvailable: true,
    requirements: [
      'Basic programming knowledge.',
      'Familiarity with HTML and computer file management.',
      'A laptop or desktop computer with internet access.',
    ],
    includes: [
      '30 guided lessons',
      'Front-end and back-end demonstrations',
      'Downloadable starter files',
      'Practical projects and assessments',
      'Instructor feedback',
      'Certificate eligibility after successful completion',
    ],
    publicCurriculum: [
      {
        title: 'Section 1: Web Development Orientation',
        lessons: [
          { title: 'Welcome to Web Application Development', type: 'video', duration: '06:10', isPreview: true, previewVideoUrl: '' },
          { title: 'How Modern Web Applications Work', type: 'video', duration: '18:30', isPreview: false },
          { title: 'Development Environment Setup', type: 'video', duration: '15:45', isPreview: false },
        ],
      },
      {
        title: 'Section 2: Front-End Development',
        lessons: [
          { title: 'Semantic HTML', type: 'video', duration: '24:10', isPreview: false },
          { title: 'Modern CSS Layouts', type: 'video', duration: '31:40', isPreview: false },
          { title: 'JavaScript Foundations', type: 'video', duration: '35:20', isPreview: false },
          { title: 'Responsive Interface Project', type: 'assignment', duration: '3 hours', isPreview: false },
        ],
      },
      {
        title: 'Section 3: Back-End and Databases',
        lessons: [
          { title: 'Server-Side Application Concepts', type: 'video', duration: '29:00', isPreview: false },
          { title: 'Building REST APIs', type: 'video', duration: '34:10', isPreview: false },
          { title: 'Connecting Applications to Databases', type: 'video', duration: '36:25', isPreview: false },
        ],
      },
      {
        title: 'Section 4: Deployment and Final Project',
        lessons: [
          { title: 'Authentication and Security Basics', type: 'video', duration: '28:15', isPreview: false },
          { title: 'Application Deployment', type: 'video', duration: '22:40', isPreview: false },
          { title: 'Final Web Application Project', type: 'assignment', duration: '8 hours', isPreview: false },
          { title: 'Final Examination', type: 'exam', duration: '90 min', isPreview: false },
        ],
      },
    ],
  },
};

const eLearningPageUpdate = {
  title: 'JCST Premium E-Learning Marketplace',
  excerpt: 'Browse paid JCST courses, compare fees, preview one introduction lesson, and inspect every locked lesson before enrollment.',
  body: 'JCST E-Learning is a premium course marketplace and learning platform. Every course clearly displays its price, duration, instructor, outcomes, requirements, and complete curriculum. Visitors can watch one introduction video while premium lessons remain locked until payment is verified.',
  metadata: {
    marketplaceFeatures: [
      { title: 'Secure Locked Lessons', description: 'Premium videos, files, quizzes, assignments, and exams remain protected until payment is verified.', icon: 'lock' },
      { title: 'Mobile-Friendly Learning', description: 'The learning experience is designed for compatible phones, tablets, laptops, and desktop computers.', icon: 'mobile' },
      { title: 'Visible Progress', description: 'Paid students can follow lesson completion, assessments, feedback, and course progress.', icon: 'progress' },
      { title: 'Academic Support', description: 'Lecturer guidance, announcements, feedback, and course support remain connected to each enrollment.', icon: 'support' },
    ],
    catalogEyebrow: 'JCST Course Marketplace',
    catalogTitle: 'Choose the course that moves your future forward',
    catalogDescription: 'Every paid course displays its fee, instructor, duration, outcomes, requirements, curriculum, and one free introduction preview.',
    seoTitle: 'Paid Online Courses | JCST E-Learning',
    seoDescription: 'Browse paid JCST online courses, compare fees, view locked lesson curricula, and watch one free introduction video before enrollment.',
  },
};

const run = async () => {
  await connectDatabase();

  try {
    const page = await WebsiteContentModel.findOne({ type: 'page', slug: 'e-learning' }).lean();

    await WebsiteContentModel.findOneAndUpdate(
      { type: 'page', slug: 'e-learning' },
      {
        $set: {
          ...eLearningPageUpdate,
          metadata: {
            ...(page?.metadata ?? {}),
            ...eLearningPageUpdate.metadata,
          },
          published: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    let updatedCourses = 0;

    for (const [slug, commercialMetadata] of Object.entries(courseCommercialData)) {
      const course = await WebsiteContentModel.findOne({ type: 'course', slug }).lean();

      if (!course) {
        logger.warn({ slug }, 'Paid marketplace metadata skipped because the course record does not exist');
        continue;
      }

      await WebsiteContentModel.updateOne(
        { type: 'course', slug },
        {
          $set: {
            metadata: {
              ...(course.metadata ?? {}),
              eLearningEnabled: true,
              ...commercialMetadata,
            },
            published: true,
          },
        },
      );

      updatedCourses += 1;
    }

    logger.info(
      { updatedCourses },
      'E-Learning paid marketplace metadata was seeded successfully',
    );
  } catch (error) {
    logger.error({ err: error }, 'Failed to seed the E-Learning paid marketplace');
    process.exitCode = 1;
  }
};

run()
  .catch((error) => {
    logger.error({ err: error }, 'Failed to run the E-Learning marketplace seed script');
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });