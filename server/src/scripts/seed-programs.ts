/* eslint-disable */
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { logger } from '../config/logger.js';
import { WebsiteContentModel } from '../modules/website/website-content.model.js';

const records = [
  {
    type: 'page',
    slug: 'programs',
    title: 'Choose a Program Built for Your Future',
    excerpt:
      'Explore career-focused academic programs designed around practical competence, flexible learning, strong foundations, and professional growth.',
    body:
      'JCST programs connect academic study, practical learning, e-learning support, ethical leadership, and career readiness. Use the search and filters to find the pathway that matches your goals.',
    imageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=88',
    icon: 'graduation',
    order: 4,
    featured: true,
    published: true,
    metadata: {
      eyebrow: 'JCST Academic Programs',
      heroHighlights: [
        'Competency-based curricula',
        'On-campus and e-learning support',
        'Practical and career-oriented study',
      ],
      programCountLabel: 'Active programs',
      deliveryValue: 'Blended',
      deliveryLabel: 'Learning delivery',
      durationValue: '2–4 Years',
      durationLabel: 'Study duration',
      outcomeValue: 'Career Ready',
      outcomeLabel: 'Graduate outcome',
      searchPlaceholder: 'Search programs, codes, departments...',
      resultsLabel: 'programs found',
      filtersTitle: 'Filter Programs',
      departmentFilterLabel: 'Department',
      qualificationFilterLabel: 'Qualification',
      studyModeFilterLabel: 'Study Mode',
      cardActionLabel: 'View Details',
      emptyTitle: 'No programs match your filters',
      emptyDescription:
        'Reset the filters or try a different program name, code, department, or qualification.',
      ctaEyebrow: 'Choose your future',
      ctaTitle: 'Ready to begin your academic journey?',
      ctaDescription:
        'Apply for admission or speak with the JCST admissions team for guidance on programs, requirements, intakes, and study modes.',
      ctaPrimaryLabel: 'Apply Now',
      ctaPrimaryUrl: '/apply',
      ctaSecondaryLabel: 'Talk to Admissions',
      ctaSecondaryUrl: '/contact',
      ctaImageUrl:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=88',
      ctaImageAlt: 'Students beginning a professional academic journey',
      seoTitle: 'Academic Programs | JCST',
      seoDescription:
        'Explore JCST academic programs, study modes, entry requirements, curricula, career opportunities, and e-learning support.',
    },
  },
  {
    type: 'program',
    slug: 'bachelor-information-technology',
    title: 'Bachelor of Information Technology',
    excerpt:
      'A comprehensive degree focused on software, databases, networks, cybersecurity, information systems, cloud technologies, and professional IT practice.',
    body:
      'The Bachelor of Information Technology develops students who can analyze organizational needs, design reliable digital solutions, manage modern technology environments, and contribute responsibly to innovation. The program combines computing foundations, software development, networking, databases, cybersecurity, systems analysis, project work, e-learning activities, and internship experience.',
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=88',
    icon: 'laptop',
    order: 1,
    featured: true,
    published: true,
    metadata: {
      code: 'BIT',
      imageAlt:
        'Information technology students learning with computers in a modern environment',
      department: 'computer-science',
      qualification: 'Bachelor Degree',
      duration: '4 Years',
      semesters: 8,
      studyModes: ['Regular', 'Weekend', 'Blended'],
      requiredCredits: 120,
      intakes: ['January', 'May', 'September'],
      deliveryModel: 'On-campus + E-Learning',
      eLearningEnabled: true,
      applyLabel: 'Apply for BIT',
      overviewTitle: 'Technology education connected to real professional practice',
      highlights: [
        'Software development, databases, systems, networks, and cybersecurity',
        'Practical laboratories, projects, e-learning activities, and internship experience',
        'Career preparation for technical, analytical, support, and management roles',
        'Ethical computing, communication, teamwork, and professional responsibility',
      ],
      entryRequirements: [
        'A recognized secondary-school certificate or equivalent qualification.',
        'A satisfactory academic background, including basic mathematics and English.',
        'Meeting the current JCST admission and verification requirements.',
        'Applicants with relevant prior study may request evaluation according to institutional policy.',
      ],
      requiredDocuments: [
        'Completed online or printed application form.',
        'Certified secondary-school certificate or equivalent.',
        'Academic transcript or result slip.',
        'Valid identity document.',
        'Recent passport-size photograph.',
      ],
      objectives: [
        'Provide strong foundations in computing, information systems, and digital technologies.',
        'Develop practical competence in software, databases, networking, systems analysis, and cybersecurity.',
        'Prepare students to solve organizational and community problems using responsible technology solutions.',
        'Strengthen communication, teamwork, project management, ethical judgment, and lifelong learning.',
      ],
      learningOutcomes: [
        'Analyze user, organizational, and technical requirements for information technology solutions.',
        'Design, develop, test, document, and maintain software and database applications.',
        'Configure and support computer networks, operating systems, and common digital services.',
        'Apply cybersecurity, privacy, data protection, and professional ethics principles.',
        'Plan and deliver technology projects individually and in multidisciplinary teams.',
        'Communicate technical ideas clearly to both specialist and non-specialist audiences.',
      ],
      careerOpportunities: [
        'Software Developer',
        'Systems Analyst',
        'Database Administrator',
        'Network Administrator',
        'IT Support Specialist',
        'Cybersecurity Assistant',
        'Web Application Developer',
        'Information Systems Officer',
      ],
      learningMethods: [
        'Lectures, guided tutorials, and interactive classroom activities.',
        'Computer laboratories, coding practice, simulations, and technical demonstrations.',
        'Individual and group projects linked to realistic professional scenarios.',
        'E-learning lessons, resources, discussions, assignments, and progress tracking.',
        'Internship, field exposure, or supervised workplace learning where available.',
      ],
      assessmentMethods: [
        'Continuous assignments, quizzes, practical exercises, and laboratory work.',
        'Projects, presentations, reports, and portfolio-based assessment.',
        'Mid-semester and final examinations.',
        'Internship or fieldwork evaluation where applicable.',
        'Final-year project, demonstration, and written report.',
      ],
      supportServices: [
        'Academic advising and program guidance.',
        'Digital learning resources and e-learning support.',
        'Laboratory access and guided practical support.',
        'Career preparation, communication, and professional-development activities.',
      ],
      coordinator: {
        name: 'Program Coordinator',
        title: 'Bachelor of Information Technology',
        email: 'computing@jcst.edu.so',
        phone: '+252 61 0000000',
      },
      curriculum: [
        {
          title: 'Semester 1',
          totalCredits: 15,
          courses: [
            { code: 'BIT101', title: 'Introduction to Information Technology', credits: 3, type: 'Core' },
            { code: 'BIT102', title: 'Computer Applications', credits: 3, type: 'Core' },
            { code: 'BIT103', title: 'Introduction to Programming', credits: 3, type: 'Core' },
            { code: 'GEN101', title: 'Communication Skills', credits: 3, type: 'General' },
            { code: 'MAT101', title: 'Mathematics for Computing I', credits: 3, type: 'Support' },
          ],
        },
        {
          title: 'Semester 2',
          totalCredits: 15,
          courses: [
            { code: 'BIT111', title: 'Object-Oriented Programming', credits: 3, type: 'Core' },
            { code: 'BIT112', title: 'Computer Organization', credits: 3, type: 'Core' },
            { code: 'BIT113', title: 'Web Design Fundamentals', credits: 3, type: 'Core' },
            { code: 'MAT111', title: 'Discrete Mathematics', credits: 3, type: 'Support' },
            { code: 'GEN111', title: 'Ethics and Citizenship', credits: 3, type: 'General' },
          ],
        },
        {
          title: 'Semester 3',
          totalCredits: 15,
          courses: [
            { code: 'BIT201', title: 'Data Structures and Algorithms', credits: 3, type: 'Core' },
            { code: 'BIT202', title: 'Database Systems I', credits: 3, type: 'Core' },
            { code: 'BIT203', title: 'Operating Systems', credits: 3, type: 'Core' },
            { code: 'BIT204', title: 'Data Communications and Networking I', credits: 3, type: 'Core' },
            { code: 'STA201', title: 'Statistics for Information Technology', credits: 3, type: 'Support' },
          ],
        },
        {
          title: 'Semester 4',
          totalCredits: 15,
          courses: [
            { code: 'BIT211', title: 'Database Systems II', credits: 3, type: 'Core' },
            { code: 'BIT212', title: 'Systems Analysis and Design', credits: 3, type: 'Core' },
            { code: 'BIT213', title: 'Web Application Development', credits: 3, type: 'Core' },
            { code: 'BIT214', title: 'Data Communications and Networking II', credits: 3, type: 'Core' },
            { code: 'BUS211', title: 'Principles of Management', credits: 3, type: 'Support' },
          ],
        },
        {
          title: 'Semester 5',
          totalCredits: 15,
          courses: [
            { code: 'BIT301', title: 'Software Engineering', credits: 3, type: 'Core' },
            { code: 'BIT302', title: 'Information Systems Management', credits: 3, type: 'Core' },
            { code: 'BIT303', title: 'Cybersecurity Fundamentals', credits: 3, type: 'Core' },
            { code: 'BIT304', title: 'Mobile Application Development', credits: 3, type: 'Core' },
            { code: 'RES301', title: 'Research Methods', credits: 3, type: 'Support' },
          ],
        },
        {
          title: 'Semester 6',
          totalCredits: 15,
          courses: [
            { code: 'BIT311', title: 'Cloud Computing Fundamentals', credits: 3, type: 'Core' },
            { code: 'BIT312', title: 'Human-Computer Interaction', credits: 3, type: 'Core' },
            { code: 'BIT313', title: 'Data Analytics Fundamentals', credits: 3, type: 'Core' },
            { code: 'BIT314', title: 'IT Project Management', credits: 3, type: 'Core' },
            { code: 'ENT311', title: 'Entrepreneurship and Innovation', credits: 3, type: 'Support' },
          ],
        },
        {
          title: 'Semester 7',
          totalCredits: 15,
          courses: [
            { code: 'BIT401', title: 'Enterprise Systems', credits: 3, type: 'Core' },
            { code: 'BIT402', title: 'Information Security Management', credits: 3, type: 'Core' },
            { code: 'BIT403', title: 'Emerging Technologies', credits: 3, type: 'Elective' },
            { code: 'BIT404', title: 'Professional Internship', credits: 3, type: 'Practical' },
            { code: 'BIT405', title: 'Final-Year Project I', credits: 3, type: 'Project' },
          ],
        },
        {
          title: 'Semester 8',
          totalCredits: 15,
          courses: [
            { code: 'BIT411', title: 'IT Governance and Professional Practice', credits: 3, type: 'Core' },
            { code: 'BIT412', title: 'Digital Transformation', credits: 3, type: 'Core' },
            { code: 'BIT413', title: 'Technology Elective', credits: 3, type: 'Elective' },
            { code: 'BIT414', title: 'Final-Year Project II', credits: 6, type: 'Project' },
          ],
        },
      ],
      ctaImageUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=88',
      ctaImageAlt: 'Information technology students learning together',
    },
  },
  {
    type: 'program',
    slug: 'diploma-computer-science',
    title: 'Diploma in Computer Science',
    excerpt:
      'A practical diploma focused on programming, web development, databases, computer systems, networking foundations, and entry-level digital careers.',
    body:
      'The Diploma in Computer Science provides a direct and practical introduction to computing. Students develop foundational programming, database, web, systems, and networking skills through guided instruction, laboratory practice, projects, assessments, and e-learning resources. The program supports both employment preparation and progression to advanced study.',
    imageUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=88',
    icon: 'laptop',
    order: 2,
    featured: true,
    published: true,
    metadata: {
      code: 'DCS',
      imageAlt: 'Student programming on a computer',
      department: 'computer-science',
      qualification: 'Diploma',
      duration: '2 Years',
      semesters: 4,
      studyModes: ['Regular', 'Weekend', 'Blended'],
      requiredCredits: 60,
      intakes: ['January', 'May', 'September'],
      deliveryModel: 'On-campus + E-Learning',
      eLearningEnabled: true,
      applyLabel: 'Apply for DCS',
      overviewTitle: 'A practical foundation for computing and digital careers',
      highlights: [
        'Programming, databases, web technologies, systems, and networking foundations',
        'Structured laboratory practice, projects, and e-learning activities',
        'Preparation for entry-level technology roles and further academic progression',
        'Professional communication, teamwork, ethics, and problem-solving',
      ],
      entryRequirements: [
        'A recognized secondary-school certificate or equivalent qualification.',
        'Basic numeracy, English, and willingness to learn practical computing skills.',
        'Meeting the current JCST admission and document-verification requirements.',
      ],
      requiredDocuments: [
        'Completed application form.',
        'Secondary-school certificate or equivalent.',
        'Academic transcript or result slip.',
        'Valid identity document.',
        'Recent passport-size photograph.',
      ],
      objectives: [
        'Build practical foundations in programming, databases, web technologies, computer systems, and networking.',
        'Develop disciplined problem-solving, documentation, communication, and teamwork skills.',
        'Prepare learners for entry-level digital roles, entrepreneurship, and further study.',
      ],
      learningOutcomes: [
        'Write, test, and debug basic structured and object-oriented programs.',
        'Design and use small relational databases for common information needs.',
        'Develop responsive introductory websites and simple web applications.',
        'Install, configure, and support common computer hardware, software, and networks.',
        'Apply basic cybersecurity, backup, privacy, and professional-practice principles.',
      ],
      careerOpportunities: [
        'Junior Programmer',
        'Web Support Assistant',
        'Database Assistant',
        'IT Support Technician',
        'Computer Lab Assistant',
        'Network Support Assistant',
        'Digital Services Assistant',
        'Technology Entrepreneur',
      ],
      learningMethods: [
        'Lectures, tutorials, demonstrations, and guided practice.',
        'Computer laboratory sessions and practical exercises.',
        'Individual and group projects.',
        'E-learning resources, assignments, quizzes, and discussions.',
      ],
      assessmentMethods: [
        'Practical exercises and laboratory assessments.',
        'Assignments, quizzes, projects, and presentations.',
        'Mid-semester and final examinations.',
        'Final practical project or portfolio.',
      ],
      supportServices: [
        'Academic advising and study guidance.',
        'Laboratory and e-learning support.',
        'Career-readiness and communication activities.',
      ],
      coordinator: {
        name: 'Program Coordinator',
        title: 'Diploma in Computer Science',
        email: 'computing@jcst.edu.so',
        phone: '+252 61 0000000',
      },
      curriculum: [
        {
          title: 'Semester 1',
          totalCredits: 15,
          courses: [
            { code: 'DCS101', title: 'Computer Fundamentals', credits: 3, type: 'Core' },
            { code: 'DCS102', title: 'Computer Applications', credits: 3, type: 'Core' },
            { code: 'DCS103', title: 'Introduction to Programming', credits: 3, type: 'Core' },
            { code: 'DCS104', title: 'Mathematics for Computing', credits: 3, type: 'Support' },
            { code: 'GEN101', title: 'Communication Skills', credits: 3, type: 'General' },
          ],
        },
        {
          title: 'Semester 2',
          totalCredits: 15,
          courses: [
            { code: 'DCS111', title: 'Object-Oriented Programming', credits: 3, type: 'Core' },
            { code: 'DCS112', title: 'Web Design', credits: 3, type: 'Core' },
            { code: 'DCS113', title: 'Database Fundamentals', credits: 3, type: 'Core' },
            { code: 'DCS114', title: 'Computer Hardware and Maintenance', credits: 3, type: 'Practical' },
            { code: 'GEN111', title: 'Ethics and Professional Practice', credits: 3, type: 'General' },
          ],
        },
        {
          title: 'Semester 3',
          totalCredits: 15,
          courses: [
            { code: 'DCS201', title: 'Data Structures Fundamentals', credits: 3, type: 'Core' },
            { code: 'DCS202', title: 'Web Application Development', credits: 3, type: 'Core' },
            { code: 'DCS203', title: 'Database Application Development', credits: 3, type: 'Core' },
            { code: 'DCS204', title: 'Networking Fundamentals', credits: 3, type: 'Core' },
            { code: 'ENT201', title: 'Entrepreneurship Fundamentals', credits: 3, type: 'Support' },
          ],
        },
        {
          title: 'Semester 4',
          totalCredits: 15,
          courses: [
            { code: 'DCS211', title: 'Systems Analysis Fundamentals', credits: 3, type: 'Core' },
            { code: 'DCS212', title: 'Introduction to Cybersecurity', credits: 3, type: 'Core' },
            { code: 'DCS213', title: 'IT Support and Service Management', credits: 3, type: 'Core' },
            { code: 'DCS214', title: 'Professional Practice', credits: 3, type: 'Practical' },
            { code: 'DCS215', title: 'Final Diploma Project', credits: 3, type: 'Project' },
          ],
        },
      ],
      ctaImageUrl:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=88',
      ctaImageAlt: 'Computer science student developing software',
    },
  },
  {
    type: 'program',
    slug: 'bachelor-business-administration',
    title: 'Bachelor of Business Administration',
    excerpt:
      'A professional business degree covering management, accounting, marketing, finance, entrepreneurship, strategy, leadership, and organizational development.',
    body:
      'The Bachelor of Business Administration prepares students to understand organizations, make informed decisions, lead teams, manage resources, communicate professionally, and develop responsible enterprises. Learning combines business theory, practical cases, projects, presentations, digital resources, entrepreneurship, research, and internship experience.',
    imageUrl:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=88',
    icon: 'briefcase',
    order: 3,
    featured: true,
    published: true,
    metadata: {
      code: 'BBA',
      imageAlt: 'Business students collaborating in a professional environment',
      department: 'business-management',
      qualification: 'Bachelor Degree',
      duration: '4 Years',
      semesters: 8,
      studyModes: ['Regular', 'Weekend', 'Blended'],
      requiredCredits: 120,
      intakes: ['January', 'May', 'September'],
      deliveryModel: 'On-campus + E-Learning',
      eLearningEnabled: true,
      applyLabel: 'Apply for BBA',
      overviewTitle: 'Business education for leadership, enterprise, and responsible growth',
      highlights: [
        'Management, finance, accounting, marketing, entrepreneurship, and strategy',
        'Business cases, projects, presentations, research, and internship experience',
        'Leadership, communication, decision-making, and ethical professional practice',
        'Preparation for organizational, entrepreneurial, and public-service careers',
      ],
      entryRequirements: [
        'A recognized secondary-school certificate or equivalent qualification.',
        'A satisfactory academic background and readiness for business study.',
        'Meeting the current JCST admission and document-verification requirements.',
      ],
      requiredDocuments: [
        'Completed application form.',
        'Secondary-school certificate or equivalent.',
        'Academic transcript or result slip.',
        'Valid identity document.',
        'Recent passport-size photograph.',
      ],
      objectives: [
        'Develop broad knowledge of management, accounting, finance, marketing, entrepreneurship, and organizational practice.',
        'Build leadership, analytical thinking, communication, teamwork, and ethical decision-making.',
        'Prepare graduates to manage organizations, develop enterprises, and contribute to sustainable economic development.',
      ],
      learningOutcomes: [
        'Apply management, accounting, finance, marketing, and business principles to organizational situations.',
        'Analyze business information and make responsible, evidence-informed decisions.',
        'Develop business plans, projects, reports, presentations, and entrepreneurial proposals.',
        'Lead and collaborate effectively in diverse professional teams.',
        'Use digital tools and professional communication in modern business environments.',
        'Demonstrate ethical leadership, accountability, and social responsibility.',
      ],
      careerOpportunities: [
        'Business Administrator',
        'Operations Officer',
        'Marketing Officer',
        'Human Resources Assistant',
        'Finance or Accounts Assistant',
        'Project Officer',
        'Entrepreneur',
        'Administrative Manager',
      ],
      learningMethods: [
        'Lectures, tutorials, seminars, and interactive discussions.',
        'Business cases, simulations, presentations, and practical projects.',
        'E-learning resources, assignments, quizzes, and collaborative activities.',
        'Research, entrepreneurship activities, and internship experience.',
      ],
      assessmentMethods: [
        'Assignments, quizzes, reports, presentations, and business cases.',
        'Group projects and entrepreneurship activities.',
        'Mid-semester and final examinations.',
        'Internship evaluation and final-year research project.',
      ],
      supportServices: [
        'Academic advising and business-study guidance.',
        'Digital learning resources and e-learning support.',
        'Entrepreneurship, communication, and career-development activities.',
      ],
      coordinator: {
        name: 'Program Coordinator',
        title: 'Bachelor of Business Administration',
        email: 'business@jcst.edu.so',
        phone: '+252 61 0000000',
      },
      curriculum: [
        {
          title: 'Semester 1',
          totalCredits: 15,
          courses: [
            { code: 'BBA101', title: 'Principles of Management', credits: 3, type: 'Core' },
            { code: 'BBA102', title: 'Introduction to Business', credits: 3, type: 'Core' },
            { code: 'ACC101', title: 'Financial Accounting I', credits: 3, type: 'Core' },
            { code: 'GEN101', title: 'Communication Skills', credits: 3, type: 'General' },
            { code: 'ECO101', title: 'Principles of Microeconomics', credits: 3, type: 'Support' },
          ],
        },
        {
          title: 'Semester 2',
          totalCredits: 15,
          courses: [
            { code: 'BBA111', title: 'Organizational Behaviour', credits: 3, type: 'Core' },
            { code: 'ACC111', title: 'Financial Accounting II', credits: 3, type: 'Core' },
            { code: 'ECO111', title: 'Principles of Macroeconomics', credits: 3, type: 'Support' },
            { code: 'BUS111', title: 'Business Mathematics', credits: 3, type: 'Support' },
            { code: 'GEN111', title: 'Ethics and Citizenship', credits: 3, type: 'General' },
          ],
        },
        {
          title: 'Semester 3',
          totalCredits: 15,
          courses: [
            { code: 'BBA201', title: 'Marketing Management', credits: 3, type: 'Core' },
            { code: 'BBA202', title: 'Human Resource Management', credits: 3, type: 'Core' },
            { code: 'FIN201', title: 'Business Finance I', credits: 3, type: 'Core' },
            { code: 'STA201', title: 'Business Statistics', credits: 3, type: 'Support' },
            { code: 'ICT201', title: 'Business Information Systems', credits: 3, type: 'Support' },
          ],
        },
        {
          title: 'Semester 4',
          totalCredits: 15,
          courses: [
            { code: 'BBA211', title: 'Operations Management', credits: 3, type: 'Core' },
            { code: 'BBA212', title: 'Business Law', credits: 3, type: 'Core' },
            { code: 'FIN211', title: 'Business Finance II', credits: 3, type: 'Core' },
            { code: 'ENT211', title: 'Entrepreneurship I', credits: 3, type: 'Core' },
            { code: 'BBA214', title: 'Professional Communication', credits: 3, type: 'Support' },
          ],
        },
        {
          title: 'Semester 5',
          totalCredits: 15,
          courses: [
            { code: 'BBA301', title: 'Strategic Management I', credits: 3, type: 'Core' },
            { code: 'BBA302', title: 'Consumer Behaviour', credits: 3, type: 'Core' },
            { code: 'BBA303', title: 'Project Management', credits: 3, type: 'Core' },
            { code: 'ENT301', title: 'Entrepreneurship II', credits: 3, type: 'Core' },
            { code: 'RES301', title: 'Research Methods', credits: 3, type: 'Support' },
          ],
        },
        {
          title: 'Semester 6',
          totalCredits: 15,
          courses: [
            { code: 'BBA311', title: 'Strategic Management II', credits: 3, type: 'Core' },
            { code: 'BBA312', title: 'Leadership and Governance', credits: 3, type: 'Core' },
            { code: 'BBA313', title: 'International Business', credits: 3, type: 'Core' },
            { code: 'BBA314', title: 'Business Analytics Fundamentals', credits: 3, type: 'Core' },
            { code: 'BBA315', title: 'Public and Nonprofit Management', credits: 3, type: 'Elective' },
          ],
        },
        {
          title: 'Semester 7',
          totalCredits: 15,
          courses: [
            { code: 'BBA401', title: 'Corporate Governance and Ethics', credits: 3, type: 'Core' },
            { code: 'BBA402', title: 'Enterprise Development', credits: 3, type: 'Core' },
            { code: 'BBA403', title: 'Business Elective', credits: 3, type: 'Elective' },
            { code: 'BBA404', title: 'Professional Internship', credits: 3, type: 'Practical' },
            { code: 'BBA405', title: 'Research Project I', credits: 3, type: 'Project' },
          ],
        },
        {
          title: 'Semester 8',
          totalCredits: 15,
          courses: [
            { code: 'BBA411', title: 'Contemporary Business Issues', credits: 3, type: 'Core' },
            { code: 'BBA412', title: 'Innovation and Digital Business', credits: 3, type: 'Core' },
            { code: 'BBA413', title: 'Business Elective II', credits: 3, type: 'Elective' },
            { code: 'BBA414', title: 'Research Project II', credits: 6, type: 'Project' },
          ],
        },
      ],
      ctaImageUrl:
        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=88',
      ctaImageAlt: 'Business students working together',
    },
  },
  {
    type: 'program',
    slug: 'diploma-public-health',
    title: 'Diploma in Public Health',
    excerpt:
      'A community-oriented health diploma covering health promotion, disease prevention, health education, epidemiology foundations, data, and responsible service.',
    body:
      'The Diploma in Public Health prepares learners to support community health activities, promote healthier behavior, communicate health information, participate in disease-prevention programs, collect basic health data, and work responsibly with communities and health teams. Learning combines theory, practical activities, community engagement, projects, and digital resources.',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=88',
    icon: 'users',
    order: 4,
    featured: true,
    published: true,
    metadata: {
      code: 'DPH',
      imageAlt: 'Public health students and health professionals learning together',
      department: 'health-sciences',
      qualification: 'Diploma',
      duration: '2 Years',
      semesters: 4,
      studyModes: ['Regular', 'Blended'],
      requiredCredits: 64,
      intakes: ['January', 'May', 'September'],
      deliveryModel: 'On-campus + E-Learning',
      eLearningEnabled: true,
      applyLabel: 'Apply for DPH',
      overviewTitle: 'Community-focused education for prevention, awareness, and responsible health support',
      highlights: [
        'Health promotion, disease prevention, community education, and epidemiology foundations',
        'Practical activities, data exercises, projects, and supervised community engagement',
        'Preparation for public-health support roles and further study',
        'Ethics, communication, teamwork, safety, and community responsibility',
      ],
      entryRequirements: [
        'A recognized secondary-school certificate or equivalent qualification.',
        'Interest in community health, prevention, education, and responsible service.',
        'Meeting the current JCST admission and health-program verification requirements.',
      ],
      requiredDocuments: [
        'Completed application form.',
        'Secondary-school certificate or equivalent.',
        'Academic transcript or result slip.',
        'Valid identity document.',
        'Recent passport-size photograph.',
      ],
      objectives: [
        'Build foundational knowledge of public health, community health, prevention, and health promotion.',
        'Develop practical skills in communication, community education, basic health data, and program support.',
        'Promote ethical conduct, teamwork, cultural respect, safety, and responsible community engagement.',
      ],
      learningOutcomes: [
        'Explain major public-health concepts, determinants of health, and prevention approaches.',
        'Support health-promotion and community-awareness activities.',
        'Collect, organize, and communicate basic community-health information responsibly.',
        'Apply introductory epidemiology, environmental-health, and health-education principles.',
        'Work ethically and collaboratively with communities and health teams within the graduate role.',
      ],
      careerOpportunities: [
        'Community Health Assistant',
        'Health Promotion Assistant',
        'Public Health Program Assistant',
        'Health Education Assistant',
        'Community Outreach Worker',
        'Monitoring and Data Assistant',
        'NGO Health Project Assistant',
        'Environmental Health Support Worker',
      ],
      learningMethods: [
        'Lectures, guided tutorials, demonstrations, and case discussions.',
        'Community-health exercises, projects, presentations, and practical activities.',
        'E-learning resources, assignments, quizzes, and guided discussions.',
        'Supervised community engagement or field exposure where available.',
      ],
      assessmentMethods: [
        'Assignments, quizzes, presentations, and practical exercises.',
        'Community projects, reports, and data activities.',
        'Mid-semester and final examinations.',
        'Fieldwork or final diploma project evaluation where applicable.',
      ],
      supportServices: [
        'Academic advising and health-study guidance.',
        'Digital resources and e-learning support.',
        'Community-engagement and professional-practice preparation.',
      ],
      coordinator: {
        name: 'Program Coordinator',
        title: 'Diploma in Public Health',
        email: 'health@jcst.edu.so',
        phone: '+252 61 0000000',
      },
      curriculum: [
        {
          title: 'Semester 1',
          totalCredits: 16,
          courses: [
            { code: 'DPH101', title: 'Introduction to Public Health', credits: 3, type: 'Core' },
            { code: 'DPH102', title: 'Human Biology and Health', credits: 3, type: 'Support' },
            { code: 'DPH103', title: 'Community Health Foundations', credits: 3, type: 'Core' },
            { code: 'GEN101', title: 'Communication Skills', credits: 3, type: 'General' },
            { code: 'DPH104', title: 'Basic First Aid and Safety', credits: 4, type: 'Practical' },
          ],
        },
        {
          title: 'Semester 2',
          totalCredits: 16,
          courses: [
            { code: 'DPH111', title: 'Health Promotion and Education', credits: 3, type: 'Core' },
            { code: 'DPH112', title: 'Introduction to Epidemiology', credits: 3, type: 'Core' },
            { code: 'DPH113', title: 'Environmental Health', credits: 3, type: 'Core' },
            { code: 'DPH114', title: 'Nutrition and Community Health', credits: 3, type: 'Core' },
            { code: 'GEN111', title: 'Ethics and Professional Conduct', credits: 4, type: 'General' },
          ],
        },
        {
          title: 'Semester 3',
          totalCredits: 16,
          courses: [
            { code: 'DPH201', title: 'Communicable Disease Prevention', credits: 3, type: 'Core' },
            { code: 'DPH202', title: 'Maternal and Child Health', credits: 3, type: 'Core' },
            { code: 'DPH203', title: 'Public Health Data Fundamentals', credits: 3, type: 'Core' },
            { code: 'DPH204', title: 'Community Mobilization', credits: 3, type: 'Practical' },
            { code: 'RES201', title: 'Introduction to Research Methods', credits: 4, type: 'Support' },
          ],
        },
        {
          title: 'Semester 4',
          totalCredits: 16,
          courses: [
            { code: 'DPH211', title: 'Non-Communicable Disease Prevention', credits: 3, type: 'Core' },
            { code: 'DPH212', title: 'Health Program Planning', credits: 3, type: 'Core' },
            { code: 'DPH213', title: 'Monitoring and Basic Evaluation', credits: 3, type: 'Core' },
            { code: 'DPH214', title: 'Community Field Practice', credits: 4, type: 'Practical' },
            { code: 'DPH215', title: 'Final Diploma Project', credits: 3, type: 'Project' },
          ],
        },
      ],
      ctaImageUrl:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=88',
      ctaImageAlt: 'Public health learning and professional service',
    },
  },
];

const run = async () => {
  await connectDatabase();

  try {
    for (const record of records) {
      await WebsiteContentModel.findOneAndUpdate(
        { type: record.type, slug: record.slug } as any,
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
      'Programs page and detailed program records were seeded successfully',
    );
  } catch (error) {
    logger.error(
      { err: error },
      'Failed to seed Programs page and program records',
    );
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
};

void run();