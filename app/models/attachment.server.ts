import { prisma } from "~/lib/db.server";
import type { Attachment } from "@prisma/client";
import { validateAttachment } from "./validation";

export async function getAttachments() {
  return prisma.attachment.findMany({
    include: {
      requirement: true,
      testResult: true,
    },
  });
}

export async function getAttachment(id: string) {
  return prisma.attachment.findUnique({
    where: { id },
    include: {
      requirement: true,
      testResult: true,
    },
  });
}

export async function getRequirementAttachments(requirementId: string) {
  return prisma.attachment.findMany({
    where: {
      requirementId,
    },
  });
}

export async function getTestResultAttachments(testResultId: string) {
  return prisma.attachment.findMany({
    where: {
      testResultId,
    },
  });
}

export async function createAttachment(
  data: Omit<Attachment, "id" | "createdAt">
) {
  const validation = validateAttachment(data.size, data.type);
  if (!validation.valid) {
    throw new Error(`Invalid attachment: ${validation.error}`);
  }

  return prisma.attachment.create({
    data,
    include: {
      requirement: true,
      testResult: true,
    },
  });
}

export async function deleteAttachment(id: string) {
  return prisma.attachment.delete({
    where: { id },
  });
}

export async function bulkDeleteAttachments(ids: string[]) {
  return prisma.attachment.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
}