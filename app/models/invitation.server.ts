import { prisma } from "~/lib/db.server";

export async function createInvitation(createdBy: string) {
  const inviteCode = generateInviteCode();
  return prisma.invitation.create({
    data: {
      code: inviteCode,
      createdBy,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });
}

export async function validateInvitation(code: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { code },
  });

  if (!invitation) return false;
  if (invitation.expiresAt < new Date()) return false;
  if (invitation.usedAt) return false;

  return true;
}

export async function useInvitation(code: string) {
  return prisma.invitation.update({
    where: { code },
    data: { usedAt: new Date() },
  });
}

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
