import { prisma } from "~/lib/db.server";
import type { Tag } from "@prisma/client";
import { validateTag } from "./validation";

export async function getTags() {
  return prisma.tag.findMany({
    include: {
      requirements: true,
    },
  });
}

export async function getTag(id: string) {
  return prisma.tag.findUnique({
    where: { id },
    include: {
      requirements: true,
    },
  });
}

export async function getTagByName(name: string) {
  return prisma.tag.findUnique({
    where: { name },
    include: {
      requirements: true,
    },
  });
}

export async function createTag(
  data: Omit<Tag, "id" | "createdAt">
) {
  const validation = validateTag(data);
  if (!validation.valid) {
    throw new Error(`Invalid tag: ${validation.errors.join(", ")}`);
  }

  return prisma.tag.create({
    data,
    include: {
      requirements: true,
    },
  });
}

export async function updateTag(
  id: string,
  data: Partial<Omit<Tag, "id" | "createdAt">>
) {
  const validation = validateTag(data);
  if (!validation.valid) {
    throw new Error(`Invalid tag: ${validation.errors.join(", ")}`);
  }

  return prisma.tag.update({
    where: { id },
    data,
    include: {
      requirements: true,
    },
  });
}

export async function deleteTag(id: string) {
  return prisma.tag.delete({
    where: { id },
  });
}

export async function getRequirementTags(requirementId: string) {
  return prisma.tag.findMany({
    where: {
      requirements: {
        some: {
          id: requirementId,
        },
      },
    },
  });
}