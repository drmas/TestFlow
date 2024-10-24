import { prisma } from "~/lib/db.server";
import type { TestCase } from "@prisma/client";
import { validateTestCase } from "./validation";

export async function getTestCases() {
  return prisma.testCase.findMany({
    include: {
      createdBy: true,
      steps: true,
      requirements: true,
      testResults: {
        include: {
          testRun: true,
          attachments: true,
        },
      },
    },
  });
}

export async function getTestCaseByRequirement(requirementId: string) {
  return prisma.testCase.findMany({
    where: {
      requirements: {
        some: { id: requirementId },
      },
    },
  });
}

export async function getTestCase(id: string) {
  return prisma.testCase.findUnique({
    where: { id },
    include: {
      createdBy: true,
      steps: true,
      requirements: true,
      testResults: {
        include: {
          testRun: true,
          attachments: true,
        },
      },
    },
  });
}

export async function createTestCase(
  data: Omit<TestCase, "id" | "createdAt" | "updatedAt">
) {
  const validation = validateTestCase(data);
  if (!validation.valid) {
    throw new Error(`Invalid test case: ${validation.errors.join(", ")}`);
  }

  return prisma.testCase.create({
    data,
    include: {
      createdBy: true,
      steps: true,
      requirements: true,
      testResults: {
        include: {
          testRun: true,
          attachments: true,
        },
      },
    },
  });
}

export async function updateTestCase(
  id: string,
  data: Partial<Omit<TestCase, "id" | "createdAt" | "updatedAt">>
) {
  const validation = validateTestCase(data);
  if (!validation.valid) {
    throw new Error(`Invalid test case: ${validation.errors.join(", ")}`);
  }

  return prisma.testCase.update({
    where: { id },
    data,
    include: {
      createdBy: true,
      steps: true,
      requirements: true,
      testResults: {
        include: {
          testRun: true,
          attachments: true,
        },
      },
    },
  });
}

export async function deleteTestCase(id: string) {
  return prisma.testCase.delete({
    where: { id },
  });
}

export async function bulkDeleteTestCases(ids: string[]) {
  return prisma.testCase.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
}

export async function bulkUpdateTestCases(
  ids: string[],
  data: Partial<Omit<TestCase, "id" | "createdAt" | "updatedAt">>
) {
  return prisma.testCase.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data,
  });
}

export async function addRequirementToTestCase(testCaseId: string, requirementId: string) {
  return prisma.testCase.update({
    where: { id: testCaseId },
    data: {
      requirements: {
        connect: { id: requirementId },
      },
    },
  });
}

export async function removeRequirementFromTestCase(testCaseId: string, requirementId: string) {
  return prisma.testCase.update({
    where: { id: testCaseId },
    data: {
      requirements: {
        disconnect: { id: requirementId },
      },
    },
  });
}