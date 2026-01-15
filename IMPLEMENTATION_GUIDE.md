# KARTEJI Implementation Guide

## Overview
This document describes the complete implementation of data display and CRUD functionality for the KARTEJI application.

## Firebase Configuration

### Firebase Config (Already in place)
The Firebase configuration is located in `src/lib/firebase.js` with the following credentials:
- **API Key**: AIzaSyAQxpD7ea9gHWGiU3wYXr0XHyl-SNyFYNs
- **Project ID**: katar-9cac3
- **Auth Domain**: katar-9cac3.firebaseapp.com
- **Storage Bucket**: katar-9cac3.firebasestorage.app

### Cloudinary Configuration
Located in `src/lib/cloudinary.js`:
- **Cloud Name**: dbxktcwug
- **Upload Preset**: Karteji

## Features Implemented

### 1. Authentication Flow ✅
- **Registration** (`/auth/daftar`): Create new user accounts
- **Login** (`/auth/masuk`): Sign in existing users
- **Profile Creation** (`/auth/buat-profil`): Set up user profile after registration
- **Pending Approval** (`/pending`): Waiting screen for admin approval

### 2. Home Page ✅
**Location**: `src/pages/home.js`

**Features**:
- Displays latest 3 announcements
- Displays latest 3 activities
- Displays latest 3 posts/feed
- Real-time updates using Firestore listeners
- Empty state handling
- Error handling

**Collections Used**:
- `announcements` (ordered by `createdAt`)
- `activities` (ordered by `date`)
- `posts` (ordered by `createdAt`)

### 3. Feed/Posts ✅
**Location**: `src/pages/feed.js`

**Features**:
- Create new posts with text content
- Upload images with Cloudinary
- Display all posts in chronological order
- Real-time updates
- Shows author name, timestamp, and content
- Image preview before upload
- Like and comment counters (display only)

**Permissions**:
- All approved users can create and view posts
- Users can only edit/delete their own posts

**Collections Used**:
- `posts` (main collection)

### 4. Activities ✅
**Location**: `src/pages/activities.js`

**Features**:
- List all activities with status indicators
- Create new activities (authorized users only)
- Display activity details (title, description, date, location)
- Status badges (draft, published, completed, cancelled)

**Permissions**:
- View: All approved users
- Create/Edit: super_admin, ketua, wakil_ketua, sekretaris, koordinator_sie

**Collections Used**:
- `activities` (main collection)
- `activities/{id}/attendance` (sub-collection for attendance tracking)

### 5. Finance/Kas ✅
**Location**: `src/pages/finance.js`

**Features**:
- Display all financial transactions
- Add new transactions (income/expense)
- Upload receipt images with Cloudinary
- Show balance summary (income, expense, balance)
- Currency formatting in IDR
- Transaction history with date and creator info

**Permissions**:
- View: All approved users
- Create/Edit: super_admin, ketua, bendahara

**Collections Used**:
- `finance_transactions`

### 6. Members ✅
**Location**: `src/pages/members.js`

**Features**:
- List all approved members
- Search functionality by name or sie
- Display member roles and sie
- Visual role badges
- Online status indicator (placeholder)

**Permissions**:
- View: All approved users

**Collections Used**:
- `profiles` (filtered by `approvalStatus == 'approved'`)

### 7. Admin - User Management ✅
**Location**: `src/pages/admin/users.js`

**Features**:
- View all users with filter tabs (pending, approved, rejected, all)
- Approve pending users
- Reject pending users
- Re-approve rejected users
- Display user roles and status

**Permissions**:
- Only super_admin can access

**Cloud Functions Used**:
- `adminApproveUser` (to change approval status)

**Collections Used**:
- `profiles` (all users)

### 8. Admin - Role Management ✅
**Location**: `src/pages/admin/roles.js`

**Features**:
- View all members with their current roles
- Edit extraRoles for members
- Available roles: ketua, wakil_ketua, sekretaris, bendahara, koordinator_sie
- Modal dialog for role editing
- Restrictions: Cannot edit super_admin or self

**Permissions**:
- super_admin: Can edit all users except self
- ketua/wakil_ketua: Can edit users except super_admin and self

**Cloud Functions Used**:
- `adminSetExtraRoles` (to update user roles)

**Collections Used**:
- `profiles` (filtered by approved)

### 9. Documents ✅
**Location**: `src/pages/documents.js`

**Features**:
- Upload documents (images, PDFs, DOC files)
- Display document list with title and description
- Download/view documents via Cloudinary URLs
- Show upload date and creator

**Permissions**:
- View: All approved users
- Upload: super_admin, ketua, sekretaris

**Collections Used**:
- `documents`

### 10. Minutes (Notulen) ✅
**Location**: `src/pages/minutes.js`

**Features**:
- Create meeting minutes with comprehensive fields:
  - Title
  - Meeting date
  - Location
  - Attendees
  - Agenda
  - Meeting content/notes
  - Decisions
- Display all minutes in chronological order
- Show full meeting details

**Permissions**:
- View: All approved users
- Create: super_admin, ketua, sekretaris

**Collections Used**:
- `minutes`

## Firestore Security Rules

The complete Firestore rules have been updated in `firestore.rules` to match the requirements:

### Key Rules:
- **Profiles**: Users can only read/create their own profile. Updates are controlled by Cloud Functions.
- **Posts**: Approved users can create/read. Authors can update/delete their own posts.
- **Activities**: Approved users can read. Authorized roles can create/edit.
- **Finance**: Approved users can read. Authorized roles (super_admin, ketua, bendahara) can manage.
- **Announcements**: Approved users can read. Admins can create/edit.
- **Documents/Minutes**: Approved users can read. Authorized roles can create/edit.

## Cloud Functions

Located in `functions/index.js`:

### Existing Functions:
1. **onAuthCreateProfile**: Auto-creates profile when user registers. First user becomes super_admin.
2. **adminApproveUser**: Allows super_admin to approve/reject users.
3. **adminSetExtraRoles**: Allows admins to assign extra roles to users.
4. **onActivityPublishPrepareAttendance**: Auto-creates attendance records when activity is published.
5. **refreshCalendarEvents**: Scheduled function for calendar updates (placeholder).

## Technical Implementation Details

### Real-time Updates
All pages use Firestore's `onSnapshot` for real-time data synchronization:
```javascript
onSnapshot(query, (snapshot) => {
  // Update UI with latest data
});
```

### Security
- XSS Protection: All user input is escaped using `escapeHtml()` function
- CSRF Protection: Firebase Auth tokens
- Input Validation: Client-side and server-side (via rules)

### Image Upload Flow
1. User selects image file
2. Preview shown using FileReader
3. On submit, file uploaded to Cloudinary
4. Cloudinary URL stored in Firestore
5. Images displayed using secure URLs

### Role-Based Access Control (RBAC)
Roles are checked both client-side (for UI) and server-side (in Firestore rules):
- Client: Check profile document for roles
- Server: Rules check `myProfile().roles` and `myProfile().extraRoles`

### Available Roles
- **anggota**: Default role for all users
- **super_admin**: Full system access (cannot be changed via UI)
- **ketua**: Organization leader
- **wakil_ketua**: Vice leader
- **sekretaris**: Secretary
- **bendahara**: Treasurer
- **koordinator_sie**: Section coordinator

## Deployment Steps

### 1. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 2. Deploy Cloud Functions
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 3. Deploy Hosting
```bash
firebase deploy --only hosting
```

Or for Vercel:
```bash
vercel --prod
```

## Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login with existing user
- [ ] Create profile after registration
- [ ] See pending approval page
- [ ] Admin approves user
- [ ] User can access main app

### Data Display
- [ ] Home page shows latest data
- [ ] Feed displays all posts
- [ ] Activities list loads
- [ ] Finance shows transactions and balance
- [ ] Members list displays approved users
- [ ] Documents list loads
- [ ] Minutes list loads

### CRUD Operations
- [ ] Create new post with image
- [ ] Create new activity (as authorized user)
- [ ] Add finance transaction with receipt
- [ ] Upload document
- [ ] Create meeting minutes
- [ ] Edit user roles (as admin)
- [ ] Approve/reject users (as super_admin)

### Permissions
- [ ] Regular users cannot create activities
- [ ] Non-bendahara cannot add finance transactions
- [ ] Non-sekretaris cannot upload documents
- [ ] Non-super_admin cannot approve users

## Known Limitations

1. **Pagination**: Not implemented for large datasets. Consider adding pagination when collections grow beyond 50-100 items.
2. **Comments**: Comment functionality is stubbed but not fully implemented.
3. **Likes**: Like functionality is stubbed but not fully implemented.
4. **Calendar**: Basic calendar page exists but not fully implemented.
5. **Attendance**: Attendance tracking prepared but UI not fully built.

## Future Enhancements

1. Add pagination/infinite scroll for large lists
2. Implement post comments and likes
3. Add activity attendance QR code scanning
4. Export financial reports to PDF
5. Add push notifications
6. Implement search across all content
7. Add data export functionality
8. Implement audit logging UI
9. Add analytics dashboard

## Support

For issues or questions, please contact the development team or refer to the Firebase documentation:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Functions](https://firebase.google.com/docs/functions)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
