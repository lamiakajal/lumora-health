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
