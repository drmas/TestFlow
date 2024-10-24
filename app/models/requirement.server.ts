import { prisma } from "~/lib/db.server";
import type { Requirement } from "@prisma/client";
import { validateRequirement } from "./validation";

export async function getRequirements() {
  return prisma.requirement.findMany({
    include: {
      createdBy: true,
      tags: true,
      testCases: true,
      relatedRequirements: true,
      comments: {
        include: {
          author: true,
        },
      },
      attachments: true,
    },
  });
}

export async function getRequirement(id: string) {
  return prisma.requirement.findUnique({
    where: { id },
    include: {
      createdBy: true,
      tags: true,
      testCases: true,
      relatedRequirements: true,
      comments: {
        include: {
          author: true,
        },
      },
      attachments: true,
    },
  });
}

export async function createRequirement(
  data: Omit<Requirement, "id" | "createdAt" | "updatedAt"> & {
    tags: string[];
  }
) {
  const validation = validateRequirement(data);
  if (!validation.valid) {
    throw new Error(`Invalid requirement: ${validation.errors.join(", ")}`);
  }

  return prisma.requirement.create({
    data: {
      ...data,
      tags: {
        connect: data.tags.map((tag) => ({ id: tag })),
      },
    },
    include: {
      createdBy: true,
      tags: true,
      testCases: true,
      relatedRequirements: true,
      comments: {
        include: {
          author: true,
        },
      },
      attachments: true,
    },
  });
}

export async function updateRequirement(
  id: string,
  data: Partial<Omit<Requirement, "id" | "createdAt" | "updatedAt">>
) {
  const validation = validateRequirement(data);
  if (!validation.valid) {
    throw new Error(`Invalid requirement: ${validation.errors.join(", ")}`);
  }

  return prisma.requirement.update({
    where: { id },
    data,
    include: {
      createdBy: true,
      tags: true,
      testCases: true,
      relatedRequirements: true,
      comments: {
        include: {
          author: true,
        },
      },
      attachments: true,
    },
  });
}

export async function deleteRequirement(id: string) {
  return prisma.requirement.delete({
    where: { id },
  });
}

export async function addTagToRequirement(requirementId: string, tagId: string) {
  return prisma.requirement.update({
    where: { id: requirementId },
    data: {
      tags: {
        connect: { id: tagId },
      },
    },
  });
}

export async function removeTagFromRequirement(requirementId: string, tagId: string) {
  return prisma.requirement.update({
    where: { id: requirementId },
    data: {
      tags: {
        disconnect: { id: tagId },
      },
    },
  });
}

export async function addRelatedRequirement(
  requirementId: string,
  relatedRequirementId: string
) {
  return prisma.requirement.update({
    where: { id: requirementId },
    data: {
      relatedRequirements: {
        connect: { id: relatedRequirementId },
      },
    },
  });
}

export async function removeRelatedRequirement(
  requirementId: string,
  relatedRequirementId: string
) {
  return prisma.requirement.update({
    where: { id: requirementId },
    data: {
      relatedRequirements: {
        disconnect: { id: relatedRequirementId },
      },
    },
  });
}