# PhishWise Final Proposal - Complete Extraction & Analysis

**Document:** Team 20 - Final Proposal - report (1).pdf
**Course:** University of Arkansas CSCE Department Capstone I - Fall 2025
**Team:** Paul Tribble, Milo Pumford, Sarah Smith, Shane Norden, Victor Berrios, Warren Olvey

---

## 1. ORIGINAL PROJECT REQUIREMENTS & SPECIFICATIONS

### 1.1 Problem Statement
- **Context:** 3.4 billion phishing emails sent daily; Google blocks ~100 million daily
- **Gap:** Existing solutions (KnowBe4, Sophos, Proofpoint) target enterprises, starting at $3.25/person for 25-50 users
- **Target Audience:** Individuals, families, small groups, elderly users (particularly vulnerable: 150K cybercrime complaints from 60+, $5B in losses)
- **Core Problem:** Lack of accessible, affordable phishing awareness training for average users

### 1.2 Project Objective
Develop a **functional prototype** of a web-based phishing training system that:
1. Allows users to create accounts and join/create "schools" (groups)
2. Simulates realistic phishing attacks via email
3. Redirects users to training modules when they click malicious links
4. Tracks user progress visible to managers and users
5. Hosts on Vercel with scalable backend for future public release

---

## 2. PROPOSED TECHNOLOGY STACK

### 2.1 Frontend
- **Framework:** React + TypeScript (strict mode)
- **Styling:** CSS, HTML, responsive design tested with Chrome DevTools
- **Third-party APIs:** Twilio API (mentioned), GraphQL

### 2.2 Backend
- **Server:** Vercel (serverless environment)
- **API:** GraphQL (for efficient data fetching)
- **Language/Runtime:** Node.js (implied via Vercel)

### 2.3 Database
- **Type:** PostgreSQL
- **Hosting:** Vercel Postgres or free-tier cloud provider
- **Pattern:** Tables for users, schools, templates, modules, events

### 2.4 Authentication & Authorization
- **OAuth:** Google Cloud OAuth 2.0
- **Session Management:** Standard OAuth token exchange + session cookies

### 2.5 Email & Communication
- **Primary:** SendGrid (for phishing simulations, registration emails)
- **Free tier:** Up to 100 emails/day (sufficient for prototype)
- **Fallback:** Twilio API (mentioned as option)

### 2.6 Learning Management
- **TalentLMS:** Cloud-based LMS for organizing and delivering training content
- **Purpose:** Store curriculum, track completion, provide feedback

### 2.7 Development Tools
- **Version Control:** GitHub
- **IDE/Testing:** Chrome DevTools, pgAdmin/TablePlus
- **Design:** Figma (free tier)
- **Package Manager:** npm/Node.js

---

## 3. PLANNED FEATURES & FUNCTIONALITY

### 3.1 Core User Workflows

#### General User Workflow
1. Sign up via Google OAuth 2.0
2. Optionally join a "school" using invite code
3. Receive randomized phishing simulations via email on unpredictable schedule
4. On email open: system logs "opened"
5. On link click: system logs interaction, redirects to instant feedback page
6. After feedback: directed to training module matching template
7. Access personal dashboard: simulation history, metrics, training progress

#### Manager Workflow
1. Begin as general user
2. Create a school (becomes manager)
3. Obtain elevated permissions within school
4. Access manager dashboard showing all school members' metrics
5. Monitor outcomes, track improvement
6. Adjust simulation frequency for group
7. Assign targeted training modules
8. Send school invitations via email with join codes
9. Optional: receive simulations themselves to experience training pipeline

#### Administrator Workflow
1. No direct involvement in simulations
2. System-level maintenance:
   - Manage email-sending infrastructure
   - Maintain phishing template library
   - Update training module content
   - Oversee backend scheduling (when simulations send)
   - Ensure system stability, integrations
3. Access anonymized platform-wide analytics
4. Evaluate usage patterns, identify trends

### 3.2 Detailed Feature List

