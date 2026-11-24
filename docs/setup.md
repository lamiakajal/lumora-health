# Setup: database and sign-in

## 1. Create a free MongoDB Atlas database

1. Sign up at https://www.mongodb.com/cloud/atlas and create a free **M0** cluster.
2. **Database Access**: add a database user (username and password, save the password).
3. **Network Access**: add your current IP address (for quick local testing you can allow `0.0.0.0/0`, but remove it before going live).
4. **Connect, Drivers**: copy the connection string. Replace `<password>` and add the database name before the `?`:

   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/lumora?retryWrites=true&w=majority
   ```

## 2. Create `.env.local`

Copy `.env.example` to `.env.local` and fill in:

- `MONGODB_URI`: the string from step 1.
- `BETTER_AUTH_SECRET`: run `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` and paste the result.
- `BETTER_AUTH_URL`: `http://localhost:3000` for local work.

`.env.local` is ignored by Git. Never commit it.

## 3. Run it

```bash
npm install
npm run dev
```

Open `/register`, create an account, and you land in the patient portal.

## 4. Roles

Everyone who registers is a `patient`. To make an account a doctor or an administrator,
register it on the site first, then run:

```bash
node --env-file=.env.local scripts/set-role.mjs you@example.com admin
```

Roles: `patient`, `doctor`, `admin`. Sign out and back in to see the change.

## 5. Email (Resend)

Booking emails (requested, confirmed, cancelled, reminder) are sent through [Resend](https://resend.com).

1. Create a free Resend account and an **API key**.
2. Add it to `.env.local`:

   ```
   RESEND_API_KEY=re_xxxxxxxxx
   EMAIL_FROM="Lumora Health <onboarding@resend.dev>"
   ```

3. While testing with the shared `onboarding@resend.dev` sender, Resend only delivers to the
   email address you signed up to Resend with. To email real patients, add and verify your own
   domain in Resend and change `EMAIL_FROM`.

Without `RESEND_API_KEY` everything still works; the emails are just printed in the terminal.

## 6. Doctors

A doctor needs a normal account first (register on `/register`). Then link it to a doctor on the site:

```bash
node --env-file=.env.local scripts/link-doctor.mjs doctor@example.com amelia-hart
```

The second value is the doctor's address on the site (`/doctors/amelia-hart`). Sign out and back
in and the account sees `/dashboard`, where the doctor confirms visits, sets weekly hours and adds
time off.

## 7. Daily reminders

`vercel.json` asks Vercel to call `/api/cron/reminders` once a day. Set `CRON_SECRET` to any long
random text in your Vercel project's environment variables. Vercel sends it with the request, and
the route refuses anything else. (Vercel's free plan allows one run per day. A paid plan can run
it hourly by changing the schedule in `vercel.json`.)
