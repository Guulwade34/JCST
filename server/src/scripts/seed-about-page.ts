/* eslint-disable */
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { logger } from '../config/logger.js';
import { WebsiteContentModel } from '../modules/website/website-content.model.js';

const aboutPage = {
  type: 'page',
  slug: 'about',
  title: 'About Jubbaland College of Science and Technology',
  excerpt:
    'A modern higher education institution providing quality, affordable, competency-based, and career-oriented education in Belet-Hawa, Somalia.',
  body:
    'Jubbaland College of Science and Technology was established in 2025 to equip students with academic knowledge, practical skills, professional confidence, and ethical values required to contribute to national development. JCST offers diploma and professional programs designed for the modern labor market while advancing academic excellence, innovation, entrepreneurship, research, and community service.',
  imageUrl:
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=88',
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
      'Discover a modern college committed to practical education, ethical leadership, innovation, and national development.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=88',
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
        value: 'Diploma Programs',
        label: 'Career-Focused Study',
        icon: 'graduation',
      },
      {
        value: 'Practical Learning',
        label: 'Competency-Based',
        icon: 'book',
      },
      {
        value: 'Somalia & Beyond',
        label: 'Graduate Ready',
        icon: 'globe',
      },
    ],

    storyEyebrow: 'Who We Are',
    storyTitle: 'An institution shaped by purpose, opportunity, and service',
    storyDescription:
      'Established in 2025 in Belet-Hawa, JCST provides affordable, career-oriented education that combines knowledge, practical skills, and ethical values.',
    storyImageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=88',
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
          'Relevant and supportive learning opportunities for students.',
        icon: 'users',
      },
      {
        title: 'Career Orientation',
        description:
          'Programs aligned with professional and labor-market needs.',
        icon: 'briefcase',
      },
      {
        title: 'Ethical Leadership',
        description:
          'A culture of integrity, responsibility, discipline, and service.',
        icon: 'shield',
      },
      {
        title: 'National Development',
        description:
          'Graduates prepared to contribute to sustainable development.',
        icon: 'globe',
      },
    ],

    directionEyebrow: 'Our Direction',
    directionTitle: 'A clear mission and an ambitious vision',
    directionDescription:
      'JCST is guided by accessible learning, practical excellence, innovation, ethical leadership, and social impact.',
    missionEyebrow: 'Our Mission',
    missionTitle: 'Education that empowers people and communities',
    missionBody:
      'To provide accessible, high-quality, competency-based education through innovative teaching, practical training, research, and community engagement, preparing students to become ethical professionals and leaders.',
    visionEyebrow: 'Our Vision',
    visionTitle: 'A leading center of excellence in Somalia',
    visionBody:
      'To become a leading center of excellence in science, technology, business, and professional education in Somalia, known for innovation and competent graduates.',

    valuesEyebrow: 'Our Core Values',
    valuesTitle: 'The principles that guide every part of JCST',
    valuesDescription:
      'These principles guide our teaching, leadership, partnerships, and service to society.',
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
      'Qualified instructors, practical training, modern teaching, and community partnerships prepare students for professional success.',
    approachItems: [
      {
        title: 'Qualified Instructors',
        description:
          'Educators who connect knowledge with guidance and mentorship.',
        icon: 'graduation',
      },
      {
        title: 'Practical Training',
        description:
          'Applied learning that builds competence and workplace readiness.',
        icon: 'briefcase',
      },
      {
        title: 'Modern Teaching',
        description:
          'Student-centered methods supported by technology and critical thinking.',
        icon: 'innovation',
      },
      {
        title: 'Community Partnerships',
        description:
          'Partnerships that connect education with real community needs.',
        icon: 'handshake',
      },
    ],
    approachImageUrl:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=88',
    approachImageAlt:
      'Lecturer guiding students during an interactive college class',
    impactEyebrow: 'Education with Purpose',
    impactTitle: 'Preparing graduates for meaningful contribution',
    impactItems: [
      'Academic excellence supported by practical competence.',
      'Innovation and responsible problem-solving.',
      'Graduates prepared for national and international opportunities.',
    ],
    impactCardEyebrow: 'Graduate Outcome',
    impactCardTitle: 'Skilled, ethical, confident, and community-minded.',

    ctaEyebrow: 'Become Part of JCST',
    ctaTitle: 'Build your future through knowledge, skills, and purpose',
    ctaDescription:
      'Explore our programs or begin your admission journey today.',
    ctaPrimaryLabel: 'Apply Now',
    ctaPrimaryUrl: '/apply',
    ctaSecondaryLabel: 'Explore Programs',
    ctaSecondaryUrl: '/programs',
    ctaImageUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=88',
    ctaImageAlt:
      'Students learning and collaborating at college',
  },
};

const run = async () => {
  await connectDatabase();

  const filter = {
    type: aboutPage.type,
    slug: aboutPage.slug,
  } as Record<string, unknown>;

  const record = await WebsiteContentModel.updateOne(
    filter,
    {
      $set: aboutPage,
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
      type: aboutPage.type,
      slug: aboutPage.slug,
    },
    'Professional About page content was seeded successfully',
  );
};

run()
  .catch((error) => {
    logger.error(
      {
        err: error,
      },
      'Failed to seed the professional About page content',
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });