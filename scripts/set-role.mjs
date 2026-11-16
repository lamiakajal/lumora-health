// Gives an existing account a role. Run it from the project folder:
//   node --env-file=.env.local scripts/set-role.mjs you@example.com admin
import { MongoClient } from "mongodb";

const [email, role] = process.argv.slice(2);
const allowed = ["patient", "doctor", "admin"];

if (!email || !allowed.includes(role)) {
  console.error("Usage: node --env-file=.env.local scripts/set-role.mjs <email> <patient|doctor|admin>");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing. Add it to .env.local first.");
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const result = await client
    .db()
    .collection("user")
    .updateOne({ email: email.toLowerCase() }, { $set: { role } });
  console.log(result.matchedCount ? `Done: ${email} is now "${role}".` : `No account found for ${email}. Register it on the site first.`);
} finally {
  await client.close();
}
