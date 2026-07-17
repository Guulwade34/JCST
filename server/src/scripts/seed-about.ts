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
};

const run = async () => {
  await connectDatabase();

  await WebsiteContentModel.findOneAndUpdate(
    {
      type: aboutPage.type,
      slug: aboutPage.slug,
    } as any,
    {
      $set: aboutPage,
    },
    {
      upsert: true,
      returnDocument: 'after',
      runValidators: true,
    },
  );

  logger.info(
    {
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
