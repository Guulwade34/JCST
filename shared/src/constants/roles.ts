export const USER_ROLES = [
  'super-admin',
  'college-admin',
  'registrar',
  'assistant-registrar',
  'admissions-officer',
  'dean',
  'head-of-department',
  'program-coordinator',
  'examination-officer',
  'finance-officer',
  'librarian',
  'academic-advisor',
  'teacher',
  'student',
  'parent-guardian',
  'it-support',
  'auditor',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const PERMISSIONS = [
  'students.create',
  'students.read',
  'students.update',
  'students.archive',
  'students.promote',
  'students.graduate',
  'applications.review',
  'applications.approve',
  'courses.assign',
  'grades.enter',
  'grades.approve',
  'grades.publish',
  'attendance.manage',
  'finance.manage',
  'transcripts.generate',
  'certificates.generate',
  'settings.manage',
  'audit-logs.read',
] as const;

export type Permission = (typeof PERMISSIONS)[number];
