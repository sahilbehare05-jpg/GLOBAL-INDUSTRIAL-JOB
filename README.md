# Global Industrial Job

A full-stack MERN application for posting industrial job/recruitment notices, with a
free + premium (manual UPI payment) unlock system.

- **Frontend:** React (Vite) + Tailwind CSS + Framer Motion + React Icons
- **Backend:** Node.js + Express + MongoDB (Mongoose) + JWT Auth
- **Payment:** No gateway — UPI QR code + manual "I Have Paid" → admin approval

```
global-industrial-job/
├── backend/
│   ├── config/db.js
│   ├── controllers/        (auth, notice, payment logic)
│   ├── middleware/         (JWT auth, admin check)
│   ├── models/             (User, Notice, Payment)
│   ├── routes/             (auth, notices, payments)
│   ├── scripts/seedAdmin.js
│   ├── uploads/            (notice images)
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/     (Sidebar, NoticeCard, ProtectedRoute, Spinner)
    │   ├── context/AuthContext.jsx
    │   ├── pages/           (Home, Login, Register, AdminLogin, Dashboard,
    │   │                     NoticeDetails, Profile, admin/*)
    │   ├── services/api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── .env.example
```

## 1. Prerequisites

- Node.js v18+
- MongoDB running locally, or a free MongoDB Atlas cluster

## 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/global_industrial_job
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Create the default admin account (only needs to be run once):

```bash
node scripts/seedAdmin.js
```

This prints test admin credentials (see below).

Start the backend:

```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start
```

The API runs at `http://localhost:5000`.

## 3. Frontend Setup

In a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Visit `http://localhost:5173`.

`vite.config.js` already proxies `/api` and `/uploads` to `http://localhost:5000`,
so the frontend `.env` only needs `VITE_API_URL` if you deploy the backend elsewhere.

## 4. Test Admin Credentials

After running `node scripts/seedAdmin.js`:

```
Email:    admin@globalindustrialjob.com
Password: Admin@123
```

Log in at `/admin/login`. Change this password (or delete the user and re-seed
with your own) before deploying publicly.

## 5. How the Premium Payment Flow Works

1. Admin creates a notice and marks it **Premium**, sets a price (default ₹99).
2. A user opens the notice → sees "This information is Premium" + a UPI QR
   code and UPI ID (`globalindustrialjob@upi` — replace with your real UPI ID
   in `frontend/src/pages/NoticeDetails.jsx`).
3. User pays manually via any UPI app, then clicks **"I Have Paid."** This
   creates a `Payment` record with status `pending` — no money actually moves
   through this app, it's a manual/off-platform payment.
4. Admin goes to **Pending Payments**, verifies the payment came in on their
   UPI app, and clicks **Approve** (or **Reject**).
5. On approval, the notice is added to the user's `purchasedNotices`, and they
   can now see the full content.

## 6. Replacing the Demo QR Code

The demo uses a public QR-generation API for convenience:
`frontend/src/pages/NoticeDetails.jsx` → the `img src`. For production, either:

- Generate your own static UPI QR image (from your UPI app) and place it in
  `frontend/src/assets/`, then reference it directly, or
- Keep the dynamic QR generator but point `pa=` at your real UPI ID.

## 7. Notes / Next Steps

- File uploads are stored locally in `backend/uploads/` — for production,
  swap this for S3/Cloudinary.
- There's no "Total Users" count wired into the admin dashboard yet (no
  dedicated `/api/users` endpoint) — add a simple `GET /api/users/count`
  admin route if you want that card populated.
- Passwords are hashed with bcrypt; JWT tokens expire per `JWT_EXPIRES_IN`.
- All admin-only routes are protected by both `protect` (valid JWT) and
  `admin` (role check) middleware.
