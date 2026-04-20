# Donor Management — Implementation Notes

## What Was Built

Added a Donor Management section to the NourishNet Admin Panel, allowing admins to list all registered donors and suspend their accounts.

---

## Changes Made

### 1. `src/models/Donor.js` — Model Fix
- Renamed schema variable from `NgoSchema` to `DonorSchema`
- Fixed wrong export: `mongoose.models.Ngo` → `mongoose.models.Donor`
- Added `status` field (default: `"ACTIVE"`)
- Added `suspendedAt` field (Date, set when suspended)

### 2. `src/app/api/admin/donor/route.js` — Bug Fix
- Fixed typo in import: `@/lib/moDonordb` → `@/lib/mongodb`

### 3. `src/app/api/admin/donor/[id]/suspend/route.js` — Rewritten
- Was a copy of the NGO reject route (wrong logic)
- Now sets `status: "SUSPENDED"` and `suspendedAt: new Date()` on the donor document
- Returns 404 if donor not found

### 4. `src/app/admin/donors/page.js` — New Page
- Lists all donors from `/api/admin/donor`
- Filter tabs: ALL / ACTIVE / SUSPENDED
- Search by name or email (press Enter or Refresh)
- Table columns: Donor (name + role + avatar), Contact (email + phone), Address, Joined date, Status badge, Action
- Suspend button calls `PATCH /api/admin/donor/:id/suspend`
- Suspended donors show a disabled "Suspended" label instead of the button

### 5. `src/components/admin/Sidebar.jsx` — Navigation Update
- Added `Users` icon import from lucide-react
- Added "Donors" nav link pointing to `/admin/donors`

---

## How Suspend / Force Logout Works

Suspending a donor sets `status: "SUSPENDED"` in MongoDB.

For the donor to be **force-logged out**, the donor-facing app must check this field during session validation. Add a check like this in the donor app's auth middleware or NextAuth session callback:

```js
// Example: NextAuth JWT callback in the donor app
async jwt({ token }) {
  const donor = await Donor.findById(token.id).select("status");
  if (donor?.status === "SUSPENDED") {
    return null; // invalidates the session
  }
  return token;
}
```

Once this check is in place, the next API request the suspended donor makes will fail authentication and the app can redirect them to the login page.

---

## API Reference

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/donor` | Fetch donors. Query params: `status`, `search` |
| PATCH | `/api/admin/donor/:id/suspend` | Suspend a donor by ID |

---

## Donor Status Values

| Status | Meaning |
|--------|---------|
| `ACTIVE` | Donor can use the platform normally |
| `SUSPENDED` | Donor account is disabled; should be force-logged out |
