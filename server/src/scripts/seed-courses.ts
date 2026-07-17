/* eslint-disable */
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { logger } from '../config/logger.js';
import { WebsiteContentModel } from '../modules/website/website-content.model.js';

type CourseSeed = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  order: number;
  code: string;
  program: string;
  department: string;
  credits: number;
  semester: string;
  level: string;
  courseType: string;
  contactHours: string;
  deliveryModes: string[];
  prerequisites: string[];
  highlights: string[];
  learningOutcomes: string[];
  modules: Array<{
    week: string;
    title: string;
    description: string;
    topics: string[];
  }>;
  assessments: Array<{
    title: string;
    weight: number;
    description: string;
  }>;
  teachingMethods: string[];
  learningActivities: string[];
  resources: string[];
  schedule: Array<{ label: string; value: string }>;
  instructor: {
    name: string;
    title: string;
    email: string;
    phone: string;
    bio: string;
  };
};

const coursesPage = {
  type: 'page',
  slug: 'courses',
  title: 'Explore Courses Designed for Real Learning',
  excerpt:
    'Browse structured, practical, and e-learning-enabled courses across JCST academic programs and departments.',
  body:
    'JCST courses connect academic theory, practical learning, continuous assessment, digital resources, instructor guidance, and professional outcomes. Search and filter the catalogue to find complete course information.',
  imageUrl:
    'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1600&q=88',
  icon: 'book',
  order: 5,
  featured: true,
  published: true,
  metadata: {
    eyebrow: 'JCST Course Catalogue',
    imageAlt: 'Students studying in a modern academic library',
    heroHighlights: [
      'Complete course descriptions and learning outcomes',
      'Structured modules, assessments, and study resources',
      'On-campus and e-learning delivery information',
    ],
    courseCountLabel: 'Published courses',
    deliveryValue: 'Blended',
    deliveryLabel: 'Flexible delivery',
    creditValue: '3 Credits',
    creditLabel: 'Typical course value',
    supportValue: 'Guided',
    supportLabel: 'Instructor support',
    searchPlaceholder: 'Search courses, codes, programs, lecturers...',
    resultsLabel: 'courses found',
    filtersTitle: 'Filter Courses',
    programFilterLabel: 'Program',
    departmentFilterLabel: 'Department',
    semesterFilterLabel: 'Semester',
    deliveryFilterLabel: 'Delivery Mode',
    cardActionLabel: 'View Course Details',
    emptyTitle: 'No courses match your filters',
    emptyDescription:
      'Reset the filters or search using a different course title, code, program, department, semester, or lecturer.',
    ctaEyebrow: 'Build your academic pathway',
    ctaTitle: 'Find the right program and continue learning with JCST',
    ctaDescription:
      'Explore the full academic programs connected to these courses or access the JCST e-learning platform.',
    ctaPrimaryLabel: 'Explore Programs',
    ctaPrimaryUrl: '/programs',
    ctaSecondaryLabel: 'Open E-Learning',
    ctaSecondaryUrl: '/e-learning',
    ctaImageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=88',
    ctaImageAlt: 'Students using digital learning resources',
    seoTitle: 'Academic Courses | JCST',
    seoDescription:
      'Explore JCST course descriptions, modules, learning outcomes, assessments, instructors, schedules, resources, and e-learning availability.',
  },
};

const createCourseRecord = (course: CourseSeed) => ({
  type: 'course',
  slug: course.slug,
  title: course.title,
  excerpt: course.excerpt,
  body: course.body,
  imageUrl: course.imageUrl,
  icon: 'book',
  order: course.order,
  featured: course.order <= 4,
  published: true,
  metadata: {
    code: course.code,
    imageAlt: `${course.title} course at JCST`,
    program: course.program,
    department: course.department,
    credits: course.credits,
    semester: course.semester,
    level: course.level,
    courseType: course.courseType,
    contactHours: course.contactHours,
    deliveryModes: course.deliveryModes,
    eLearningEnabled: true,
    overviewTitle: `A structured and practical introduction to ${course.title}`,
    prerequisites: course.prerequisites,
    highlights: course.highlights,
    learningOutcomes: course.learningOutcomes,
    modules: course.modules,
    assessments: course.assessments,
    teachingMethods: course.teachingMethods,
    learningActivities: course.learningActivities,
    resources: course.resources,
    schedule: course.schedule,
    instructor: course.instructor,
    ctaImageUrl: course.imageUrl,
  },
});

