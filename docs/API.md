# PhishWise API Documentation

Complete API reference for the PhishWise phishing awareness training platform.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Format](#error-format)
- [Auth Routes](#auth-routes)
- [User Routes](#user-routes)
- [School Routes](#school-routes)
- [Simulation Routes](#simulation-routes)
- [Tracking Routes](#tracking-routes)
- [Training Routes](#training-routes)
- [Manager Routes](#manager-routes)
- [Admin Routes](#admin-routes)
- [Demo Routes](#demo-routes)
- [Error Codes Reference](#error-codes-reference)
- [Complete Simulation Flow](#complete-simulation-flow)

---

## Overview

PhishWise exposes a REST API built on Next.js App Router API routes. All endpoints live under `/api/` and return JSON unless otherwise noted. The API uses NextAuth.js JWT sessions for authentication and Zod for input validation.

**Base URL:** `https://your-domain.com` (production) or `http://localhost:3000` (development)

---

## Authentication

All protected routes require a valid NextAuth.js session cookie. Sessions are JWT-based (stateless) with a 30-day expiry.

### Authentication Methods

| Method | Endpoint | Description |
|--------|----------|-------------|
| Email + Password | `POST /api/auth/register` | Create account |
| Email + Password | Credentials provider | Sign in with email/password |
| Magic Link | `POST /api/auth/magic-link` | Passwordless sign-in via email |
| Password Reset | `POST /api/auth/forgot-password` | Request reset link |

### Roles

| Role | Description | Access |
|------|-------------|--------|
| `USER` | Student/trainee | Own dashboard, simulations, training |
| `MANAGER` | School administrator | School analytics, user management, invitations |
| `ADMIN` | Platform administrator | All schools, templates, modules, platform stats |

### Session Object

```json
{
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER | MANAGER | ADMIN",
    "schoolId": "cuid | null"
  }
}
```

---

## Rate Limiting

Rate limiting is enforced at two levels:

### Middleware-Level (In-Memory)

Applied in `middleware.ts` before the route handler runs:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /api/auth/forgot-password` | 3 requests | 15 minutes per IP |
| `POST /api/auth/magic-link` | 3 requests | 15 minutes per IP |
| `POST /api/auth/register` | 10 requests | 15 minutes per IP |
| `POST /api/auth/reset-password` | 5 requests | 15 minutes per IP |

### Route-Level (Upstash Redis)

Applied inside individual route handlers via `checkRateLimit()`:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /api/manager/invite` | 5 invitations | 1 hour per IP |
| `POST /api/demo/send-test-email` | 10 emails | 24 hours per user |
| `POST /api/schools/join` | 10 attempts | 1 hour per IP |
| `GET /api/track/click/[token]` | 100 clicks | 24 hours per IP |
| `GET /api/training/caught-data` | 20 requests | 24 hours per IP |

Rate-limited responses return HTTP 429:

```json
{ "error": "Too many requests. Try again later" }
```

---

## Error Format

All API errors follow a standardized format using the `ApiError` class:

```json
{
  "error": {
    "code": "ERR_CODE",
    "message": "Human-readable error description"
  }
}
```

Some older routes return the simpler format:

```json
{ "error": "Error message string" }
```

---

## Auth Routes

### POST /api/auth/register

Create a new user account with email and password.

- **Auth:** None (public)
- **Rate Limit:** 10 per 15 minutes per IP (middleware)

**Request Body:**

```json
{
  "name": "string (min 2 chars, required)",
  "email": "string (valid email, required)",
  "password": "string (min 8 chars, required)"
}
```

**Response (201):**

```json
{
  "success": true,
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Errors:**

| Status | Error |
|--------|-------|
| 400 | Validation error (name/email/password) |
| 409 | `"Email already registered"` |
| 500 | `"Registration failed"` |

---

### POST /api/auth/forgot-password

Request a password reset email. Always returns 200 to prevent email enumeration.

- **Auth:** None (public)
- **Rate Limit:** 3 per 15 minutes per IP (middleware)

**Request Body:**

```json
{
  "email": "string (valid email, required)"
}
```

**Response (200):**

```json
{ "success": true }
```

**Side Effects:**

- Deletes any existing reset tokens for the email
- Creates a new `AuthToken` with type `"reset"` (expires in 1 hour)
- Sends reset email with link to `/reset-password?token=...`

---

### POST /api/auth/reset-password

Reset password using a valid reset token.

- **Auth:** None (public)
- **Rate Limit:** 5 per 15 minutes per IP (middleware)

**Request Body:**

```json
{
  "token": "string (required)",
  "password": "string (min 8 chars, required)"
}
```

**Response (200):**

```json
{ "success": true }
```

**Errors:**

| Status | Error |
|--------|-------|
| 400 | `"This link is invalid or has expired."` |
| 500 | `"Request failed"` |

**Side Effects:**

- Hashes new password with bcryptjs (cost 12)
- Marks AuthToken as used (sets `usedAt`)

---

### POST /api/auth/magic-link

Send a magic link sign-in email. Always returns 200 to prevent email enumeration.

- **Auth:** None (public)
- **Rate Limit:** 3 per 15 minutes per IP (middleware)

**Request Body:**

```json
{
  "email": "string (valid email, required)"
}
```

**Response (200):**

```json
{ "success": true }
```

**Side Effects:**

- Deletes existing magic tokens for the email
- Creates `AuthToken` with type `"magic"` (expires in 30 minutes)
- Sends email with link to `/magic-signin?token=...`

---

## User Routes

### GET /api/users

Get authenticated user's profile, metrics, school info, and pending training.

- **Auth:** Required (any role)

**Response (200) for USER:**

```json
{
  "user": {
    "id": "cuid",
    "name": "string",
    "email": "string",
    "role": "USER",
    "schoolId": "cuid | null",
    "metrics": {
      "totalSent": 0,
      "totalClicked": 0,
      "totalCompleted": 0,
      "lastActivity": "datetime | null"
    },
    "school": {
      "id": "cuid",
      "name": "string",
      "inviteCode": "string"
    }
  },
  "pendingTraining": [
    { "id": "moduleId", "name": "Module Name" }
  ]
}
```

**Response (200) for MANAGER/ADMIN (additional field):**

```json
{
  "user": { ... },
  "pendingTraining": [ ... ],
  "schoolUsers": [
    {
      "id": "cuid",
      "name": "string",
      "email": "string",
      "metrics": { ... }
    }
  ]
}
```

---

### PATCH /api/users/profile

Update user profile settings.

- **Auth:** Required (any role)

**Request Body:**

```json
{
  "name": "string (1-100 chars, optional)",
  "simulationFrequencyOverride": "\"weekly\" | \"random\" | \"off\" | null (optional)",
  "resumeSimulations": "boolean (optional)"
}
```

**Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "cuid",
    "email": "string",
    "name": "string",
    "role": "string",
    "schoolId": "string | null",
    "unsubscribedAt": "datetime | null",
    "simulationFrequencyOverride": "string | null"
  }
}
```

**Notes:**

- Setting `resumeSimulations: false` sets `unsubscribedAt` to now (pauses simulations)
- Setting `resumeSimulations: true` clears `unsubscribedAt` (resumes simulations)
- `simulationFrequencyOverride` of `null` uses the school default

---

### PATCH /api/users/password

Change user password.

- **Auth:** Required (any role)

**Request Body:**

```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (min 8 chars, required)"
}
```

**Response (200):**

```json
{ "success": true }
```

**Errors:**

| Status | Error |
|--------|-------|
| 400 | `"No password set for this account"` (OAuth-only users) |
| 400 | Validation error (password too short) |
| 401 | `"Current password is incorrect"` |
| 500 | `"Failed to update password"` |

---

### GET /api/users/unsubscribe

Unsubscribe from phishing simulations via a signed token link (embedded in emails).

- **Auth:** None (public, token-based)
- **Query Params:** `token` (format: `userId.timestamp.hmacSignature`)

**Response:** Redirects to `/training?unsubscribed=1` on success

**Errors:** Redirects to `/?error=invalid_token` or `/?error=token_expired`

**Notes:**

- Token is HMAC-SHA256 signed with `NEXTAUTH_SECRET`
- Token expires after 30 days

---

## School Routes

### GET /api/schools

Get the authenticated user's school.

- **Auth:** Required (any role)

**Response (200):**

```json
{
  "school": {
    "id": "cuid",
    "name": "School Name",
    "inviteCode": "ABC12345"
  }
}
```

Returns `{ "school": null }` if user has no school.

---

### POST /api/schools

Create a new school. The creating user becomes MANAGER and is connected to the school.

- **Auth:** Required (any role, must not already belong to a school)

**Request Body:**

```json
{
  "name": "string (1-200 chars, required)"
}
```

**Response (201):**

```json
{
  "school": {
    "id": "cuid",
    "name": "School Name",
    "inviteCode": "A1B2C3D4",
    "createdBy": "userId",
    "frequency": "weekly"
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 409 | `ERR_ALREADY_IN_SCHOOL` | `"You are already a member of a school"` |
| 400 | `ERR_INVALID_INPUT` | `"Invalid input: name"` |

**Side Effects:**

- Creates school with random 8-character hex invite code
- Connects user to school
- Promotes user role to `MANAGER`

---

### POST /api/schools/join

Join an existing school using an invite code.

- **Auth:** Required (any role, must not already belong to a school)
- **Rate Limit:** 10 per hour per IP (Upstash Redis)

**Request Body:**

```json
{
  "inviteCode": "string (1-50 chars, required)"
}
```

**Response (200):**

```json
{
  "school": {
    "id": "cuid",
    "name": "School Name"
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INVITE` | `"Invalid or expired invite code"` |
| 409 | `ERR_ALREADY_IN_SCHOOL` | `"You are already a member of a school"` |
| 429 | - | `"Too many attempts. Try again later"` |

---

### PATCH /api/schools/[id]

Update school settings.

- **Auth:** Required (MANAGER, must belong to the school)

**Request Body:**

```json
{
  "name": "string (optional)",
  "autoAssignTraining": "boolean (optional)"
}
```

**Response (200):**

```json
{
  "school": { ... }
}
```

---

### DELETE /api/schools/[id]

Delete a school and all associated data.

- **Auth:** Required (MANAGER, must belong to the school)

**Request Body:**

```json
{
  "confirmationKey": "DELETE_{schoolId}"
}
```

**Response (200):**

```json
{ "message": "School deleted successfully" }
```

**Side Effects:**

- Deletes all simulation emails for the school's campaigns
- Deletes all campaigns for the school
- Disconnects all users from the school (sets `schoolId` to null)
- Deletes the school record

---

### PATCH /api/schools/[id]/frequency

Update the simulation frequency for a school.

- **Auth:** Required (MANAGER, must belong to the school)

**Request Body:**

```json
{
  "frequency": "\"daily\" | \"weekly\" | \"biweekly\" | \"monthly\" (required)",
  "cronExpression": "string (5-field cron, optional, nullable)"
}
```

**Response (200):**

```json
{
  "school": { ... }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_FREQUENCY` | `"Invalid frequency. Must be one of: daily, weekly, biweekly, monthly"` |
| 403 | `ERR_SCHOOL_MISMATCH` | `"You do not belong to this school"` |
| 404 | `ERR_NOT_FOUND` | `"School not found"` |

---

## Simulation Routes

### GET /api/simulations

Get simulation history for the authenticated user (paginated).

- **Auth:** Required (USER)

**Query Params:**

| Param | Type | Default | Range |
|-------|------|---------|-------|
| `limit` | integer | 10 | 1-50 |
| `offset` | integer | 0 | 0+ |

**Response (200):**

```json
{
  "simulations": [
    {
      "id": "cuid",
      "trackingToken": "string",
      "sentAt": "2026-03-15T10:00:00Z",
      "opened": false,
      "openedAt": null,
      "clicked": true,
      "clickedAt": "2026-03-15T10:05:00Z",
      "status": "sent",
      "template": {
        "name": "Template Name",
        "subject": "Email Subject",
        "difficulty": 3,
        "moduleId": "cuid"
      },
      "campaign": {
        "name": "Campaign Name"
      },
      "trainingCompleted": true
    }
  ],
  "total": 42
}
```

**Notes:**

- `trainingCompleted` is `true` if clicked and training done, `false` if clicked but pending, `null` if not clicked

---

### POST /api/simulations

Record a simulation click event (internal use).

- **Auth:** None (uses simulationId directly)

**Request Body:**

```json
{
  "simulationId": "string (required)"
}
```

**Response (200):**

```json
{
  "clicked": true,
  "moduleId": "templateId"
}
```

**Side Effects:**

- Sets `SimulationEmail.clicked = true`
- Increments `UserMetrics.totalClicked`

---

### POST /api/simulations/send

Send a phishing simulation email to a specific user with a chosen template.

- **Auth:** Required (MANAGER or ADMIN)

**Request Body:**

```json
{
  "userId": "string (required)",
  "templateId": "string (required)"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Simulation sent to user@example.com",
  "simulation": {
    "id": "cuid",
    "trackingToken": "cuid"
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 403 | `ERR_SCHOOL_MISMATCH` | Manager can only send to users in their school |
| 404 | `ERR_NOT_FOUND` | User or template not found |

**Side Effects:**

- Creates `SimulationEmail` record
- Sends phishing email via Resend/SendGrid
- Creates `UserHistory` entry (`simulation_sent`)

---

## Tracking Routes

### GET /api/track/click/[token]

Click tracking webhook. Called when a user clicks the masked link in a phishing simulation email.

- **Auth:** None (public)
- **Rate Limit:** 100 per day per IP (Upstash Redis)

**Path Params:** `token` — unique tracking token (must start with `tk_`)

**Response:** HTTP 302 redirect to `/training/{moduleId}/caught?token={token}`

**Side Effects (first click only):**

- Sets `SimulationEmail.clicked = true`, `clickedAt = now()`
- Creates `UserHistory` entry (`simulation_clicked`)
- Increments `UserMetrics.totalClicked`
- Creates `UserTraining` record (assigns training module)

**Notes:**

- Invalid tokens redirect to homepage
- Subsequent clicks for the same simulation are no-ops (still redirects)

---

### GET /api/track/open/[token]

Open tracking pixel. Embedded as `<img>` in phishing emails.

- **Auth:** None (public)

**Path Params:** `token` — tracking token (must start with `tk_`)

**Response:** 1x1 transparent GIF (`image/gif`) with `Cache-Control: no-cache`

**Side Effects (first open only):**

- Sets `SimulationEmail.opened = true`
- Updates `UserMetrics.lastActivity`

---

## Training Routes

### GET /api/training/[moduleId]

Get training module content and user's completion status.

- **Auth:** Required (USER)

**Response (200):**

```json
{
  "module": {
    "id": "cuid",
    "name": "Credential Harvesting",
    "description": "Learn to recognize credential theft attempts",
    "content": { ... }
  },
  "userStatus": {
    "completed": true,
    "completedAt": "2026-03-15T10:30:00Z",
    "assignedAt": "2026-03-15T10:00:00Z"
  },
  "isRequired": false
}
```

**Notes:**

- `userStatus` is `null` if user has never been assigned this module
- `isRequired` is `true` if user has an incomplete assignment for this module
- `content` is parsed JSON (structured training content)

---

### POST /api/training/[moduleId]/complete

Mark a training module as completed.

- **Auth:** Required (USER)

**Request Body:**

```json
{
  "passed": true,
  "score": 85
}
```

| Field | Type | Required | Range |
|-------|------|----------|-------|
| `passed` | boolean | yes | - |
| `score` | integer | no | 0-100 |

**Response (200):**

```json
{ "success": true }
```

**Side Effects (when passed = true):**

- Creates or updates `UserTraining` record with `completedAt = now()`
- Creates `UserHistory` entry (`training_completed`)
- Increments `UserMetrics.totalCompleted`

---

### GET /api/training/caught-data

Get phishing email details for the "you got caught" page.

- **Auth:** None (public, rate-limited)
- **Rate Limit:** 20 per day per IP (Upstash Redis)

**Query Params:** `token` (tracking token, required)

**Response (200):**

```json
{
  "subject": "Verify Your Account Now",
  "sender": "security@verify-account.com",
  "redFlags": [
    "Urgent language pressuring immediate action",
    "Sender domain doesn't match the company",
    "Generic greeting instead of your name"
  ]
}
```

---

### GET /api/training/modules

Get all active training modules with their active templates.

- **Auth:** None (public)

**Response (200):**

```json
{
  "modules": [
    {
      "id": "cuid",
      "name": "Credential Harvesting",
      "description": "Learn to recognize credential theft",
      "orderIndex": 1,
      "templates": [
        {
          "id": "cuid",
          "name": "Amazon Password Reset",
          "subject": "Your password has been changed",
          "difficulty": 3,
          "fromAddress": "security@amazon-verify.com"
        }
      ]
    }
  ]
}
```

---

## Manager Routes

### GET /api/manager/analytics

Get school-wide analytics and per-user performance data.

- **Auth:** Required (MANAGER)

**Response (200):**

```json
{
  "school": {
    "id": "cuid",
    "name": "PhishWise Demo School",
    "inviteCode": "DEMO2025",
    "frequency": "weekly",
    "totalUsers": 10,
    "createdAt": "2026-01-01T00:00:00Z"
  },
  "aggregateStats": {
    "totalSimulationsSent": 150,
    "totalSimulationsClicked": 45,
    "averageClickRate": 30,
    "usersNeedingAttention": 3
  },
  "userPerformance": [
    {
      "userId": "cuid",
      "name": "User Name",
      "email": "user@example.com",
      "totalSent": 15,
      "totalClicked": 5,
      "clickRate": 33,
      "lastSimulation": "2026-03-15T10:00:00Z",
      "trainingsCompleted": 3,
      "trend": -5.2
    }
  ],
  "recentActivity": []
}
```

**Notes:**

- `averageClickRate` and `clickRate` are percentages (0-100)
- `usersNeedingAttention` counts users with click rate > 30%
- Only includes users with role `USER` in the manager's school

---

### POST /api/manager/invite

Send a school invitation email to a prospective user.

- **Auth:** Required (MANAGER)
- **Rate Limit:** 5 per hour per IP (Upstash Redis)

**Request Body:**

```json
{
  "email": "string (valid email, required)"
}
```

**Response (200):**

```json
{ "success": true }
```

**Side Effects:**

- Sends invitation email containing the school's invite code and a signup link

---

### POST /api/manager/assign-training

Assign a training module to one or more users.

- **Auth:** Required (MANAGER)

**Request Body:**

```json
{
  "moduleId": "string (required)",
  "userId": "string (optional, single user)",
  "userIds": ["string", "string"]
}
```

One of `userId` or `userIds` (non-empty array) is required.

**Response (200):**

```json
{
  "assigned": 3,
  "moduleId": "cuid"
}
```

**Side Effects:**

- Creates or re-assigns `UserTraining` records
- Creates `UserHistory` entries (`training_assigned`)

---

### GET /api/manager/export

Export school analytics as a CSV file download.

- **Auth:** Required (MANAGER)

**Response:** CSV file (Content-Type: `text/csv`)

**CSV Columns:**

```
Name,Email,Simulations Sent,Links Clicked,Click Rate (%),Trainings Completed,Last Activity
```

**File Name:** `phishwise-report-YYYY-MM-DD.csv`

---

## Admin Routes

### GET /api/admin/platform-stats

Get platform-wide statistics.

- **Auth:** Required (ADMIN)

**Response (200):**

```json
{
  "totalUsers": 150,
  "totalSchools": 5,
  "totalSimulations": 500,
  "clickRate": 25,
  "topTemplates": [
    {
      "name": "Amazon Password Reset",
      "module": "Credential Harvesting",
      "total": 50,
      "clicked": 15,
      "clickRate": 30
    }
  ]
}
```

---

### GET /api/admin/templates

Get all email templates with module info and simulation counts.

- **Auth:** Required (ADMIN)

**Response (200):**

```json
{
  "templates": [
    {
      "id": "cuid",
      "moduleId": "cuid",
      "name": "Amazon Password Reset",
      "subject": "Your password has been changed",
      "body": "<html>...</html>",
      "fromAddress": "security@amazon-verify.com",
      "difficulty": 3,
      "isActive": true,
      "module": { "id": "cuid", "name": "Credential Harvesting" },
      "_count": { "simulations": 42 }
    }
  ]
}
```

---

### POST /api/admin/templates

Create a new email template.

- **Auth:** Required (ADMIN)

**Request Body:**

```json
{
  "moduleId": "string (required)",
  "name": "string (required)",
  "subject": "string (required)",
  "body": "string (HTML/MJML, required)",
  "difficulty": 3,
  "fromAddress": "string (valid email, optional)"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `moduleId` | string | yes | Must reference existing TrainingModule |
| `name` | string | yes | Template display name |
| `subject` | string | yes | Email subject line |
| `body` | string | yes | HTML email body |
| `difficulty` | integer | yes | 1-5 scale |
| `fromAddress` | string | no | Defaults to `security@verify-account.com` |

**Response (201):** Created template object with module info

---

### GET /api/admin/modules

Get all training modules with template and user progress counts.

- **Auth:** Required (ADMIN)

**Response (200):**

```json
{
  "modules": [
    {
      "id": "cuid",
      "name": "Credential Harvesting",
      "description": "...",
      "content": "...",
      "orderIndex": 1,
      "isActive": true,
      "_count": {
        "templates": 4,
        "userProgress": 25
      }
    }
  ]
}
```

---

### POST /api/admin/modules

Create a new training module.

- **Auth:** Required (ADMIN)

**Request Body:**

```json
{
  "name": "string (required)",
  "description": "string (required)",
  "content": "string (JSON, required)",
  "orderIndex": 0
}
```

**Response (201):** Created module object with counts

---

### GET /api/admin/users

Get all platform users (paginated, filterable, searchable).

- **Auth:** Required (ADMIN)

**Query Params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 25 | Results per page |
| `role` | string | - | Filter by role: `USER`, `MANAGER`, `ADMIN` |
| `search` | string | - | Search by name or email (case-insensitive) |

**Response (200):**

```json
{
  "users": [
    {
      "id": "cuid",
      "name": "User Name",
      "email": "user@example.com",
      "role": "USER",
      "schoolId": "cuid | null",
      "createdAt": "2026-01-01T00:00:00Z",
      "school": { "name": "School Name" },
      "metrics": {
        "totalSent": 10,
        "totalClicked": 3,
        "totalCompleted": 5
      },
      "_count": { "simulations": 10 }
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 25,
  "pages": 6
}
```

---

### POST /api/admin/trigger-simulation

Manually trigger a phishing simulation for a specific user by email.

- **Auth:** Required (MANAGER or ADMIN)

**Request Body:**

```json
{
  "email": "string (valid email, required)"
}
```

**Response (200):**

```json
{
  "success": true,
  "simulationId": "cuid",
  "message": "Phishing simulation sent to user@example.com"
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 403 | `ERR_SCHOOL_MISMATCH` | Manager tried to trigger for user outside their school |
| 404 | `ERR_NOT_FOUND` | `"User or school not found"` |
| 500 | `ERR_NO_TEMPLATE` | `"No email template available"` |
| 500 | `ERR_EMAIL_FAILED` | Email sending failed |

**Side Effects:**

- Selects a template the user hasn't recently received
- Creates `SimulationEmail` record
- Sends phishing email
- Increments `UserMetrics.totalSent`

---

## Demo Routes

### POST /api/demo/send-test-email

Send a test phishing simulation email (for demonstration).

- **Auth:** Required (any role)
- **Rate Limit:** 10 per day per user (Upstash Redis)

**Request Body:**

```json
{
  "email": "string (optional, defaults to session user's email)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Email sent"
}
```

---

## Error Codes Reference

| Code | HTTP Status | Message |
|------|-------------|---------|
| `ERR_UNAUTHORIZED` | 401 | Authentication required |
| `ERR_FORBIDDEN` | 403 | Insufficient permissions |
| `ERR_INVALID_INPUT` | 400 | Invalid input: {field} |
| `ERR_NOT_FOUND` | 404 | {resource} not found |
| `ERR_CONFLICT` | 409 | Conflict detail |
| `ERR_RATE_LIMIT` | 429 | Too many requests. Try again later |
| `ERR_INTERNAL` | 500 | Internal server error |
| `ERR_INVALID_INVITE` | 400 | Invalid or expired invite code |
| `ERR_INVALID_FREQUENCY` | 400 | Invalid frequency. Must be one of: ... |
| `ERR_SCHOOL_NOT_FOUND` | 404 | School not found |
| `ERR_SCHOOL_MISMATCH` | 403 | You do not belong to this school |
| `ERR_ALREADY_IN_SCHOOL` | 409 | You are already a member of a school |
| `ERR_NO_TEMPLATE` | 500 | No email template available |
| `ERR_EMAIL_FAILED` | 500 | Failed to send email |
| `ERR_INVALID_EMAIL` | 400 | Invalid email address |

---

## Complete Simulation Flow

This section describes the end-to-end flow of a phishing simulation:

```
1. SEND
   Manager/Admin triggers simulation
   POST /api/admin/trigger-simulation { email: "user@example.com" }
   OR
   POST /api/simulations/send { userId, templateId }
   -> Template selected, SimulationEmail created, email sent
   -> UserMetrics.totalSent incremented

2. DELIVER
   User receives phishing email in inbox
   Email contains:
   - Masked click link: /api/track/click/{trackingToken}
   - Open tracking pixel: /api/track/open/{trackingToken}

3. OPEN (optional)
   Email client loads tracking pixel
   GET /api/track/open/{token}
   -> SimulationEmail.opened = true
   -> Returns 1x1 transparent GIF

4. CLICK
   User clicks the phishing link
   GET /api/track/click/{token}
   -> SimulationEmail.clicked = true, clickedAt = now()
   -> UserMetrics.totalClicked incremented
   -> UserTraining record created (assigns training)
   -> UserHistory entry created (simulation_clicked)
   -> Redirects to /training/{moduleId}/caught?token={token}

5. CAUGHT PAGE
   User sees "you got phished" warning
   GET /api/training/caught-data?token={token}
   -> Returns email subject, sender, red flags
   -> User proceeds to training module

6. TRAINING
   User views training module
   GET /api/training/{moduleId}
   -> Returns module content and completion status

7. COMPLETE
   User finishes training quiz
   POST /api/training/{moduleId}/complete { passed: true, score: 85 }
   -> UserTraining.completedAt = now()
   -> UserMetrics.totalCompleted incremented
   -> UserHistory entry created (training_completed)

8. ANALYTICS
   Manager views results
   GET /api/manager/analytics
   -> School-wide stats, per-user click rates, completion rates
   GET /api/manager/export
   -> CSV download of all user performance data
```

---

## Database Schema Reference

For the complete database schema including all models, fields, indexes, and relations, see `prisma/schema.prisma`. Key models:

| Model | Description |
|-------|-------------|
| `User` | Platform users with role, school membership |
| `School` | Organizations with invite codes and frequency settings |
| `TrainingModule` | Educational content with structured JSON |
| `Template` | Phishing email templates linked to modules |
| `SimulationEmail` | Individual simulation records with tracking |
| `UserTraining` | Training assignments and completion records |
| `Campaign` | Groups of simulations for a school |
| `UserMetrics` | Denormalized counters (sent, clicked, completed) |
| `UserHistory` | Audit trail of user actions |
| `AuthToken` | One-time tokens for password reset and magic links |
