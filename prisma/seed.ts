import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "admin@example.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // if it doesn't exist, it will throw an error, which we can ignore
  });

  const hashedPassword = await bcrypt.hash("adminpassword", 10);

  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      username: "admin",
      role: "Admin",
      status: "Active",
    },
  });

  console.log(`Database has been seeded. 🌱`);
  console.log(`Admin user created with email: ${admin.email}`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
