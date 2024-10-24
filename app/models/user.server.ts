import { prisma } from "~/lib/db.server";
import type { User } from "@prisma/client";
import { validateUser } from "./validation";

export async function getUsers() {
  return prisma.user.findMany({
    include: {
      testRuns: true,
      requirements: true,
      testCases: true,
      comments: true,
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      testRuns: true,
      requirements: true,
      testCases: true,
      comments: true,
    },
  });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
    include: {
      testRuns: true,
      requirements: true,
      testCases: true,
      comments: true,
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      testRuns: true,
      requirements: true,
      testCases: true,
      comments: true,
    },
  });
}

export async function createUser(
  data: Omit<User, "id" | "createdAt" | "updatedAt">
) {
  const validation = validateUser(data);
  if (!validation.valid) {
    throw new Error(`Invalid user: ${validation.errors.join(", ")}`);
  }

  return prisma.user.create({
    data,
    include: {
      testRuns: true,
      requirements: true,
      testCases: true,
      comments: true,
    },
  });
}

export async function updateUser(
  id: string,
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
) {
  const validation = validateUser(data);
  if (!validation.valid) {
    throw new Error(`Invalid user: ${validation.errors.join(", ")}`);
  }

  return prisma.user.update({
    where: { id },
    data,
    include: {
      testRuns: true,
      requirements: true,
      testCases: true,
      comments: true,
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}

export async function getUserTestCases(userId: string) {
  return prisma.testCase.findMany({
    where: {
      createdById: userId,
    },
    include: {
      requirements: true,
      steps: true,
      testResults: true,
    },
  });
}

export async function getUserRequirements(userId: string) {
  return prisma.requirement.findMany({
    where: {
      createdById: userId,
    },
    include: {
      tags: true,
      testCases: true,
      comments: true,
    },
  });
}

export async function getUserTestRuns(userId: string) {
  return prisma.testRun.findMany({
    where: {
      executedById: userId,
    },
    include: {
      results: {
        include: {
          testCase: true,
          attachments: true,
        },
      },
    },
  });
}