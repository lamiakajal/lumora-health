// Links a signed-up account to a doctor on the site and gives it the "doctor" role.
//   node --env-file=.env.local scripts/link-doctor.mjs doctor@example.com amelia-hart
// The slug is the doctor's address on the site, e.g. /doctors/amelia-hart.
import { MongoClient } from "mongodb";

const [email, slug, ...nameParts] = process.argv.slice(2);

if (!email || !slug) {
  console.error("Usage: node --env-file=.env.local scripts/link-doctor.mjs <email> <doctor-slug> [Dr. Full Name]");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing. Add it to .env.local first.");
  process.exit(1);
}

// Doctors with Canadian credentials work Eastern time (keep in step with src/lib/booking/defaults.ts).
const torontoDoctors = new Set(["samuel-tremblay", "henry-caldwell", "isabelle-roy", "grace-adeyemi"]);
const timezone = torontoDoctors.has(slug) ? "America/Toronto" : "America/Los_Angeles";

const titleCase = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const name = nameParts.join(" ") || `Dr. ${slug.split("-").map(titleCase).join(" ")}`;

const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const db = client.db();

  const user = await db.collection("user").findOne({ email: email.toLowerCase() });
  if (!user) {
    console.error(`No account found for ${email}. Register it on the site first.`);
    process.exit(1);
  }

  await db.collection("user").updateOne({ _id: user._id }, { $set: { role: "doctor" } });
  await db.collection("providers").updateOne(
    { slug },
    {
      $set: { userId: String(user._id) },
      $setOnInsert: { slug, name, serviceSlugs: [], bio: "", timezone, active: true, createdAt: new Date() },
      $currentDate: { updatedAt: true },
    },
    { upsert: true },
  );

  console.log(`Done: ${email} is now the doctor "${slug}". Sign out and back in to see the dashboard.`);
} finally {
  await client.close();
}
