import type { DemoProject } from "@/types";

/**
 * Five demo PRDs (PRD §11.2). Each is a realistic but intentionally imperfect
 * requirements document so the analyzer surfaces meaningful findings across all
 * seven categories (ambiguity, missing acceptance criteria, inconsistent flows,
 * missing permissions, weak edge cases, testability risks, unclear requirements).
 */
export const DEMO_PROJECTS: DemoProject[] = [
  {
    key: "meeting-room-booking",
    name: "Meeting Room Booking",
    blurb: "Internal room reservation with check-in & conflict rules.",
    accent: "bg-teal-mint",
    prd: `# PRD: Meeting Room Booking System

## 1. Overview
An internal tool for employees to reserve meeting rooms across offices. The system should prevent double-booking and make it easy to find an available room quickly.

## 2. Functional Requirements

### 2.1 Booking
- **FR1:** A user can book a room for a selected time slot.
- **FR2:** The system should not allow overlapping bookings for the same room.
- **FR3:** Users receive a confirmation email after booking.
- **FR4:** A user can cancel their booking.

### 2.2 Check-in
- **FR5:** Users must check in within 15 minutes of the booking start or the room is released.
- **FR6:** Admins can override check-in rules.

### 2.3 Rooms
- **FR7:** Each room lists capacity and equipment.
- **FR8:** Rooms can be marked unavailable for maintenance.

## 3. Non-Functional Requirements
- The system should be fast and responsive.
- Availability should be accurate.

## 4. Open Questions
- What happens if two users book the same room at the exact same second?
- Do recurring bookings need to be supported?
`,
  },
  {
    key: "ecommerce-checkout",
    name: "E-commerce Checkout",
    blurb: "Multi-step checkout with payments, coupons & shipping.",
    accent: "bg-yellow",
    prd: `# PRD: E-commerce Checkout

## 1. Overview
A checkout flow that lets customers review their cart, apply discounts, choose shipping, and pay. The flow must feel smooth and minimize abandoned carts.

## 2. Functional Requirements

### 2.1 Cart
- **FR1:** Customers can add and remove items from the cart.
- **FR2:** The cart total updates when items change.
- **FR3:** Customers can apply a promo code.

### 2.2 Shipping
- **FR4:** Customers choose between Standard and Express shipping.
- **FR5:** Express shipping is only available in select regions.
- **FR6:** Shipping cost is calculated automatically.

### 2.3 Payment
- **FR7:** Customers pay with card.
- **FR8:** The system processes the payment and shows a confirmation.
- **FR9:** On payment failure, the order is not created.

## 3. Non-Functional Requirements
- Checkout should be secure.
- Pages should load quickly.

## 4. Open Questions
- Which regions support Express shipping?
- What happens to the cart if a promo code expires mid-checkout?
- Are taxes included in the displayed total?
`,
  },
  {
    key: "banking-app",
    name: "Banking App",
    blurb: "Mobile banking with transfers, balances & security.",
    accent: "bg-coral",
    prd: `# PRD: Mobile Banking App

## 1. Overview
A mobile banking application that lets customers view balances, transfer money, and manage their cards securely.

## 2. Functional Requirements

### 2.1 Authentication
- **FR1:** Customers log in with their credentials.
- **FR2:** Sensitive actions require additional verification.

### 2.2 Accounts & Transfers
- **FR3:** Customers can view their account balances.
- **FR4:** Customers can transfer money to other accounts.
- **FR5:** Transfers above a threshold require approval.
- **FR6:** Customers can schedule recurring transfers.

### 2.3 Cards
- **FR7:** Customers can freeze and unfreeze their cards.
- **FR8:** Customers can view recent transactions.

## 3. Non-Functional Requirements
- The app must be secure.
- Transactions must be accurate.
- The system should be highly available.

## 4. Open Questions
- What is the threshold for transfers requiring approval?
- How long is a session valid before re-authentication?
- What are the limits on scheduled recurring transfers?
`,
  },
  {
    key: "saas-crm",
    name: "SaaS CRM",
    blurb: "Sales pipeline, contacts, roles & reporting.",
    accent: "bg-lavender",
    prd: `# PRD: SaaS CRM

## 1. Overview
A customer relationship management tool for sales teams to track leads, deals, and customer interactions through a pipeline.

## 2. Functional Requirements

### 2.1 Contacts & Leads
- **FR1:** Sales reps can create and edit contacts.
- **FR2:** Leads can be assigned to reps.
- **FR3:** Contacts can be imported via CSV.

### 2.2 Pipeline
- **FR4:** Deals move through pipeline stages.
- **FR5:** Managers can see all deals across the team.
- **FR6:** Reps can only see their own deals.

### 2.3 Reporting
- **FR7:** The system generates sales reports.
- **FR8:** Reports can be exported.

## 3. Non-Functional Requirements
- The system should be easy to use.
- Data should be consistent.

## 4. Open Questions
- Who can reassign a deal to another rep?
- What happens if a CSV import contains duplicate contacts?
- Are reports generated in real time or on a schedule?
`,
  },
  {
    key: "social-platform",
    name: "Social Platform",
    blurb: "Feeds, posts, moderation & privacy controls.",
    accent: "bg-rose-deep",
    prd: `# PRD: Social Platform

## 1. Overview
A social platform where users can post content, follow others, and engage through likes and comments. The platform should feel lively while keeping content safe.

## 2. Functional Requirements

### 2.1 Posting
- **FR1:** Users can create text and image posts.
- **FR2:** Users can delete their own posts.
- **FR3:** Posts appear in the feeds of followers.

### 2.2 Engagement
- **FR4:** Users can like and comment on posts.
- **FR5:** Users can report inappropriate content.

### 2.3 Privacy
- **FR6:** Users can set their account to private.
- **FR7:** Private accounts require approval for new followers.

### 2.4 Moderation
- **FR8:** Reported content is reviewed by moderators.
- **FR9:** Repeat offenders are restricted.

## 3. Non-Functional Requirements
- The feed should be relevant to each user.
- Content moderation should be timely.

## 4. Open Questions
- What is the definition of a "repeat offender"?
- How is feed relevance determined?
- Can users block other users, and what does blocking hide?
`,
  },
];

export function getDemoByKey(key: string): DemoProject | undefined {
  return DEMO_PROJECTS.find((d) => d.key === key);
}
