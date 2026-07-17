import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { logger } from '../config/logger.js';
import { WebsiteContentModel } from '../modules/website/website-content.model.js';

const academicsPage = {
  type: 'page',
  slug: 'academics',
  title: 'Academics',
  excerpt:
    'Explore a modern academic experience that combines quality teaching, practical learning, and flexible e-learning pathways.',
  body:
    'JCST offers a student-centered academic environment designed to build knowledge, practical competence, professional confidence, and ethical leadership through modern teaching and digital learning.',
  imageUrl:
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
  isPublished: true,
  metadata: {
    eyebrow: 'Academics at JCST',
    titleLineOne: 'Academic Excellence',
    titleLineTwo: 'For A Digital Future.',
    heroDescription:
      'Study in a clean, modern, and career-focused environment where classroom learning, practical training, and e-learning work together to prepare you for real opportunities.',
    primaryLabel: 'Explore Programs',
    primaryUrl: '/programs',
    secondaryLabel: 'Start E-Learning',
    secondaryUrl: '/e-learning',
    heroImageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80',
    heroImageAlt: 'Students collaborating in a modern learning environment',
    heroFloatingLabel: 'Blended learning excellence',
    imageEyebrow: 'International-standard learning',
    imageTitle: 'Built for modern students, future professionals, and lifelong learners.',
    imageDescription:
      'Our academic model combines quality instruction, structured learning pathways, flexible digital access, and practical outcomes.',
    infoCardOneLabel: 'Delivery Model',
    infoCardOneValue: 'On-campus + E-Learning',
    infoCardTwoLabel: 'Academic Pathways',
    infoCardTwoValue: 'Diploma & Professional Study',
    badges: [
      { label: 'Competency-based learning', icon: 'check' },
      { label: 'Blended teaching model', icon: 'monitor' },
      { label: 'Student-centered support', icon: 'users' },
      { label: 'Career-oriented outcomes', icon: 'briefcase' },
    ],
    metrics: [
      { value: '12+', label: 'Programs and study pathways', icon: 'graduation' },
      { value: '4', label: 'Academic focus areas', icon: 'building' },
      { value: 'Blended', label: 'On-campus + digital learning', icon: 'laptop' },
      { value: 'Career Ready', label: 'Practical and employable outcomes', icon: 'award' },
    ],
    pillarsEyebrow: 'Academic framework',
    pillarsTitle: 'A clean, structured, and internationally inspired learning model',
    pillarsDescription:
      'JCST’s academic experience is designed around clarity, relevance, flexibility, and student success.',
    pillars: [
      {
        title: 'Relevant Curriculum',
        description:
          'Programs are structured to match modern knowledge, practical competence, and labor-market expectations.',
        icon: 'layers',
      },
      {
        title: 'Practical Learning',
        description:
          'Students build hands-on competence through applied exercises, projects, and guided academic activities.',
        icon: 'bookcheck',
      },
      {
        title: 'Flexible Delivery',
        description:
          'Classroom study and e-learning are integrated to support both accessibility and learning continuity.',
        icon: 'monitor',
      },
      {
        title: 'Progressive Support',
        description:
          'Advising, learning resources, and academic guidance help students stay focused and move forward with confidence.',
        icon: 'users',
      },
    ],
    experienceEyebrow: 'Learning experience',
    experienceTitle: 'E-learning that complements serious academic study',
    experienceDescription:
      'This page is built for an e-learning platform, so the academic experience highlights structure, accessibility, and digital continuity without losing quality or professionalism.',
    experienceItems: [
      {
        title: 'Organized Course Access',
        description:
          'Students can access course materials, outlines, and guided learning resources in one organized experience.',
        icon: 'library',
      },
      {
        title: 'Assessment and Feedback',
        description:
          'Assignments, quizzes, and other academic tasks help students measure progress and receive timely feedback.',
        icon: 'check',
      },
      {
        title: 'Academic Scheduling',
        description:
          'Clear calendars, modules, and structured progression help learners stay consistent and focused.',
        icon: 'calendar',
      },
      {
        title: 'Anywhere Learning',
        description:
          'The platform supports continuity by allowing students to learn beyond the classroom when needed.',
        icon: 'globe',
      },
    ],
    experienceImageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
    experienceImageAlt: 'Students using laptops for modern academic learning',
    experienceImageEyebrow: 'Smart academic delivery',
    experienceImageTitle: 'One academic experience across classroom learning and digital access.',
    experienceImageDescription:
      'Students benefit from a unified model where instruction, resources, assessments, and learning support remain connected.',
    experienceCardEyebrow: 'Why it matters',
    experienceCardTitle: 'Flexible. Structured. Career-focused. Student-friendly.',
    schoolsEyebrow: 'Academic areas',
    schoolsTitle: 'Focused study pathways designed for real progress',
    schoolsDescription:
      'The Academics page should feel modern and premium, while still helping users quickly understand where they can study and how the platform supports learning.',
    schools: [
      {
        title: 'Computing & Digital Skills',
        description:
          'A pathway for software, systems, databases, and practical technology-focused learning.',
        icon: 'laptop',
      },
      {
        title: 'Business & Management',
        description:
          'Study management, entrepreneurship, communication, and professional business practice.',
        icon: 'briefcase',
      },
      {
        title: 'Science Foundations',
        description:
          'Build analytical thinking, scientific understanding, and foundational academic discipline.',
        icon: 'target',
      },
      {
        title: 'Professional Development',
        description:
          'Strengthen communication, workplace readiness, and applied skills for career progression.',
        icon: 'award',
      },
    ],
    journeyEyebrow: 'Academic journey',
    journeyTitle: 'From admission to achievement, every step is clear',
    journeyDescription:
      'The page flow mirrors what strong international education platforms do well: simplify the student journey and communicate confidence.',
    journeySteps: [
      {
        step: '01',
        title: 'Choose Your Pathway',
        description:
          'Review programs, learning focus areas, and the academic direction that best matches your goals.',
        icon: 'layers',
      },
      {
        step: '02',
        title: 'Register and Enroll',
        description:
          'Begin your academic journey through a clear admission and enrollment experience.',
        icon: 'calendar',
      },
      {
        step: '03',
        title: 'Learn and Progress',
        description:
          'Study through guided instruction, digital materials, and structured academic activities.',
        icon: 'bookcheck',
      },
      {
        step: '04',
        title: 'Graduate with Confidence',
        description:
          'Complete your pathway with stronger skills, knowledge, and readiness for the next step.',
        icon: 'graduation',
      },
    ],
    qualityEyebrow: 'Quality assurance',
    qualityTitle: 'Professional standards that support trustworthy academics',
    qualityDescription:
      'A premium Academics page should communicate not just beauty, but credibility. These elements reinforce that trust.',
    assuranceItems: [
      {
        title: 'Qualified Instruction',
        description:
          'Lecturers and academic staff support structured learning, guidance, and meaningful student progress.',
        icon: 'users',
      },
      {
        title: 'Clear Academic Structure',
        description:
          'Students follow organized modules, schedules, and progression expectations.',
        icon: 'clock',
      },
      {
        title: 'Practical Orientation',
        description:
          'Learning remains connected to problem-solving, employability, and real-world application.',
        icon: 'lightbulb',
      },
      {
        title: 'Integrity and Standards',
        description:
          'Assessment, feedback, and academic processes are guided by responsibility and professionalism.',
        icon: 'shield',
      },
    ],
    qualityImageUrl:
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80',
    qualityImageAlt: 'Students in a lecture setting showing academic excellence',
    qualityImageEyebrow: 'Trusted academic standards',
    qualityImageTitle: 'A premium academic environment built on structure, guidance, and quality.',
    qualityImageDescription:
      'From course organization to academic support and practical learning outcomes, the experience remains focused and dependable.',
    ctaEyebrow: 'Begin with confidence',
    ctaTitle: 'Explore academics, discover programs, and start learning with JCST.',
    ctaDescription:
      'Move from interest to action with a professional academic experience designed for both classroom and e-learning excellence.',
    ctaPrimaryLabel: 'Apply Now',
    ctaPrimaryUrl: '/admissions',
    ctaSecondaryLabel: 'View Programs',
    ctaSecondaryUrl: '/programs',
    ctaImageUrl:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80',
    ctaImageAlt: 'Students beginning their academic journey',
  },
};

const run = async () => {
  await connectDatabase();

  try {
    const filter = {
      type: academicsPage.type,
      slug: academicsPage.slug,
    } as Record<string, unknown>;

    const record = await WebsiteContentModel.updateOne(
      filter,
      {
        $set: academicsPage,
      } as Record<string, unknown>,
      {
        upsert: true,
        setDefaultsOnInsert: true,
      } as Record<string, unknown>,
    );

    logger.info(
      {
        matchedCount: record.matchedCount,
        modifiedCount: record.modifiedCount,
        upsertedCount: record.upsertedCount,
      },
      'Professional Academics page content was seeded successfully',
    );
  } catch (error) {
    logger.error({ err: error }, 'Failed to seed Academics page content');
    process.exitCode = 1;
  }
};

run()
  .catch((error) => {
    logger.error({ err: error }, 'Failed to run Academics page seed script');
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });