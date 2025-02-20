// seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  // Beispielpasswörter
  const adminPassword = process.env.ADMIN_PW || "1234";
  const userPassword = "1234";

  // Passwörter hashen
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const userPasswordHash = await bcrypt.hash(userPassword, 10);

  // Admin erstellen
  const admin = await prisma.user.create({
    data: {
      benutzername: process.env.ADMIN_USER || "admin",
      email: process.env.ADMIN_EMAIL || "admin@test.de",
      passwordHash: adminPasswordHash,
      isAdmin: true,
    },
  });

  // Normalen User erstellen
  const user = await prisma.user.create({
    data: {
      benutzername: "user",
      email: "user@test.de",
      passwordHash: userPasswordHash,
      isAdmin: false,
    },
  });

  console.log("Admin und User wurden erstellt:");
  console.log({ admin, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