| Feature | Status | Description |
|---------|--------|-------------|
| Google OAuth Login | Core | Seamless sign-in, Google manages credentials |
| User Registration | Core | Email capture, account creation |
| School Creation | Core | Managers create groups for oversight |
| Join School | Core | Users enter invite code to link to school |
| Phishing Email Dispatch | Core | SendGrid integration, template selection, randomized scheduling |
| Click Tracking | Core | Embedded tracking tokens in email links |
| Open Tracking | Core | Log when users open phishing emails |
| Instant Feedback | Core | Short page explaining missed red flags after click |
| Training Modules | Core | Curriculum-based content modules, 7-section format |
| Module Redirection | Core | Auto-redirect to module matching template after failure |
| User Dashboard | Core | View simulation history, metrics, completion status |
| Manager Dashboard | Core | Analytics for all school users, frequency controls, assignment UI |
| Analytics Queries | Core | Calculate click rates, completion rates, aggregated metrics |
| Simulation Scheduler | Core | Random intervals, manager-configurable frequency |
| Join Code Generation | Core | Secure codes for inviting users to schools |
| Email Invitations | Core | Manager-to-user invitation mechanism |
| Simulation Frequency Settings | Core | Manager adjusts how often group receives simulations |
| Module Assignment | Core | Manager assigns supplemental training to users |
| Charts/Visualizations | Core | Frontend analytics displays (recharts implied) |
| Admin Template Management | Core | Add/update/delete phishing templates |
| Admin Module Management | Core | Update training content |
| Anonymized Analytics Access | Core | Platform-wide trends for admins |

---

## 4. USER ROLES & WORKFLOWS

### 4.1 Role Capabilities Matrix

| Capability | General User | Manager | Admin |
|-----------|---|---|---|
| Receives Simulations (default) | Yes | Optional | No |
| View Own Metrics | Yes | Yes | No |
| View School Metrics | No | Yes | All |
| View All Schools/Content | No | No | Yes |
| Assign Training | No | Yes | No |
| Create Schools | Yes (becomes manager) | - | No |
| Invite Users | No | Yes | No |
| System Access | No | No | Yes |

### 4.2 User Journey: Click-to-Training Loop

1. **Simulation Dispatch:** Backend scheduler selects template, formats message, sends via SendGrid
2. **Email Reception:** User receives in inbox, appears legitimate
3. **Click Action:** User clicks link containing tracking token
4. **Backend Logging:** Request routed to server, event logged in database
5. **Lookup:** System retrieves user ID, template ID, associated module
6. **Redirect:** User redirected to instant feedback page
7. **Feedback Display:** Page shows failure, highlights missed red flags, explains tactic
8. **Training Launch:** User directed to full training module
9. **Completion:** Module tracked in database, metrics updated
10. **Visibility:** Manager sees in dashboard, metrics aggregated

---

## 5. DATABASE SCHEMA & MODELS

### 5.1 Planned Data Models

**User Table**
- Email (primary contact for simulations)
- Google ID (primary key from OAuth)
- Name
- School ID (FK - which school belongs to)
- Role indicator

**School Table**
- School ID (primary key)
- Name
- Invite Code (unique)
- Frequency Setting (weekly/random/custom)
- Created By / Timestamp

**Template Table**
- Template ID (primary key)
- Module ID (FK - which training module)
- Subject
- Body
- From Address
- Difficulty Level (1-5)
- Active/Inactive flag

**Training Module Table**
- Module ID (primary key)
- Name
- Description
- Content (full text/MDX)
- Order Index
- Active flag

**SimulationEmail Table**
- Email ID (primary key)
- User ID (FK)
- Template ID (FK)
- Campaign ID (FK)
- Tracking Token (unique)
- Sent At (timestamp)
- Opened (boolean + timestamp)
- Clicked (boolean + timestamp)
- Status (draft/sent/opened/clicked)

**UserTraining Table** (Completion progress)
- User ID (FK)
- Module ID (FK)
- Assigned At (timestamp)
- Completed At (timestamp/NULL if pending)
- Score (if quiz taken)

