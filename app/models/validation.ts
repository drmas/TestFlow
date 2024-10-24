import type { 
  Requirement,
  TestCase,
  TestRun,
  User,
  Comment,
  Tag
} from "@prisma/client";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateRequired(value: unknown, field: string): string | null {
  if (value === undefined || value === null || value === '') {
    return `${field} is required`;
  }
  return null;
}

function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
}

function validateEnum<T>(value: T, validValues: T[], field: string): string | null {
  if (!validValues.includes(value)) {
    return `Invalid ${field}. Must be one of: ${validValues.join(', ')}`;
  }
  return null;
}

export function validateRequirement(requirement: Partial<Requirement>): ValidationResult {
  const errors: string[] = [];

  const requiredFields = ['title', 'description', 'priority', 'status', 'category'];
  requiredFields.forEach(field => {
    const error = validateRequired(requirement[field as keyof Requirement], field);
    if (error) errors.push(error);
  });

  if (requirement.priority) {
    const priorityError = validateEnum(
      requirement.priority,
      ['High', 'Medium', 'Low'],
      'priority'
    );
    if (priorityError) errors.push(priorityError);
  }

  if (requirement.status) {
    const statusError = validateEnum(
      requirement.status,
      ['Draft', 'In Review', 'Approved', 'Deprecated'],
      'status'
    );
    if (statusError) errors.push(statusError);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateTestCase(testCase: Partial<TestCase>): ValidationResult {
  const errors: string[] = [];

  const requiredFields = ['title', 'description', 'priority', 'status', 'type'];
  requiredFields.forEach(field => {
    const error = validateRequired(testCase[field as keyof TestCase], field);
    if (error) errors.push(error);
  });

  if (testCase.priority) {
    const priorityError = validateEnum(
      testCase.priority,
      ['High', 'Medium', 'Low'],
      'priority'
    );
    if (priorityError) errors.push(priorityError);
  }

  if (testCase.type) {
    const typeError = validateEnum(
      testCase.type,
      ['Functional', 'Integration', 'Performance', 'Security'],
      'type'
    );
    if (typeError) errors.push(typeError);
  }

  if (testCase.automationStatus) {
    const automationError = validateEnum(
      testCase.automationStatus,
      ['Not Automated', 'Automated', 'In Progress'],
      'automationStatus'
    );
    if (automationError) errors.push(automationError);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateUser(user: Partial<User>): ValidationResult {
  const errors: string[] = [];

  const requiredFields = ['username', 'email', 'firstName', 'lastName', 'role'];
  requiredFields.forEach(field => {
    const error = validateRequired(user[field as keyof User], field);
    if (error) errors.push(error);
  });

  if (user.email) {
    const emailError = validateEmail(user.email);
    if (emailError) errors.push(emailError);
  }

  if (user.role) {
    const roleError = validateEnum(
      user.role,
      ['Admin', 'Tester', 'Developer', 'Viewer'],
      'role'
    );
    if (roleError) errors.push(roleError);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateComment(comment: Partial<Comment>): ValidationResult {
  const errors: string[] = [];

  if (!comment.text?.trim()) {
    errors.push('Comment text is required');
  }

  if (comment.text && comment.text.length > 1000) {
    errors.push('Comment text cannot exceed 1000 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateTag(tag: Partial<Tag>): ValidationResult {
  const errors: string[] = [];

  if (!tag.name?.trim()) {
    errors.push('Tag name is required');
  }

  if (tag.name && tag.name.length > 50) {
    errors.push('Tag name cannot exceed 50 characters');
  }

  if (tag.description && tag.description.length > 200) {
    errors.push('Tag description cannot exceed 200 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateTestRun(testRun: Partial<TestRun>): ValidationResult {
  const errors: string[] = [];

  const requiredFields = ['name', 'startDate', 'status'];
  requiredFields.forEach(field => {
    const error = validateRequired(testRun[field as keyof TestRun], field);
    if (error) errors.push(error);
  });

  if (testRun.status) {
    const statusError = validateEnum(
      testRun.status,
      ['Not Started', 'In Progress', 'Completed', 'Aborted'],
      'status'
    );
    if (statusError) errors.push(statusError);
  }

  if (testRun.startDate && testRun.endDate) {
    const start = new Date(testRun.startDate);
    const end = new Date(testRun.endDate);
    
    if (isNaN(start.getTime())) {
      errors.push('Invalid start date format');
    }
    if (isNaN(end.getTime())) {
      errors.push('Invalid end date format');
    }
    if (start > end) {
      errors.push('End date must be after start date');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateAttachment(size: number, type: string) {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (size > MAX_SIZE) {
    return { valid: false, error: "File size must be less than 5MB" };
  }

  if (!ALLOWED_TYPES.includes(type)) {
    return { valid: false, error: "File type not supported" };
  }

  return { valid: true, error: null };
}