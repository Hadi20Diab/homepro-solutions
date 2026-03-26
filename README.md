This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# HomePro Solutions

A full-stack **home maintenance & repair services** website built with **Next.js**, **Firebase**, and **Supabase**. Features a public site, admin dashboard, and CMS for managing services, projects, blog, and customer submissions.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root directory with:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=homepro-solutions
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com

# Firebase Admin (for server-side operations)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# Supabase (image storage)
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_SUPABASE_BUCKET=homepro-images
```

### 3. Seed Initial Data
```bash
npm run db:seed
```
This creates:
- 4 example projects
- Blog & news posts
- 5 admin users (see seed.ts for credentials)
- Sample submissions
- Site home & about content

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 📋 What to Do After First Run

### ✅ Setup Supabase Storage (for image uploads)
1. Go to [Supabase Console](https://supabase.com)
2. Navigate to **Storage** → **homepro-images** bucket → **Policies**
3. Add a policy:
   - **Operation**: SELECT, INSERT, DELETE
   - **Roles**: anon, authenticated
   - **Policy**: `true`

### ✅ Deploy Firestore Rules
1. Go to [Firebase Console](https://console.firebase.google.com)
2. **Firestore Database** → **Rules**
3. Replace with contents of `firestore.rules`
4. Click **Publish**

---

## 🏗️ Project Structure

| Path | Purpose |
|------|---------|
| `/src/app/(public)` | Public pages (home, projects, blog, about, contact) |
| `/src/app/dashboard` | Admin dashboard (manage content, submissions, users) |
| `/src/lib/firestore` | Firestore helpers & queries |
| `/src/lib/storage.ts` | Supabase image upload/delete |
| `/scripts/seed.ts` | Database seeding |

---

## 📝 Default Admin Credentials

After running `npm run db:seed`:

| Email | Password | Role |
|-------|----------|------|
| admin@homepro.com | HomePro@2025! | admin |
| projects@homepro.com | HomePro@2025! | editor_projects |
| services@homepro.com | HomePro@2025! | editor_services |
| blog@homepro.com | HomePro@2025! | editor_blog |
| news@homepro.com | HomePro@2025! | editor_news |

---

## 🔧 Useful Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run db:seed    # Populate test data
npm run lint       # Run ESLint
```

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, SCSS
- **Backend/Auth**: Firebase (Auth + Firestore)
- **Storage**: Supabase
- **UI**: React Icons, React Hot Toast

---

## ✨ Key Features

✅ Dynamic public website  
✅ Admin dashboard with role-based access  
✅ CMS for home, about, projects, blog, news, services  
✅ Project interest form with dashboard tracking  
✅ Contact form with submissions  
✅ Image upload to Supabase  
✅ User management  
✅ Mobile-responsive design
