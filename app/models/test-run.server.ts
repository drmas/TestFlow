import { prisma } from "~/lib/db.server";
import type { TestRun, TestResult } from "@prisma/client";
import { validateTestRun } from "./validation";

export async function getTestRuns() {
  return prisma.testRun.findMany({
    include: {
      executedBy: true,
      results: {
        include: {
          testCase: true,
          attachments: true,
        },
      },
    },
  });
}

export async function getTestRun(id: string) {
  return prisma.testRun.findUnique({
    where: { id },
    include: {
      executedBy: true,
      results: {
        include: {
          testCase: true,
          attachments: true,
        },
      },
    },
  });
}

export async function createTestRun(
  data: Omit<TestRun, "id" | "createdAt" | "updatedAt">
) {
  const validation = validateTestRun(data);
  if (!validation.valid) {
    throw new Error(`Invalid test run: ${validation.errors.join(", ")}`);
  }

  return prisma.testRun.create({
    data,
    include: {
      executedBy: true,
      results: {
        include: {
          testCase: true,
          attachments: true,
        },
      },
    },
  });
}

export async function updateTestRun(
  id: string,
  data: Partial<Omit<TestRun, "id" | "createdAt" | "updatedAt">>
) {
  const validation = validateTestRun(data);
  if (!validation.valid) {
    throw new Error(`Invalid test run: ${validation.errors.join(", ")}`);
  }

  return prisma.testRun.update({
    where: { id },
    data,
    include: {
      executedBy: true,
      results: {
        include: {
          testCase: true,
          attachments: true,
        },
      },
    },
  });
}

export async function deleteTestRun(id: string) {
  return prisma.testRun.delete({
    where: { id },
  });
}

export async function addTestResult(
  testRunId: string,
  data: Omit<TestResult, "id" | "createdAt">
) {
  return prisma.testResult.create({
    data: {
      ...data,
      testRun: {
        connect: { id: testRunId },
      },
    },
    include: {
      testCase: true,
      attachments: true,
    },
  });
}

export async function updateTestResult(
  id: string,
  data: Partial<Omit<TestResult, "id" | "createdAt">>
) {
  return prisma.testResult.update({
    where: { id },
    data,
    include: {
      testCase: true,
      attachments: true,
    },
  });
}

export async function deleteTestResult(id: string) {
  return prisma.testResult.delete({
    where: { id },
  });
}