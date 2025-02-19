// seedDomains.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { API_GET_DOMAINS } = require("./API_GET_DOMAINS");

async function seedDomains() {
  const apiDomains = await API_GET_DOMAINS();

  try {
    // Wir gehen davon aus, dass es bereits einen Admin gibt,
    // der als Besitzer der Domain-Einträge verwendet wird.
    // Hier suchen wir beispielsweise nach einem User mit der E-Mail 'admin@test.de'
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@test.de" },
    });

    if (!adminUser) {
      console.error("Admin-User nicht gefunden. Bitte lege zuerst einen Admin-User an.");
      return;
    }

    // Für jeden Domain-Datensatz aus der API prüfen wir, ob der Eintrag bereits existiert.
    for (const domainData of apiDomains) {
      // Wir prüfen hier nach dem Namen und ob der Admin bereits zu den zugeordneten Nutzern gehört.
      const exists = await prisma.domain.findFirst({
        where: {
          name: domainData.name,
          users: {
            some: {
              id: adminUser.id,
            },
          },
        },
      });

      if (!exists) {
        await prisma.domain.create({
          data: {
            name: domainData.name,
            users: { connect: { id: adminUser.id } },
          },
        });
        console.log(`Domain ${domainData.name} wurde hinzugefügt.`);
      } else {
        console.log(`Domain ${domainData.name} existiert bereits.`);
      }
    }

    console.log("Alle Domains wurden erfolgreich synchronisiert.");
  } catch (error) {
    console.error("Fehler beim Befüllen der Domains:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDomains();