**Campaign Table**
- Campaign ID (primary key)
- School ID (FK)
- Name
- Schedule Type (random/weekly/custom)
- Status (active/paused)

**Event Logs Table**
- Event ID (primary key)
- User ID (FK)
- Event Type (opened/clicked/completed)
- Module ID (FK if applicable)
- Timestamp
- Details/Notes

### 5.2 Key Relationships
- User → School (many-to-one, can only belong to one school)
- User → SimulationEmail (one-to-many, receives multiple emails)
- User → UserTraining (one-to-many, completes multiple modules)
- Template → TrainingModule (many-to-one, multiple templates per module)
- School → Campaign (one-to-many)
- Campaign → SimulationEmail (one-to-many)

---

## 6. UI/UX DESIGN APPROACH

### 6.1 Design Principles
- **Responsive:** Standardized across desktops, tablets, mobile devices
- **Accessible:** Simple, clear user experience
- **Modern:** React + TypeScript for resilience and scalability
- **Efficient:** Minimal server load, client-side module rendering where possible

### 6.2 Key Pages (Mentioned in Proposal)

**Public Pages**
- Landing page
- Google OAuth login page
- Signup page (redirects to login)

**User Dashboard Pages**
- General user dashboard (stats, simulation history)
- Simulation history table with status indicators
- Training module pages and layout
- Module completion tracking

**Manager Dashboard Pages**
- Manager analytics dashboard
- User list for school
- School statistics
- Module assignment features
- Simulation frequency settings UI
- Join code / invite display

**Training Pages**
- Training module viewer (full 7-section format)
- Instant feedback page (on phishing click)
- Practice check (quiz after module)
- "I Caught This" submission page (optional feature)

**Settings/Admin**
- User settings (if applicable)
- Manager school settings

### 6.3 Key UI Components
- Charts and visualizations (Recharts implied but not specified)
- Status indicators for simulations (sent/opened/clicked)
- User list tables with filtering
- Interactive frequency sliders/selectors
- Join code display/copy functionality
- Module navigation (7-section structure)
- Practice quizzes with instant feedback

### 6.4 Data Visualization
- Simulation history graphs (open rate, click rate over time)
- User performance metrics (number of simulations received, click rate percentage)
- School-level analytics (member count, average click rate, completion rate)
- Administrator trends (platform-wide statistics, anonymized)

---

## 7. TIMELINE & DELIVERABLES

### 7.1 Project Schedule

**Phase 1: Initialization & Architecture (01/12 - 02/02)**
- Finalize requirements and role scope
- Design database schema
- Create template categories and module outlines
- Set up Vercel server environment
- Set up React frontend
- Implement Google OAuth login

**Phase 2: Backend Core (02/02 - 03/09)**
- Build PostgreSQL instance + seed data
- Draft full training module content
- Write phishing email templates
- Set up GraphQL server + basic queries
- GraphQL mutations for logging, modules, settings
- Backend ↔ Frontend integration planning
- SendGrid email integration
- Tokenized tracking links implementation
- Redirect endpoint (lookup module)

**Phase 3: Frontend & Integration (03/09 - 04/06)**
- Training module pages (frontend)
- Manager dashboard UI
- School creation + join codes
- Simulation scheduler (frequency, random selection)
- Scheduler ↔ Email integration
- Analytics queries (school stats, event logs)
- Frontend charts + analytics visuals
- End-to-end integration testing

**Phase 4: Testing & Finalization (04/06 - 05/02)**
- System testing (multiuser, browser, email clients)
- Bug fixing + UI polish
- Finalize templates & modules
- Write documentation (API, user guide, manager guide)
- Prepare final presentation & demo

### 7.2 Deliverables

1. **Fully Functional Prototype**
   - Complete simulation-training loop
   - Phishing email generation and dispatch
   - Interaction tracking
   - Training module redirection
   - User progress tracking

2. **Working Backend**
   - PostgreSQL database (schema and seeded data)
   - Vercel-hosted server
   - GraphQL API with resolvers
   - SendGrid integration
   - OAuth authentication system

