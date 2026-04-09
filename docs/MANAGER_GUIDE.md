# PhishWise Manager Guide

A complete guide for school managers on the PhishWise phishing awareness training platform.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Managing Your School](#managing-your-school)
- [Inviting Users](#inviting-users)
- [Sending Simulations](#sending-simulations)
- [Assigning Training](#assigning-training)
- [Analytics and Reporting](#analytics-and-reporting)
- [School Settings](#school-settings)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

As a school manager, you oversee a group of users in the PhishWise platform. Your responsibilities include:

- **Inviting users** to join your school
- **Sending phishing simulations** to test awareness
- **Assigning training modules** to users who need improvement
- **Reviewing analytics** to track progress over time
- **Adjusting settings** like simulation frequency

You become a manager either by creating a school (which auto-promotes your role) or by being promoted by a platform administrator.

---

## Getting Started

### Creating a School

If your organization does not yet have a school in PhishWise:

1. Sign in to PhishWise
2. On your dashboard, click **Create School**
3. Enter your school name (e.g., "Business Department", "IT Security Team")
4. Click **Create**
5. Your role is automatically upgraded to **MANAGER**
6. An **invite code** is generated (e.g., `A1B2C3D4`) -- save this

The invite code is how users join your school. It is displayed on your manager dashboard and in the onboarding flow.

### Accessing the Manager Dashboard

After creating or being assigned to a school, your navigation bar updates to show manager-specific pages:

- **Dashboard** -- School analytics overview
- **Users** -- View all school members and their performance
- **Simulations** -- Send simulations and view history
- **Training** -- Manage training module assignments
- **Settings** -- School configuration

---

## Managing Your School

### Viewing School Info

Your manager dashboard displays:

- **School name**
- **Invite code** (share with users to join)
- **Simulation frequency** (how often simulations are sent)
- **Total users** in your school
- **Date created**

### School Users

The Users section shows all members of your school with:

| Column | Description |
|--------|-------------|
| Name | User's display name |
| Email | User's email address |
| Simulations Sent | Total phishing emails received |
| Links Clicked | How many they fell for |
| Click Rate | Percentage clicked (lower is better) |
| Trainings Completed | Modules finished |
| Last Activity | Most recent interaction |

Users with a click rate above 30% are flagged as "needing attention."

---

## Inviting Users

### By Invite Code

Share your school's invite code with users. They can join by:

1. Signing in to PhishWise
2. Entering the invite code on their dashboard
3. Clicking **Join**

The invite code is displayed on your manager dashboard.

### By Email Invitation

To send a formal invitation:

1. Go to your manager dashboard
2. Click **Invite Users**
3. Enter the recipient's email address
4. Click **Send Invitation**
5. The user receives an email with your invite code and a sign-up link

**Rate Limit:** 5 invitations per hour. Plan bulk invitations accordingly.

### What the User Receives

The invitation email includes:

- Your school's name
- The invite code (displayed prominently)
- A direct link to sign up with the code pre-filled
- Instructions to get started

---

## Sending Simulations

### Automatic Scheduling

When your school has a frequency set (weekly, biweekly, monthly, daily), the scheduler automatically sends simulations to eligible users. The system:

1. Selects users who are due for a simulation
2. Picks a template they have not recently received
3. Sends the phishing email
4. Records the simulation in their history

### Manual Simulation (Single User)

To send a simulation to a specific user immediately:

1. Go to the Simulations page
2. Click **Send Simulation**
3. Select the target user
4. Select a phishing email template
5. Click **Send**

The system sends the email and records the simulation. You can see the result in the user's simulation history.

### Manual Simulation (by Email)

Alternatively, use the trigger simulation feature:

1. Go to Admin tools (if you have access)
2. Enter the user's email address
3. The system automatically selects an appropriate template
4. Click **Trigger Simulation**

This method is useful when you want the system to pick the best template based on what the user has not yet seen.

### Template Selection

Each phishing email template is associated with a training module and has a difficulty rating (1-5):

| Difficulty | Description | Example |
|------------|-------------|---------|
| 1 | Obvious phishing | Misspelled company name, generic greeting |
| 2 | Basic phishing | Urgent tone, slightly suspicious sender |
| 3 | Moderate | Convincing sender, realistic subject line |
| 4 | Advanced | Company-branded template, personalized greeting |
| 5 | Expert | Near-identical to real company emails |

Start new users with lower difficulty templates and increase over time as they improve.

### What Users See

When a user receives a simulation email:

1. **If they do not click** -- No action needed, simulation recorded as safe
2. **If they click the link** -- They are redirected to a "You Got Caught" page showing the red flags in that email, then to the associated training module

---

## Assigning Training

### Automatic Assignment

When a user clicks a phishing simulation link, they are automatically assigned the training module associated with that email template. This is the primary training mechanism.

### Manual Assignment

To assign training to specific users:

1. Go to the Training management page
2. Select the training module
3. Select one or more users
4. Click **Assign**

Use cases for manual assignment:

- New users who should complete baseline training
- Users with high click rates who need additional education
- Mandatory training for compliance requirements

### Bulk Assignment

You can assign a module to multiple users at once by selecting multiple user checkboxes or providing a list of user IDs via the API.

### Tracking Completion

Assigned but incomplete training appears on the user's dashboard as "Pending Training." You can track completion status in:

- **Analytics page** -- See completions per user
- **CSV export** -- Download completion data

---

## Analytics and Reporting

### Dashboard Overview

Your manager dashboard shows aggregate statistics:

- **Total Simulations Sent** -- All simulations to your school's users
- **Total Simulations Clicked** -- How many were clicked
- **Average Click Rate** -- School-wide percentage
- **Users Needing Attention** -- Count of users with click rate above 30%

### Per-User Performance

The user performance table shows individual metrics:

| Metric | Description |
|--------|-------------|
| Total Sent | Simulations received by this user |
| Total Clicked | Simulations this user clicked |
| Click Rate | Percentage (0-100, lower is better) |
| Trainings Completed | Number of modules finished |
| Last Simulation | Date of most recent activity |
| Trend | Click rate direction (negative = improving) |

### CSV Export

To export your school's data:

1. Go to Analytics
2. Click **Export as CSV**
3. A file downloads named `phishwise-report-YYYY-MM-DD.csv`

CSV columns:
- Name
- Email
- Simulations Sent
- Links Clicked
- Click Rate (%)
- Trainings Completed
- Last Activity

Use this data for:
- Monthly reports to leadership
- Compliance documentation
- Identifying users who need additional support
- Tracking improvement over time

### Key Metrics to Track

**Click Rate Benchmarks:**

| Rate | Assessment | Action |
|------|-----------|--------|
| 0-10% | Excellent | Maintain current program |
| 10-20% | Good | Continue regular simulations |
| 20-30% | Average | Increase frequency, assign targeted training |
| 30%+ | Needs attention | Individual coaching, mandatory training |

**Industry Context:**

The average phishing click rate across organizations is approximately 15-25%. A well-run awareness program should bring this below 10% within 6-12 months.

---

## School Settings

### Simulation Frequency

Control how often your users receive simulations:

| Frequency | Schedule |
|-----------|----------|
| Daily | One simulation per day |
| Weekly | One simulation per week |
| Biweekly | One simulation every two weeks |
| Monthly | One simulation per month |

To change:
1. Go to School Settings
2. Select a new frequency
3. Click **Save**

### Custom Schedule (Cron)

For advanced scheduling, provide a cron expression:

```
Minute Hour Day Month Weekday

Examples:
0 9 * * 1     -- Every Monday at 9:00 AM
0 14 1 * *    -- First of every month at 2:00 PM
0 10 * * 1-5  -- Weekdays at 10:00 AM
```

### User Overrides

Individual users can override the school frequency in their personal settings:

- **Use school default** -- Follows your school schedule
- **Weekly/Random/Off** -- Personal override

You cannot currently prevent users from pausing simulations. If compliance requires mandatory participation, communicate this through your organization's policies.

### School Name

Update your school's display name in Settings. This appears in invitation emails and on user dashboards.

---

## Best Practices

### 1. Start with a Baseline

Before beginning simulations:
- Assign introductory training modules to all users
- Send a low-difficulty simulation to establish baseline click rates
- Use this data to set realistic improvement goals

### 2. Vary Your Approach

- **Rotate templates** -- Do not send the same phishing email twice
- **Vary difficulty** -- Mix easy and hard simulations
- **Change timing** -- Do not always send on the same day/time
- **Use different themes** -- Account verification, package delivery, password reset, invoice

The system automatically avoids recently-used templates when selecting simulations.

### 3. Follow Up on Clicks

When a user clicks a simulation:
- The system automatically assigns training
- Check that they complete the training module
- For repeat clickers (3+ clicks), consider:
  - Assigning additional modules
  - One-on-one coaching
  - Increasing their simulation frequency

### 4. Track Progress Over Time

- Export CSV reports monthly
- Compare click rates quarter-over-quarter
- Celebrate improvements with your team
- Share anonymized results with leadership

### 5. Communicate the Purpose

Make sure users understand:
- PhishWise is a training tool, not a punishment system
- Everyone clicks occasionally -- the goal is improvement
- Simulations help protect the organization from real attacks
- Their individual results are only visible to managers

### 6. Timing Recommendations

| Scenario | Frequency | Difficulty |
|----------|-----------|------------|
| New program launch | Weekly | 1-2 |
| First 3 months | Weekly | 2-3 |
| Established program | Biweekly | 3-4 |
| Advanced users | Monthly | 4-5 |
| After a real incident | Daily (1 week) | 3-5 |

---

## Troubleshooting

### Users Did Not Receive Invitation Email

- Verify the email address is correct
- Ask users to check their spam/junk folder
- Ensure your email provider (Resend/SendGrid) is configured correctly
- Check if you have hit the rate limit (5 invitations per hour)
- Try sending again after the rate limit window resets

### Users Cannot Join with Invite Code

- Ensure the invite code is entered correctly (case-insensitive, whitespace trimmed)
- The user must be signed in first
- The user must not already belong to another school
- If the user was previously in a school, their `schoolId` may need to be cleared by an admin

### Simulations Are Not Sending

- Verify your school's frequency is set (check School Settings)
- Ensure the scheduler is enabled (`enableScheduler = true`)
- Check that users are subscribed (not paused/unsubscribed)
- Verify email provider configuration (Resend API key)
- For manual sends, ensure you have MANAGER role

### Analytics Not Updating

- Simulation data updates in real-time when clicks occur
- Give the system a few moments to process after a simulation is sent
- Refresh the page to see latest data
- If metrics seem incorrect, they may need to be recalculated (contact admin)

### User Shows Wrong Click Rate

- Click rate is calculated from `UserMetrics` (denormalized counters)
- If a user's metrics seem off, the admin can trigger a recalculation
- New users with zero simulations show 0% click rate

### CSV Export Is Empty

- Ensure your school has users with role `USER`
- Users must have received at least one simulation to appear in the export
- Check that you are logged in as MANAGER for the correct school

### Cannot Send Simulation to a User

- Verify the user is in your school (managers can only target their own school)
- The user must have a valid email address
- There must be at least one active template available
- Check the error message for specific details

---

## API Reference

For programmatic access to manager features, see the [API Documentation](./API.md). Key endpoints:

| Action | Method | Endpoint |
|--------|--------|----------|
| View analytics | GET | `/api/manager/analytics` |
| Send invitation | POST | `/api/manager/invite` |
| Assign training | POST | `/api/manager/assign-training` |
| Export CSV | GET | `/api/manager/export` |
| Send simulation | POST | `/api/simulations/send` |
| Trigger simulation | POST | `/api/admin/trigger-simulation` |
| Update frequency | PATCH | `/api/schools/[id]/frequency` |
