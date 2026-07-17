/* eslint-disable */
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { logger } from '../config/logger.js';
import { WebsiteContentModel } from '../modules/website/website-content.model.js';

const records = [
  {
    type: 'page',
    slug: 'departments',
    title: 'Academic Departments Built Around Knowledge, Skills, and Service',
    excerpt:
      'Explore JCST academic departments, connected programs, courses, lecturers, learning facilities, e-learning support, and professional pathways.',
    body:
      'JCST departments organize academic leadership, curriculum delivery, student support, practical learning, and digital education across focused areas of study.',
    imageUrl:
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=88',
    icon: 'building',
    order: 3,
    featured: true,
    published: true,
    metadata: {
      eyebrow: 'JCST Academic Departments',
      imageAlt: 'Modern higher education campus and academic building',
      departmentCountLabel: 'Academic departments',
      programCountLabel: 'Published programs',
      courseCountLabel: 'Published courses',
      lecturerCountLabel: 'Academic staff',
      searchPlaceholder: 'Search departments, disciplines, or study areas...',
      resultsEyebrow: 'Academic Units',
      cardActionLabel: 'View Department Details',
      emptyTitle: 'No departments match your search',
      emptyDescription:
        'Reset the filter or search using another academic area, department name, or discipline.',
      ctaEyebrow: 'Find your academic direction',
      ctaTitle: 'Explore programs, courses, and e-learning pathways across JCST.',
      ctaDescription:
        'Choose a department, review its full academic offering, and begin a learning journey connected to professional goals.',
      ctaPrimaryLabel: 'Explore Programs',
      ctaPrimaryUrl: '/programs',
      ctaSecondaryLabel: 'Open E-Learning',
      ctaSecondaryUrl: '/e-learning',
      ctaImageUrl:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=88',
      ctaImageAlt: 'Students learning in a modern academic environment',
      seoTitle: 'Academic Departments | JCST',
      seoDescription:
        'Explore JCST departments, programs, courses, lecturers, facilities, career pathways, and e-learning support.',
    },
  },
  {
    type: 'department',
    slug: 'computer-science',
    title: 'Department of Computer Science and Technology',
    excerpt:
      'Software development, information systems, databases, networking, cybersecurity, digital skills, and technology innovation.',
    body:
      'The Department of Computer Science and Technology prepares students to understand, design, build, secure, and manage modern digital solutions. Learning combines academic foundations, practical laboratories, project work, guided e-learning, ethical computing, and professional readiness.',
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=88',
    icon: 'laptop',
    order: 1,
    featured: true,
    published: true,
    metadata: {
      code: 'DCST',
      aliases: ['computer-science'],
      focusArea: 'Computing and Digital Technology',
      imageAlt: 'Students learning computing and digital technology',
      overviewTitle: 'Technology education connected to practical problem-solving',
      overviewImageUrl:
        'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1400&q=88',
      overviewImageAlt: 'Students collaborating with computers in a modern laboratory',
      mission:
        'To provide accessible, practical, and ethical computing education that develops technical competence, creativity, problem-solving ability, and responsible digital leadership.',
      vision:
        'To become a recognized center for computing, digital innovation, and technology-focused professional education in Somalia.',
      heroCardTitle: 'Digital learning with professional purpose',
      heroCardDescription:
        'Students build technical knowledge through structured courses, practical exercises, projects, academic guidance, and connected e-learning resources.',
      highlights: [
        'Programming, databases, systems, networks, and cybersecurity foundations.',
        'Practical laboratories, projects, digital resources, and e-learning activities.',
        'Professional ethics, teamwork, communication, and problem-solving.',
        'Preparation for further study, employment, entrepreneurship, and innovation.',
      ],
      facilitiesDescription:
        'The department supports practical and digital learning through technology-enabled spaces and organized academic resources.',
      facilities: [
        {
          title: 'Computer Laboratory',
          description: 'Practical computing, programming, systems, and digital-skills activities.',
          icon: 'laptop',
        },
        {
          title: 'E-Learning Environment',
          description: 'Course materials, assignments, assessments, and guided digital learning.',
          icon: 'monitor',
        },
        {
          title: 'Project Workspace',
          description: 'Collaborative design, software, research, and student project development.',
          icon: 'users',
        },
        {
          title: 'Digital Library Access',
          description: 'Approved academic references, guides, and online learning resources.',
          icon: 'book',
        },
      ],
      careerDescription:
        'Graduates and learners may progress toward technical support, software, information systems, database, network, digital-service, and technology-management roles.',
      careerPathways: [
        'Software and Web Development',
        'Database and Information Systems',
        'IT Support and Systems Administration',
        'Networking and Cybersecurity Support',
        'Digital Services and Technology Operations',
        'Technology Entrepreneurship',
      ],
      careerImageUrl:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=88',
      careerImageAlt: 'Technology professionals collaborating on a digital project',
      head: {
        name: 'Head of Computer Science and Technology',
        title: 'Department Head',
        email: 'computing@jcst.edu.so',
        phone: '+252 61 0000000',
        bio: 'The department head coordinates academic quality, teaching delivery, student support, curriculum implementation, laboratories, projects, and technology-focused partnerships.',
      },
      ctaImageUrl:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=88',
      ctaImageAlt: 'Students developing technology skills together',
    },
  },
  {
    type: 'department',
    slug: 'business-management',
    title: 'Department of Business and Management',
    excerpt:
      'Management, entrepreneurship, accounting foundations, leadership, organizational development, and professional business practice.',
    body:
      'The Department of Business and Management develops analytical, ethical, entrepreneurial, and professionally confident learners. Academic study connects management theory, practical planning, communication, teamwork, digital business tools, and real organizational challenges.',
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=88',
    icon: 'briefcase',
    order: 2,
    featured: true,
    published: true,
    metadata: {
      code: 'DBM',
      aliases: ['business-management', 'business-administration'],
      focusArea: 'Business, Leadership and Entrepreneurship',
      imageAlt: 'Business students collaborating in a professional learning environment',
      overviewTitle: 'Business education focused on leadership, enterprise, and responsible management',
      overviewImageUrl:
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=88',
      overviewImageAlt: 'Business students working together on a project',
      mission:
        'To develop ethical and capable business professionals through quality teaching, practical learning, entrepreneurship, digital tools, and community engagement.',
      vision:
        'To become a trusted center for business, management, entrepreneurship, and professional leadership education in Somalia.',
      heroCardTitle: 'Professional business learning for modern organizations',
      heroCardDescription:
        'Students strengthen decision-making, communication, planning, leadership, entrepreneurship, and responsible management through classroom and e-learning experiences.',
      highlights: [
        'Management, entrepreneurship, leadership, and organizational practice.',
        'Business communication, analysis, teamwork, and professional confidence.',
        'Practical projects, case studies, presentations, and e-learning activities.',
        'Preparation for employment, enterprise development, and further study.',
      ],
      facilitiesDescription:
        'The department uses collaborative spaces, digital resources, case studies, and presentation-based learning to support professional development.',
      facilities: [
        {
          title: 'Business Learning Room',
          description: 'Interactive teaching, case analysis, presentations, and group activities.',
          icon: 'building',
        },
        {
          title: 'Entrepreneurship Hub',
          description: 'Idea development, business planning, teamwork, and enterprise practice.',
          icon: 'briefcase',
        },
        {
          title: 'E-Learning Resources',
          description: 'Digital readings, assignments, quizzes, feedback, and academic support.',
          icon: 'monitor',
        },
        {
          title: 'Presentation Space',
          description: 'Professional communication, pitching, teamwork, and leadership practice.',
          icon: 'users',
        },
      ],
      careerDescription:
        'Business and management study supports pathways in administration, entrepreneurship, operations, supervision, project support, customer service, and organizational development.',
      careerPathways: [
        'Business Administration',
        'Entrepreneurship and Small Enterprise',
        'Operations and Office Management',
        'Sales and Customer Service',
        'Project and Program Support',
        'Leadership and Organizational Development',
      ],
      careerImageUrl:
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=88',
      careerImageAlt: 'Business professionals collaborating in a modern workplace',
      head: {
        name: 'Head of Business and Management',
        title: 'Department Head',
        email: 'business@jcst.edu.so',
        phone: '+252 61 0000000',
        bio: 'The department head supports academic planning, teaching quality, entrepreneurship activities, student guidance, professional partnerships, and continuous program improvement.',
      },
      ctaImageUrl:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=88',
      ctaImageAlt: 'Business students discussing professional plans',
    },
  },
  {
    type: 'department',
    slug: 'health-sciences',
    title: 'Department of Health Sciences',
    excerpt:
      'Community health, health promotion, public-health foundations, prevention, evidence-based learning, and responsible service.',
    body:
      'The Department of Health Sciences prepares learners to understand health needs, promote prevention, communicate responsibly, support community wellbeing, and apply introductory public-health knowledge through academic, practical, field-based, and e-learning activities.',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=88',
    icon: 'health',
    order: 3,
    featured: true,
    published: true,
    metadata: {
      code: 'DHS',
      aliases: ['health-sciences', 'public-health'],
      focusArea: 'Public Health and Community Wellbeing',
      imageAlt: 'Health sciences students learning in a professional environment',
      overviewTitle: 'Health education connected to prevention, service, and community responsibility',
      overviewImageUrl:
        'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1400&q=88',
      overviewImageAlt: 'Health professionals collaborating during a learning activity',
      mission:
        'To provide practical, ethical, and community-focused health education that develops knowledge, communication, prevention skills, and responsible service.',
      vision:
        'To become a respected center for public-health, community-health, and health-support education that contributes positively to society.',
      heroCardTitle: 'Health learning focused on prevention and community impact',
      heroCardDescription:
        'Students learn through structured teaching, practical demonstrations, case analysis, field preparation, communication activities, and digital academic resources.',
      highlights: [
        'Community-health, prevention, health-promotion, and public-health foundations.',
        'Communication, ethics, teamwork, observation, and community responsibility.',
        'Practical demonstrations, case studies, field preparation, and e-learning.',
        'Preparation for service-oriented roles, further study, and community programs.',
      ],
      facilitiesDescription:
        'The department uses practical teaching spaces, demonstration resources, digital materials, and supervised community-learning preparation.',
      facilities: [
        {
          title: 'Health Demonstration Space',
          description: 'Guided practical activities, health communication, safety, and basic demonstrations.',
          icon: 'health',
        },
        {
          title: 'Community Learning Resources',
          description: 'Case studies, assessment tools, communication materials, and planning guides.',
          icon: 'users',
        },
        {
          title: 'E-Learning Support',
          description: 'Digital readings, quizzes, assignments, and structured learning activities.',
          icon: 'monitor',
        },
        {
          title: 'Field Preparation Area',
          description: 'Planning, teamwork, ethics, observation, and community-engagement preparation.',
          icon: 'building',
        },
      ],
      careerDescription:
        'Health-sciences learning supports community-health, health-promotion, project-support, outreach, data-support, and further-study pathways.',
      careerPathways: [
        'Community Health Support',
        'Health Promotion and Education',
        'Public-Health Program Support',
        'Community Outreach and Mobilization',
        'Health Data and Monitoring Support',
        'Further Health and Public-Health Study',
      ],
      careerImageUrl:
        'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1400&q=88',
      careerImageAlt: 'Health professionals working together in a community-focused setting',
      head: {
        name: 'Head of Health Sciences',
        title: 'Department Head',
        email: 'health@jcst.edu.so',
        phone: '+252 61 0000000',
        bio: 'The department head coordinates health-sciences teaching, practical learning, student support, field preparation, ethical standards, and community-focused academic partnerships.',
      },
      ctaImageUrl:
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=88',
      ctaImageAlt: 'Health science students preparing for responsible community service',
    },
  },
];

const run = async () => {
  await connectDatabase();

  try {
    for (const record of records) {
      const filter = { type: record.type, slug: record.slug } as any;

      await WebsiteContentModel.findOneAndUpdate(
        filter,
        { $set: record as any },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );
    }

    logger.info(
      { count: records.length },
      'Departments page and detailed department records were seeded successfully',
    );
  } catch (error) {
    logger.error(
      { err: error },
      'Failed to seed Departments page and department records',
    );
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
};

void run();