3. **Deployed Web Application**
   - React frontend (responsive, accessible)
   - User dashboard
   - Manager dashboard
   - Training module viewer
   - Authentication and authorization

4. **Documentation Package**
   - Development environment setup guide
   - OAuth configuration instructions
   - Deployment guide
   - API documentation
   - User guide
   - Manager guide
   - Curriculum documentation

5. **Design Assets**
   - Figma mockups
   - Architectural diagrams
   - Database schema diagram

6. **Source Code**
   - React application
   - GraphQL API
   - OAuth configuration
   - Email dispatch logic
   - Database code
   - All supporting assets

### 7.3 Success Criteria
- Emails can be sent to users
- Interactions are logged correctly
- User progress is tracked in database
- Managers can view accurate school analytics via dashboard
- Training modules display correctly after click
- System handles multiple concurrent users

---

## 8. KEY TEAM PERSONNEL

| Name | Role | Background |
|------|------|-----------|
| **Paul Tribble** | Backend Lead | Software dev, cybersecurity, phishing detection models, red-team testing, server setup. Leading Vercel, email/tracking systems, database design. |
| **Sarah Smith** | Frontend Lead | Jr. at UofA, past J.B. Hunt intern, full-stack API development, agile cross-team experience. Leading UX and frontend development. |
| **Milo Pumford** | Backend Dev | Senior CS, will assist with background research and backend development. |
| **Warren Olvey** | Architecture & Backend | Senior CE, software dev experience, internship/current remote dev role at Arkansas Electric. Helping with architecture and backend. |
| **Victor Berrios** | Cybersecurity & UX | Senior CE with Cybersecurity concentration, cryptography/security coursework, 100+ hours curriculum design. Designing training modules and improving UX/frontend. |
| **Shane Norden** | Backend & Database | Senior CS, experience in software dev, database management, cybersecurity. Assisting with backend and server implementation. |

---

## 9. INFRASTRUCTURE & COSTS

### 9.1 Development Environment
- **Personal laptops/desktops** - No cost
- **GitHub** - Free (public repo)
- **Development tools** - Free (Node.js, npm, TypeScript, Chrome DevTools, pgAdmin, Figma free tier)

### 9.2 Cloud Services

| Service | Cost | Purpose |
|---------|------|---------|
| Vercel Pro | $20/month | Frontend, backend, database hosting |
| SendGrid Free Tier | Free (100 emails/day) | Phishing simulation emails |
| SendGrid Essentials | $19.95/month (if needed) | Higher email volume |
| Google Cloud OAuth | Free | Authentication (unless quota exceeded) |
| PostgreSQL (Vercel or free-tier) | Free/$9-15/month | Database hosting |

### 9.3 Testing Environment
- Team laptops
- Personal mobile devices
- No additional hardware required

---

## 10. CURRENT IMPLEMENTATION VS. PROPOSAL COMPARISON

### ✅ IMPLEMENTED AS PROPOSED
- [x] Google OAuth 2.0 authentication
- [x] PostgreSQL database with multiple models
- [x] Next.js server (upgraded from bare Vercel)
- [x] React + TypeScript frontend
- [x] SendGrid email integration
- [x] Phishing email simulation dispatch
- [x] Click tracking with tokens
- [x] Training module redirect system
- [x] User dashboard with metrics
- [x] Manager dashboard with school analytics
- [x] School creation and join functionality
- [x] User invitation system
- [x] Role-based access control
- [x] GraphQL support (considered, now REST API used instead)

### ⚠️ DIVERGED FROM PROPOSAL
1. **GraphQL → REST API:** Proposal specified GraphQL; current implementation uses REST API routes
2. **TalentLMS → Custom Modules:** Proposal mentioned TalentLMS; current uses custom Markdown-based modules
3. **Twilio → Not Used:** Mentioned in proposal; not in current implementation
4. **Framework:** Proposal was generic "Vercel"; current uses Next.js 14 App Router (significant upgrade)
5. **Styling:** Proposal mentioned CSS/HTML; current uses Tailwind CSS + shadcn/ui with glassmorphism theme