const sharedAssessments = [
  {
    title: 'Assignments and Quizzes',
    weight: 20,
    description:
      'Individual exercises, short quizzes, and guided tasks completed throughout the semester.',
  },
  {
    title: 'Practical or Project Work',
    weight: 25,
    description:
      'Applied activities, demonstrations, reports, presentations, or course projects.',
  },
  {
    title: 'Mid-Semester Examination',
    weight: 20,
    description:
      'A formal assessment of core knowledge and skills covered during the first part of the course.',
  },
  {
    title: 'Final Examination',
    weight: 35,
    description:
      'A comprehensive examination covering the approved course learning outcomes.',
  },
];

const sharedMethods = [
  'Interactive lectures and guided explanations.',
  'Tutorials, demonstrations, and structured classroom discussion.',
  'E-learning resources, assignments, and progress activities.',
  'Individual practice and collaborative group work.',
];

const sharedActivities = [
  'Weekly reading, note-taking, and guided review.',
  'Practical exercises linked to realistic academic or professional situations.',
  'Discussion activities, presentations, quizzes, and feedback.',
  'Independent study using approved digital and library resources.',
];

const sharedSchedule = [
  { label: 'Semester', value: 'Published according to the official academic calendar' },
  { label: 'Weekly Sessions', value: 'Two lecture or tutorial sessions plus guided independent study' },
  { label: 'E-Learning', value: 'Course materials and activities available through the JCST platform' },
  { label: 'Assessment Dates', value: 'Displayed in the course calendar and communicated by the instructor' },
];

