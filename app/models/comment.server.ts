import { prisma } from "~/lib/db.server";
import type { Comment } from "@prisma/client";
import { validateComment } from "./validation";

export async function getComments() {
  return prisma.comment.findMany({
    include: {
      author: true,
      requirement: true,
    },
  });
}

export async function getComment(id: string) {
  return prisma.comment.findUnique({
    where: { id },
    include: {
      author: true,
      requirement: true,
    },
  });
}

export async function getRequirementComments(requirementId: string) {
  return prisma.comment.findMany({
    where: {
      requirementId,
    },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function createComment(
  data: Omit<Comment, "id" | "createdAt">
) {
  const validation = validateComment(data);
  if (!validation.valid) {
    throw new Error(`Invalid comment: ${validation.errors.join(", ")}`);
  }

  return prisma.comment.create({
    data,
    include: {
      author: true,
      requirement: true,
    },
  });
}

export async function updateComment(
  id: string,
  data: Partial<Pick<Comment, "text">>
) {
  const validation = validateComment(data);
  if (!validation.valid) {
    throw new Error(`Invalid comment: ${validation.errors.join(", ")}`);
  }

  return prisma.comment.update({
    where: { id },
    data,
    include: {
      author: true,
      requirement: true,
    },
  });
}

export async function deleteComment(id: string) {
  return prisma.comment.delete({
    where: { id },
  });
}