### 🚀 ENHANCEMENTS BEYOND PROPOSAL
1. **Zod Validation:** Input validation library (not in proposal)
2. **Rate Limiting:** Upstash Redis-based rate limiting (not in proposal)
3. **Security Headers:** CSP, HSTS, X-Frame-Options middleware (not in proposal)
4. **Structured Logging:** JSON logging infrastructure (not in proposal)
5. **Error Codes:** 15 standardized error codes (not in proposal)
6. **Password Management:** User password change with bcryptjs (beyond proposal scope)
7. **Profile Management:** User profile editing (beyond proposal scope)
8. **CSV Export:** School analytics CSV export (beyond proposal scope)
9. **Dashboard Redesign:** Glassmorphism UI retheme (design enhancement)
10. **Mobile Responsive:** 2-column grids, overflow handling (proposal mentioned responsive, implementation is more detailed)

---

## 11. CURRICULUM & TRAINING MODULES

### 11.1 Training Module Structure (7-Section Format)

1. **Overview** - Description of scam type, why attackers use it, how common
2. **Social Engineering Tactics** - Psychological manipulation techniques
3. **Red Flags** - Warning signs per CISA/NIST standards
4. **Attack Objective** - What attackers want from this phishing type
5. **Examples** - Common examples with red flag annotations
6. **Prevention Steps** - Simple, actionable prevention steps
7. **Practice Check** - Multiple-choice quiz (mandatory if user failed simulation)

### 11.2 Curriculum Design
- **Sources:** CISA and NIST guidelines
- **Categories:** Credential theft, invoice scams, shipping scams, etc. (examples)
- **Instant Feedback:** Users told they failed, shown missed red flags, explained tactics
- **Seamless Transition:** Feedback → Full module → Practice quiz

### 11.3 Template System
- **Flexible Structure:** Fill-in-the-blank + multiple options for variety
- **Tagging:** Each template linked to corresponding module
- **Library Management:** Admins maintain and update templates as threats evolve
- **Manager Access:** Browse available templates for selection

---

## 12. REFERENCES FROM PROPOSAL

1. Grilli et al. - Older adults struggle to identify phishing
2. Cofense - Phishing threat database
3. Valimail - Phishing guide
4. NIST - Phishing definition
5. FBI IC3 2024 - Cybercrime complaints from 60+ age group
6. CanIPhish - Competitive platform
7. Microsoft Defender - Enterprise attack simulation
8. PhishingBox - Free phishing test platform
9. AAG IT Support - Phishing statistics (3.4B emails/day)
10. Pew Research Center - Online scams in America
11. McKnight Brain Institute - Older age as phishing risk factor
12. Hoxhunt - Business phishing costs
13. Terranova Security - Social engineering attacks
14. KnowBe4 - Pricing example ($3.25/person for 25-50 users)

---

## SUMMARY

The original PhishWise proposal outlined a **web-based phishing awareness training system** designed for individuals and small groups, not enterprises. The proposal specified:

- **Technology:** React, TypeScript, PostgreSQL, Google OAuth, SendGrid, GraphQL (proposed but later changed to REST), TalentLMS (proposed but replaced with custom modules)
- **Architecture:** Two-tier client-server with Vercel hosting
- **Core Features:** Phishing simulations, click tracking, training redirection, user/manager dashboards, school management
- **Timeline:** 4 months (01/12 - 05/02)
- **Team:** 6 seniors, led by Paul Tribble (backend/infrastructure) and Sarah Smith (frontend/UX)

The **current implementation** largely follows the proposal but with significant technical upgrades (Next.js instead of bare Vercel, Tailwind+shadcn instead of plain CSS, REST API instead of GraphQL) and substantial additions (rate limiting, security headers, logging, validation, password management, CSV export, glassmorphism UI).

The system is **feature-complete for the proposal's MVP** and has exceeded it with production-ready security and modern tooling.
