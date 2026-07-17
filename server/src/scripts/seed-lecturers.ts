/* eslint-disable */
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { logger } from '../config/logger.js';
import { WebsiteContentModel } from '../modules/website/website-content.model.js';

const records = [
  {
    type: 'page',
    slug: 'lecturers',
    title: 'Professional Lecturers, Mentors, and Academic Guides',
    excerpt:
      'Meet JCST lecturers committed to quality teaching, practical learning, digital education, mentorship, and student success.',
    body:
      'JCST lecturers connect academic knowledge with practical competence, professional values, e-learning support, and student-centered guidance.',
    imageUrl:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=88',
    icon: 'users',
    order: 6,
    featured: true,
    published: true,
    metadata: {
      eyebrow: 'JCST Academic Faculty',
      heroImageUrl:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=88',
      heroImageAlt: 'Professional lecturer teaching students in a modern classroom',
      heroPrimaryLabel: 'Explore Courses',
      heroPrimaryUrl: '/courses',
      heroSecondaryLabel: 'Open E-Learning',
      heroSecondaryUrl: '/e-learning',
      heroCardTitle: 'Teaching with knowledge and purpose',
      heroCardDescription:
        'Our lecturers support classroom learning, practical activities, assessment, academic advising, mentorship, and connected e-learning experiences.',
      searchPlaceholder: 'Search lecturers, qualifications, or expertise...',
      resultsEyebrow: 'Academic Staff',
      cardActionLabel: 'View Lecturer Profile',
      emptyTitle: 'No lecturer profiles match your search',
      emptyDescription:
        'Try another lecturer name, department, qualification, or specialization.',
      ctaEyebrow: 'Learn with confidence',
      ctaTitle: 'Learn from educators committed to student progress.',
      ctaDescription:
        'Explore courses, choose a program, and begin your JCST learning journey with structured academic and digital support.',
      ctaPrimaryLabel: 'Explore Courses',
      ctaPrimaryUrl: '/courses',
      ctaSecondaryLabel: 'View Programs',
      ctaSecondaryUrl: '/programs',
      ctaImageUrl:
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=88',
      ctaImageAlt: 'Students learning with academic guidance',
      seoTitle: 'Lecturers and Academic Staff | JCST',
      seoDescription:
        'Meet JCST lecturers, review their qualifications, expertise, courses, teaching approach, and contact information.',
    },
  },
  {
    type: 'lecturer',
    slug: 'dr-aamina-hassan',
    title: 'Dr. Aamina Hassan',
    excerpt: 'Senior Lecturer in Information Technology and Digital Systems',
    body:
      'Dr. Aamina supports students in programming, databases, information systems, research methods, and digital transformation. Her teaching approach combines clear academic structure, practical application, guided projects, feedback, and e-learning resources.',
    imageUrl:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=88',
    icon: 'graduation',
    order: 1,
    featured: true,
    published: true,
    metadata: {
      qualification: 'PhD in Information Systems',
      department: 'computer-science',
      departmentLabel: 'Department of Computer Science and Technology',
      specialization: 'Information Technology and Data Systems',
      experienceYears: '10+ Years',
      imageAlt: 'JCST lecturer Dr. Aamina Hassan',
      heroDescription:
        'An experienced educator focused on technology, information systems, data management, digital learning, and student-centered professional development.',
      profileTitle: 'Technology education connected to practical competence',
      profileStatement:
        'Supporting students to understand systems, solve problems, build digital confidence, and apply technology responsibly.',
      teachingModel: 'Blended and Practical',
      teachingQuote:
        'Strong technology education helps students understand ideas, build solutions, and use digital tools responsibly.',
      email: 'aamina.hassan@jcst.edu.so',
      phone: '+252 61 0000000',
      expertise: [
        'Information Systems',
        'Database Management',
        'Programming Foundations',
        'Research Methods',
        'Digital Transformation',
        'E-Learning Design',
      ],
      researchInterests: [
        'Digital Education',
        'Data Management',
        'Information Systems Adoption',
        'Technology and Development',
      ],
      qualifications: [
        {
          title: 'PhD in Information Systems',
          institution: 'Academic institution to be confirmed',
          year: 'Official details pending',
        },
        {
          title: 'Master’s Degree in Information Technology',
          institution: 'Academic institution to be confirmed',
          year: 'Official details pending',
        },
      ],
      professionalExperience: [
        {
          title: 'Senior Lecturer in Information Technology',
          organization: 'Jubbaland College of Science and Technology',
          period: 'Current',
          description:
            'Supports technology teaching, curriculum delivery, practical learning, student mentorship, and e-learning development.',
        },
        {
          title: 'Information Systems Educator and Mentor',
          organization: 'Professional experience to be confirmed',
          period: 'Previous experience',
          description:
            'Worked with learners and professionals in information systems, data, digital tools, and applied technology.',
        },
      ],
      teachingPhilosophy:
        'Learning should be clear, practical, inclusive, and connected to real problems. Students benefit when explanation, practice, assessment, feedback, and digital access work together.',
      teachingMethods: [
        'Interactive Lectures',
        'Practical Demonstrations',
        'Guided Projects',
        'Problem-Based Learning',
        'Online Learning Resources',
        'Continuous Feedback',
      ],
      studentSupport: [
        'Academic Advising',
        'Project Guidance',
        'Office-Hour Support',
        'Assessment Feedback',
        'Study Planning',
        'Digital Learning Guidance',
      ],
      officeHours: {
        days: 'Sunday and Tuesday',
        time: '10:00 AM – 1:00 PM',
        location: 'Academic Office / Online',
      },
      ctaImageUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=88',
      ctaImageAlt: 'Students learning with technology and academic guidance',
    },
  },
  {
    type: 'lecturer',
    slug: 'mohamed-abdi-nur',
    title: 'Mohamed Abdi Nur',
    excerpt: 'Lecturer in Business, Management, and Entrepreneurship',
    body:
      'Mohamed supports students in management, entrepreneurship, leadership, organizational behaviour, and professional business development. His teaching emphasizes practical decision-making, teamwork, communication, and responsible enterprise.',
    imageUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1000&q=88',
    icon: 'briefcase',
    order: 2,
    featured: true,
    published: true,
    metadata: {
      qualification: 'Master of Business Administration',
      department: 'business-management',
      departmentLabel: 'Department of Business and Management',
      specialization: 'Management and Entrepreneurship',
      experienceYears: '8+ Years',
      imageAlt: 'JCST lecturer Mohamed Abdi Nur',
      heroDescription:
        'A business educator focused on management practice, entrepreneurship, leadership, communication, and professional readiness.',
      profileTitle: 'Business education connected to leadership and enterprise',
      profileStatement:
        'Helping students understand organizations, make responsible decisions, communicate effectively, and develop entrepreneurial confidence.',
      teachingModel: 'Case-Based and Practical',
      teachingQuote:
        'Business education becomes valuable when students can connect management ideas to real decisions, people, and opportunities.',
      email: 'mohamed.abdi@jcst.edu.so',
      phone: '+252 61 0000000',
      expertise: [
        'Principles of Management',
        'Entrepreneurship',
        'Strategic Thinking',
        'Organizational Behaviour',
        'Leadership',
        'Professional Communication',
      ],
      researchInterests: [
        'Small Business Development',
        'Youth Entrepreneurship',
        'Leadership Practice',
        'Organizational Performance',
      ],
      qualifications: [
        {
          title: 'Master of Business Administration',
          institution: 'Academic institution to be confirmed',
          year: 'Official details pending',
        },
        {
          title: 'Bachelor’s Degree in Business Administration',
          institution: 'Academic institution to be confirmed',
          year: 'Official details pending',
        },
      ],
      professionalExperience: [
        {
          title: 'Lecturer in Business and Management',
          organization: 'Jubbaland College of Science and Technology',
          period: 'Current',
          description:
            'Supports business teaching, entrepreneurship education, student projects, advising, and professional development.',
        },
        {
          title: 'Business Trainer and Mentor',
          organization: 'Professional experience to be confirmed',
          period: 'Previous experience',
          description:
            'Supported learners and emerging professionals in management, enterprise planning, communication, and leadership.',
        },
      ],
      teachingPhilosophy:
        'Students learn business best when concepts are connected to cases, decisions, teamwork, communication, reflection, and practical enterprise challenges.',
      teachingMethods: [
        'Case Studies',
        'Business Simulations',
        'Group Projects',
        'Presentations',
        'Entrepreneurship Exercises',
        'Guided Reflection',
      ],
      studentSupport: [
        'Business Project Guidance',
        'Presentation Coaching',
        'Entrepreneurship Mentorship',
        'Academic Advising',
        'Assessment Feedback',
        'Career Readiness Support',
      ],
      officeHours: {
        days: 'Monday and Wednesday',
        time: '9:00 AM – 12:00 PM',
        location: 'Business Department / Online',
      },
      ctaImageUrl:
        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=88',
      ctaImageAlt: 'Business students collaborating on professional projects',
    },
  },
  {
    type: 'lecturer',
    slug: 'sahra-ali',
    title: 'Sahra Ali',
    excerpt: 'Lecturer in Public Health and Community Health',
    body:
      'Sahra supports students in community health, health promotion, public-health planning, communication, and responsible community engagement. Her teaching combines academic understanding, practical examples, ethical awareness, and community-focused learning.',
    imageUrl:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=88',
    icon: 'health',
    order: 3,
    featured: true,
    published: true,
    metadata: {
      qualification: 'Master of Public Health',
      department: 'health-sciences',
      departmentLabel: 'Department of Health Sciences',
      specialization: 'Community Health and Health Promotion',
      experienceYears: '7+ Years',
      imageAlt: 'JCST lecturer Sahra Ali',
      heroDescription:
        'A health educator focused on community health, health promotion, public-health planning, communication, ethics, and service.',
      profileTitle: 'Health education connected to communities and responsible service',
      profileStatement:
        'Supporting students to understand health needs, communicate clearly, plan responsibly, and contribute to community wellbeing.',
      teachingModel: 'Community-Focused and Applied',
      teachingQuote:
        'Health education should help students understand communities, communicate responsibly, and turn knowledge into meaningful service.',
      email: 'sahra.ali@jcst.edu.so',
      phone: '+252 61 0000000',
      expertise: [
        'Community Health',
        'Health Promotion',
        'Public-Health Planning',
        'Health Communication',
        'Community Engagement',
        'Monitoring and Evaluation',
      ],
      researchInterests: [
        'Community Health Education',
        'Health Promotion Practice',
        'Public-Health Communication',
        'Community-Based Programs',
      ],
      qualifications: [
        {
          title: 'Master of Public Health',
          institution: 'Academic institution to be confirmed',
          year: 'Official details pending',
        },
        {
          title: 'Bachelor’s Degree in a Health-Related Field',
          institution: 'Academic institution to be confirmed',
          year: 'Official details pending',
        },
      ],
      professionalExperience: [
        {
          title: 'Lecturer in Public Health',
          organization: 'Jubbaland College of Science and Technology',
          period: 'Current',
          description:
            'Supports health-sciences teaching, community-focused learning, student advising, assessment, and practical preparation.',
        },
        {
          title: 'Community Health Educator',
          organization: 'Professional experience to be confirmed',
          period: 'Previous experience',
          description:
            'Supported health communication, awareness, community engagement, and public-health learning activities.',
        },
      ],
      teachingPhilosophy:
        'Health learning should be ethical, practical, evidence-informed, and connected to the needs of communities. Students grow through discussion, cases, guided activities, and reflection.',
      teachingMethods: [
        'Community Case Studies',
        'Health Communication Practice',
        'Guided Discussions',
        'Field Preparation',
        'Group Projects',
        'Reflective Learning',
      ],
      studentSupport: [
        'Academic Advising',
        'Field Preparation Guidance',
        'Community Project Support',
        'Assessment Feedback',
        'Health Communication Coaching',
        'Study Planning',
      ],
      officeHours: {
        days: 'Sunday and Thursday',
        time: '11:00 AM – 2:00 PM',
        location: 'Health Sciences Office / Online',
      },
      ctaImageUrl:
        'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1600&q=88',
      ctaImageAlt: 'Health professionals and students working together',
    },
  },
];

const run = async () => {
  await connectDatabase();

  try {
    for (const record of records) {
      await WebsiteContentModel.findOneAndUpdate(
        { type: record.type, slug: record.slug } as any,
        { $set: record } as any,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );
    }

    logger.info(
      { count: records.length },
      'Lecturers page and detailed lecturer records were seeded successfully',
    );
  } catch (error) {
    logger.error(
      { err: error },
      'Failed to seed Lecturers page and lecturer records',
    );
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
};

void run();