const courses: CourseSeed[] = [
  {
    slug: 'introduction-to-information-technology',
    title: 'Introduction to Information Technology',
    excerpt:
      'Build a strong foundation in computer systems, digital technologies, information management, cybersecurity awareness, and professional IT practice.',
    body:
      'This course introduces the role of information technology in education, organizations, communication, public service, and modern professional work. Students examine computer hardware, software, operating systems, networks, data, cloud services, cybersecurity, responsible digital behavior, and emerging technologies through classroom and e-learning activities.',
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=88',
    order: 1,
    code: 'BIT101',
    program: 'bachelor-information-technology',
    department: 'computer-science',
    credits: 3,
    semester: 'Semester 1',
    level: 'Year 1',
    courseType: 'Core',
    contactHours: '45 Hours',
    deliveryModes: ['On-campus', 'Blended'],
    prerequisites: ['No formal prerequisite.', 'Basic computer awareness is recommended.'],
    highlights: [
      'Computer hardware, software, operating systems, and digital services.',
      'Data, networks, cloud computing, and introductory cybersecurity.',
      'Responsible technology use, digital citizenship, privacy, and professional ethics.',
      'Practical computer use supported by JCST e-learning resources.',
    ],
    learningOutcomes: [
      'Explain the basic components and functions of modern computer systems.',
      'Differentiate hardware, software, operating systems, networks, and cloud services.',
      'Use common digital tools responsibly and efficiently for academic work.',
      'Describe basic data management, privacy, cybersecurity, and ethical principles.',
      'Identify current and emerging applications of information technology.',
      'Communicate introductory technical concepts using appropriate terminology.',
    ],
    modules: [
      {
        week: 'Weeks 1–2',
        title: 'Foundations of Information Technology',
        description: 'Introduction to computing, information systems, digital transformation, and the role of IT in society.',
        topics: ['Computing concepts', 'Information systems', 'Digital transformation', 'Technology careers'],
      },
      {
        week: 'Weeks 3–4',
        title: 'Computer Hardware and Software',
        description: 'Core hardware components, software categories, system performance, storage, and peripheral devices.',
        topics: ['CPU and memory', 'Storage', 'Input and output', 'System and application software'],
      },
      {
        week: 'Weeks 5–6',
        title: 'Operating Systems and Applications',
        description: 'Operating-system functions, file management, common applications, and user productivity.',
        topics: ['Windows and Linux basics', 'File systems', 'Application software', 'Accessibility'],
      },
      {
        week: 'Weeks 7–8',
        title: 'Data, Networks, and the Internet',
        description: 'How data is represented, stored, shared, and transmitted across local and global networks.',
        topics: ['Data representation', 'Network basics', 'Internet services', 'Cloud computing'],
      },
      {
        week: 'Weeks 9–10',
        title: 'Cybersecurity and Digital Responsibility',
        description: 'Threat awareness, safe practices, privacy, data protection, professional behavior, and digital ethics.',
        topics: ['Common threats', 'Passwords', 'Privacy', 'Digital citizenship'],
      },
      {
        week: 'Weeks 11–12',
        title: 'Emerging Technologies and Review',
        description: 'Introductory exploration of artificial intelligence, automation, mobile systems, and future technology trends.',
        topics: ['Artificial intelligence', 'Automation', 'Mobile technologies', 'Course review'],
      },
    ],
    assessments: sharedAssessments,
    teachingMethods: sharedMethods,
    learningActivities: sharedActivities,
    resources: [
      'Instructor-provided lecture notes and course slides.',
      'JCST e-learning readings, demonstrations, quizzes, and discussion activities.',
      'Access to a computer with common productivity and internet software.',
      'Recommended introductory information technology textbooks and online references.',
    ],
    schedule: sharedSchedule,
    instructor: {
      name: 'Course Instructor',
      title: 'Information Technology Lecturer',
      email: 'computing@jcst.edu.so',
      phone: '+252 61 0000000',
      bio: 'The instructor supports students through classroom teaching, practical demonstrations, academic guidance, and structured e-learning activities.',
    },
  },
  {
    slug: 'introduction-to-programming',
    title: 'Introduction to Programming',
    excerpt:
      'Learn problem-solving, algorithms, variables, decisions, loops, functions, arrays, debugging, and the foundations of writing reliable programs.',
    body:
      'This course develops foundational programming and computational-thinking skills. Students learn to analyze simple problems, design algorithms, write structured programs, test solutions, interpret errors, and document code. Practical exercises and e-learning activities reinforce each concept.',
    imageUrl:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=88',
    order: 2,
    code: 'BIT103',
    program: 'bachelor-information-technology',
    department: 'computer-science',
    credits: 3,
    semester: 'Semester 1',
    level: 'Year 1',
    courseType: 'Core',
    contactHours: '60 Hours',
    deliveryModes: ['Computer Lab', 'Blended'],
    prerequisites: ['Basic computer literacy.', 'Elementary mathematics and logical reasoning.'],
    highlights: [
      'Algorithms, pseudocode, flowcharts, and computational thinking.',
      'Variables, data types, operators, input, output, and program structure.',
      'Conditional statements, loops, functions, arrays, and basic file handling.',
      'Testing, debugging, documentation, and practical programming assignments.',
    ],
    learningOutcomes: [
      'Analyze simple problems and express solutions using algorithms and pseudocode.',
      'Write programs using variables, operators, input, output, and control structures.',
      'Apply conditional statements and loops to solve structured problems.',
      'Create reusable functions and work with basic collections or arrays.',
      'Test, debug, document, and improve small programs.',
      'Demonstrate responsible coding practice and independent problem-solving.',
    ],
    modules: [
      {
        week: 'Weeks 1–2',
        title: 'Problem-Solving and Algorithms',
        description: 'Computational thinking, problem decomposition, algorithms, pseudocode, and flowcharts.',
        topics: ['Problem analysis', 'Algorithms', 'Pseudocode', 'Flowcharts'],
      },
      {
        week: 'Weeks 3–4',
        title: 'Programming Fundamentals',
        description: 'Development environments, program structure, variables, data types, input, output, and operators.',
        topics: ['IDE setup', 'Variables', 'Data types', 'Operators'],
      },
      {
        week: 'Weeks 5–6',
        title: 'Selection and Decision Making',
        description: 'Boolean expressions, conditional statements, nested decisions, and validation.',
        topics: ['Conditions', 'If statements', 'Nested selection', 'Validation'],
      },
      {
        week: 'Weeks 7–8',
        title: 'Iteration and Repetition',
        description: 'Counter-controlled, condition-controlled, and nested loops for repeated processing.',
        topics: ['For loops', 'While loops', 'Nested loops', 'Loop design'],
      },
      {
        week: 'Weeks 9–10',
        title: 'Functions and Collections',
        description: 'Reusable functions, parameters, return values, scope, arrays, and basic lists.',
        topics: ['Functions', 'Parameters', 'Scope', 'Arrays'],
      },
      {
        week: 'Weeks 11–12',
        title: 'Testing, Debugging, and Mini Project',
        description: 'Error types, testing strategies, debugging tools, documentation, and an integrated programming project.',
        topics: ['Syntax errors', 'Logic errors', 'Testing', 'Mini project'],
      },
    ],
    assessments: sharedAssessments,
    teachingMethods: [
      'Short lectures followed by live coding demonstrations.',
      'Guided computer-laboratory exercises and programming practice.',
      'E-learning examples, code challenges, quizzes, and feedback.',
      'Individual and group problem-solving activities.',
    ],
    learningActivities: [
      'Write and test programs during supervised laboratory sessions.',
      'Complete weekly coding exercises and short debugging tasks.',
      'Explain algorithms using pseudocode, diagrams, and code comments.',
      'Develop a small final program that integrates core concepts.',
    ],
    resources: [
      'A computer with the approved programming environment.',
      'Instructor code examples, laboratory worksheets, and e-learning exercises.',
      'Approved introductory programming textbook or online reference.',
      'Versioned copies of student exercises and project work.',
    ],
    schedule: sharedSchedule,
    instructor: {
      name: 'Programming Lecturer',
      title: 'Software Development Instructor',
      email: 'programming@jcst.edu.so',
      phone: '+252 61 0000000',
      bio: 'The instructor guides students through step-by-step coding practice, debugging, feedback, and project-based learning.',
    },
  },
  {
    slug: 'database-systems-one',
    title: 'Database Systems I',
    excerpt:
      'Study data modeling, relational databases, SQL, normalization, integrity, transactions, security, and practical database design.',
    body:
      'This course introduces the principles and practical skills required to design, create, query, and manage relational databases. Students translate organizational requirements into data models, implement schemas, write SQL queries, apply normalization, protect data integrity, and build a small database project.',
    imageUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=88',
    order: 3,
    code: 'BIT202',
    program: 'bachelor-information-technology',
    department: 'computer-science',
    credits: 3,
    semester: 'Semester 3',
    level: 'Year 2',
    courseType: 'Core',
    contactHours: '60 Hours',
    deliveryModes: ['Computer Lab', 'Blended'],
    prerequisites: ['Introduction to Programming or equivalent.', 'Basic information-technology knowledge.'],
    highlights: [
      'Database concepts, relational models, entities, relationships, and constraints.',
      'SQL data definition, manipulation, querying, joins, grouping, and subqueries.',
      'Normalization, integrity, transactions, security, backup, and recovery concepts.',
      'A practical database design and implementation project.',
    ],
    learningOutcomes: [
      'Explain the purpose, components, and architecture of database systems.',
      'Analyze requirements and create entity-relationship and relational models.',
      'Create database schemas with suitable keys, constraints, and data types.',
      'Write SQL queries for inserting, updating, deleting, retrieving, joining, and summarizing data.',
      'Apply normalization principles to improve database structure and integrity.',
      'Implement and document a small relational database solution.',
    ],
    modules: [
      {
        week: 'Weeks 1–2',
        title: 'Database Concepts and Architecture',
        description: 'Data, information, database systems, DBMS components, users, and common database environments.',
        topics: ['Database purpose', 'DBMS', 'Database users', 'Architecture'],
      },
      {
        week: 'Weeks 3–4',
        title: 'Data Modeling',
        description: 'Requirements analysis, entities, attributes, relationships, cardinality, keys, and ER diagrams.',
        topics: ['Entities', 'Relationships', 'Cardinality', 'ER modeling'],
      },
      {
        week: 'Weeks 5–6',
        title: 'Relational Design and SQL Foundations',
        description: 'Relational schemas, data types, keys, constraints, table creation, and basic data manipulation.',
        topics: ['Schemas', 'DDL', 'DML', 'Constraints'],
      },
      {
        week: 'Weeks 7–8',
        title: 'SQL Querying',
        description: 'Filtering, sorting, functions, grouping, joins, nested queries, and views.',
        topics: ['SELECT', 'Joins', 'Aggregation', 'Subqueries'],
      },
      {
        week: 'Weeks 9–10',
        title: 'Normalization and Integrity',
        description: 'Functional dependencies, normal forms, anomalies, integrity rules, and design improvement.',
        topics: ['1NF', '2NF', '3NF', 'Integrity'],
      },
      {
        week: 'Weeks 11–12',
        title: 'Transactions, Security, and Project',
        description: 'Transaction concepts, concurrency, access control, backup, recovery, and final database implementation.',
        topics: ['Transactions', 'Security', 'Backup', 'Database project'],
      },
    ],
    assessments: sharedAssessments,
    teachingMethods: [
      'Lectures with database-design and SQL demonstrations.',
      'Guided laboratory exercises using an approved relational DBMS.',
      'E-learning practice questions, SQL tasks, and feedback.',
      'A progressive database design and implementation project.',
    ],
    learningActivities: [
      'Create ER diagrams and translate them into relational schemas.',
      'Write and test SQL statements using realistic datasets.',
      'Normalize sample tables and explain design decisions.',
      'Design, implement, query, and document a small database solution.',
    ],
    resources: [
      'Approved relational database management software.',
      'Database design tools, SQL scripts, and instructor-provided datasets.',
      'JCST e-learning laboratory guides and assessment materials.',
      'Recommended database systems textbook and SQL reference.',
    ],
    schedule: sharedSchedule,
    instructor: {
      name: 'Database Systems Lecturer',
      title: 'Database and Information Systems Instructor',
      email: 'database@jcst.edu.so',
      phone: '+252 61 0000000',
      bio: 'The instructor supports data modeling, SQL laboratory practice, database design, assessment feedback, and project implementation.',
    },
  },
  {
    slug: 'web-application-development',
    title: 'Web Application Development',
    excerpt:
      'Design and build responsive, accessible, data-driven web applications using modern front-end, back-end, API, database, security, and deployment concepts.',
    body:
      'This practical course guides students through planning, designing, developing, testing, securing, and deploying modern web applications. Students work with responsive interfaces, client-side logic, server-side development, APIs, databases, authentication, testing, version control, and project documentation.',
    imageUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=88',
    order: 4,
    code: 'BIT213',
    program: 'bachelor-information-technology',
    department: 'computer-science',
    credits: 3,
    semester: 'Semester 4',
    level: 'Year 2',
    courseType: 'Core',
    contactHours: '60 Hours',
    deliveryModes: ['Computer Lab', 'Blended'],
    prerequisites: ['Introduction to Programming.', 'Web Design Fundamentals.', 'Database Systems I is recommended.'],
    highlights: [
      'Responsive user interfaces, accessibility, forms, and client-side interaction.',
      'Server-side development, REST APIs, databases, authentication, and validation.',
      'Testing, security, version control, documentation, and deployment.',
      'An integrated full-stack web application project.',
    ],
    learningOutcomes: [
      'Plan and design a responsive web application based on user and system requirements.',
      'Build accessible user interfaces using modern web technologies.',
      'Develop server-side logic and RESTful application interfaces.',
      'Connect applications to databases and implement secure data operations.',
      'Apply authentication, validation, testing, security, and error-handling practices.',
      'Deploy and present a documented full-stack web application.',
    ],
    modules: [
      {
        week: 'Weeks 1–2',
        title: 'Application Planning and Interface Design',
        description: 'Requirements, user stories, information architecture, wireframes, responsive layouts, and accessibility.',
        topics: ['Requirements', 'Wireframes', 'Responsive design', 'Accessibility'],
      },
      {
        week: 'Weeks 3–4',
        title: 'Front-End Application Development',
        description: 'Components, state, forms, events, validation, navigation, and client-side data handling.',
        topics: ['Components', 'State', 'Forms', 'Routing'],
      },
      {
        week: 'Weeks 5–6',
        title: 'Server-Side Development and APIs',
        description: 'Web servers, application architecture, routes, controllers, middleware, and REST APIs.',
        topics: ['HTTP', 'Server routes', 'Middleware', 'REST APIs'],
      },
      {
        week: 'Weeks 7–8',
        title: 'Database Integration',
        description: 'Data models, database connections, CRUD operations, validation, and application data flow.',
        topics: ['Models', 'CRUD', 'Validation', 'Data flow'],
      },
      {
        week: 'Weeks 9–10',
        title: 'Authentication, Security, and Testing',
        description: 'User accounts, authorization, secure sessions, input protection, testing, and error handling.',
        topics: ['Authentication', 'Authorization', 'Security', 'Testing'],
      },
      {
        week: 'Weeks 11–12',
        title: 'Deployment and Final Project',
        description: 'Environment configuration, builds, deployment, documentation, demonstration, and project review.',
        topics: ['Deployment', 'Environment variables', 'Documentation', 'Final project'],
      },
    ],
    assessments: sharedAssessments,
    teachingMethods: [
      'Short technical lectures followed by live full-stack demonstrations.',
      'Guided front-end, API, database, testing, and deployment laboratories.',
      'E-learning tutorials, code reviews, quizzes, and project checkpoints.',
      'Individual or team-based application development project.',
    ],
    learningActivities: [
      'Design responsive interfaces and implement reusable components.',
      'Develop API endpoints and connect them to a database.',
      'Implement authentication, validation, testing, and error handling.',
      'Deploy and present a complete web application.',
    ],
    resources: [
      'A computer with the approved development tools and version-control software.',
      'Instructor starter projects, API examples, database samples, and deployment guides.',
      'JCST e-learning videos, exercises, documentation, and feedback activities.',
      'Official documentation for the approved web-development technologies.',
    ],
    schedule: sharedSchedule,
    instructor: {
      name: 'Web Development Lecturer',
      title: 'Full-Stack Application Development Instructor',
      email: 'webdevelopment@jcst.edu.so',
      phone: '+252 61 0000000',
      bio: 'The instructor guides students through interface design, APIs, database integration, application security, testing, and deployment.',
    },
  },
  {
    slug: 'principles-of-management',
    title: 'Principles of Management',
    excerpt:
      'Understand planning, organizing, leadership, decision-making, communication, motivation, control, ethics, and modern organizational management.',
    body:
      'This course introduces the foundations of effective management in private, public, nonprofit, and entrepreneurial organizations. Students study management functions, organizational environments, decision-making, leadership, communication, teamwork, motivation, ethics, performance, and change.',
    imageUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=88',
    order: 5,
    code: 'BBA101',
    program: 'bachelor-business-administration',
    department: 'business-administration',
    credits: 3,
    semester: 'Semester 1',
    level: 'Year 1',
    courseType: 'Core',
    contactHours: '45 Hours',
    deliveryModes: ['On-campus', 'Blended'],
    prerequisites: ['No formal prerequisite.'],
    highlights: [
      'Management functions, roles, skills, environments, and organizational responsibility.',
      'Planning, decision-making, organizing, staffing, leadership, and control.',
      'Communication, motivation, teamwork, ethics, diversity, and change.',
      'Case studies and practical management problem-solving.',
    ],
    learningOutcomes: [
      'Explain major management functions, roles, skills, and responsibilities.',
      'Apply planning and decision-making tools to basic organizational problems.',
      'Describe organizational structures, delegation, staffing, and coordination.',
      'Compare leadership, communication, motivation, and teamwork approaches.',
      'Discuss ethics, social responsibility, diversity, innovation, and change.',
      'Analyze simple management cases and communicate practical recommendations.',
    ],
    modules: [
      {
        week: 'Weeks 1–2',
        title: 'Management Foundations',
        description: 'Managers, organizations, management levels, functions, roles, skills, history, and contemporary challenges.',
        topics: ['Management functions', 'Managerial roles', 'Management skills', 'Organizations'],
      },
      {
        week: 'Weeks 3–4',
        title: 'Organizational Environment and Ethics',
        description: 'Internal and external environments, stakeholders, culture, ethics, social responsibility, and sustainability.',
        topics: ['Environment', 'Stakeholders', 'Culture', 'Ethics'],
      },
      {
        week: 'Weeks 5–6',
        title: 'Planning and Decision-Making',
        description: 'Goals, strategies, plans, decision processes, evidence, risk, and problem-solving.',
        topics: ['Goals', 'Planning', 'Decision-making', 'Risk'],
      },
      {
        week: 'Weeks 7–8',
        title: 'Organizing and Staffing',
        description: 'Structures, job design, authority, delegation, coordination, human resources, and organizational design.',
        topics: ['Structures', 'Delegation', 'Coordination', 'Staffing'],
      },
      {
        week: 'Weeks 9–10',
        title: 'Leadership, Motivation, and Communication',
        description: 'Leadership approaches, employee motivation, communication, teams, conflict, and influence.',
        topics: ['Leadership', 'Motivation', 'Communication', 'Teams'],
      },
      {
        week: 'Weeks 11–12',
        title: 'Control, Change, and Performance',
        description: 'Performance standards, measurement, corrective action, quality, innovation, change, and course integration.',
        topics: ['Control', 'Performance', 'Quality', 'Change'],
      },
    ],
    assessments: sharedAssessments,
    teachingMethods: sharedMethods,
    learningActivities: [
      'Analyze short management cases and identify practical solutions.',
      'Participate in teamwork, communication, planning, and leadership activities.',
      'Prepare short presentations, reports, and reflective responses.',
      'Use e-learning discussions and quizzes to connect concepts with current organizations.',
    ],
    resources: [
      'Instructor notes, management cases, presentations, and guided readings.',
      'JCST e-learning discussions, quizzes, and assessment materials.',
      'Recommended introductory management textbook.',
      'Selected organizational examples from Somalia and international contexts.',
    ],
    schedule: sharedSchedule,
    instructor: {
      name: 'Business Management Lecturer',
      title: 'Management and Leadership Instructor',
      email: 'business@jcst.edu.so',
      phone: '+252 61 0000000',
      bio: 'The instructor supports management theory, case analysis, teamwork, communication, leadership, and professional decision-making.',
    },
  },
  {
    slug: 'community-health',
    title: 'Community Health',
    excerpt:
      'Study population health, prevention, health promotion, community assessment, communication, sanitation, disease control, and community-based action.',
    body:
      'This course introduces the principles and practice of community health. Students examine social and environmental determinants of health, prevention, health promotion, epidemiological thinking, sanitation, maternal and child health, communicable and noncommunicable diseases, community assessment, health education, and ethical community engagement.',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=88',
    order: 6,
    code: 'DPH201',
    program: 'diploma-public-health',
    department: 'public-health',
    credits: 3,
    semester: 'Semester 2',
    level: 'Year 1',
    courseType: 'Core',
    contactHours: '45 Hours',
    deliveryModes: ['On-campus', 'Field Learning', 'Blended'],
    prerequisites: ['Introduction to Public Health or equivalent is recommended.'],
    highlights: [
      'Community-health concepts, determinants, prevention, and health promotion.',
      'Community assessment, communication, participation, and health education.',
      'Environmental health, sanitation, communicable and noncommunicable disease control.',
      'Ethical field observation and community-focused health planning.',
    ],
    learningOutcomes: [
      'Explain the meaning, scope, and importance of community health.',
      'Identify major social, environmental, behavioral, and service-related determinants of health.',
      'Describe prevention, health promotion, sanitation, and common disease-control strategies.',
      'Apply basic methods for community assessment and health education planning.',
      'Communicate health information respectfully to individuals, families, and groups.',
      'Propose a simple evidence-informed response to a community-health priority.',
    ],
    modules: [
      {
        week: 'Weeks 1–2',
        title: 'Foundations of Community Health',
        description: 'Community, population health, public health functions, determinants, equity, prevention, and primary health care.',
        topics: ['Community health', 'Determinants', 'Health equity', 'Prevention'],
      },
      {
        week: 'Weeks 3–4',
        title: 'Community Assessment and Participation',
        description: 'Community profiles, needs assessment, stakeholder engagement, participation, and ethical field practice.',
        topics: ['Community diagnosis', 'Data collection', 'Stakeholders', 'Participation'],
      },
      {
        week: 'Weeks 5–6',
        title: 'Health Promotion and Communication',
        description: 'Health behavior, education methods, communication, counseling, campaigns, and culturally appropriate messages.',
        topics: ['Health education', 'Communication', 'Behavior change', 'Campaigns'],
      },
      {
        week: 'Weeks 7–8',
        title: 'Environmental Health and Sanitation',
        description: 'Water, sanitation, hygiene, waste, housing, food safety, vectors, and environmental risk reduction.',
        topics: ['WASH', 'Waste', 'Food safety', 'Vector control'],
      },
      {
        week: 'Weeks 9–10',
        title: 'Disease Prevention Across the Life Course',
        description: 'Communicable diseases, noncommunicable diseases, maternal and child health, nutrition, and prevention.',
        topics: ['Communicable disease', 'NCDs', 'Maternal health', 'Nutrition'],
      },
      {
        week: 'Weeks 11–12',
        title: 'Community Action Plan',
        description: 'Priority setting, intervention planning, monitoring, evaluation, teamwork, and presentation of a community-health plan.',
        topics: ['Priority setting', 'Planning', 'Monitoring', 'Community project'],
      },
    ],
    assessments: sharedAssessments,
    teachingMethods: [
      'Lectures, guided discussion, case studies, and health-education demonstrations.',
      'Community examples, field observation, group analysis, and planning exercises.',
      'E-learning readings, quizzes, communication activities, and feedback.',
      'Supervised preparation of a simple community-health action plan.',
    ],
    learningActivities: [
      'Analyze community-health profiles and identify priority needs.',
      'Develop culturally appropriate health-education messages and materials.',
      'Practice observation, communication, teamwork, and ethical engagement.',
      'Prepare and present a basic community-health intervention plan.',
    ],
    resources: [
      'Instructor notes, community-health cases, and public-health reference materials.',
      'JCST e-learning readings, quizzes, communication examples, and project guides.',
      'Approved public-health manuals and national or international technical guidance.',
      'Field-learning materials appropriate to the planned activity.',
    ],
    schedule: sharedSchedule,
    instructor: {
      name: 'Public Health Lecturer',
      title: 'Community Health Instructor',
      email: 'publichealth@jcst.edu.so',
      phone: '+252 61 0000000',
      bio: 'The instructor supports community assessment, health communication, prevention, ethical field learning, and practical public-health planning.',
    },
  },
];

const records = [coursesPage, ...courses.map(createCourseRecord)];

const run = async () => {
  await connectDatabase();

  for (const record of records) {
    await WebsiteContentModel.findOneAndUpdate(
      { type: (record as any).type, slug: (record as any).slug },
      { $set: record },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  logger.info(
    { count: records.length },
    'Courses page and detailed course records were seeded successfully',
  );
};

run()
  .catch((error) => {
    logger.error({ err: error }, 'Failed to seed course content');
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });