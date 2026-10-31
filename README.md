# Braiding with Nkathaa 💇‍♀️✨

> **"Beautiful Braids. Professional Care."**  
> A modern, premium full-stack web application and booking platform for a luxury braiding business in Nairobi.

---

## 🎨 Brand Identity & Design System

- **Primary Color:** Lavender (`#CBB3E8`) — Hero sections, navigation backgrounds, decorative elements, cards.
- **Accent Color:** Chartreuse (`#D4FF3F`) — Highlights, tags, badges, hover effects, featured content.
- **CTA Color:** Tomato Red (`#E34234`) — Booking buttons, important actions, notifications.
- **Supporting Colors:**
  - White: `#FFFFFF`
  - Light Gray: `#F8F8F8`
  - Dark Text: `#333333`
- **Typography:**
  - Headings: **Poppins** (Bold, Modern, Elegant)
  - Body: **Inter** (Clean, Legible, High-Density)
- **UI Aesthetic:** Rounded curves (`rounded-3xl`), soft shadows (`shadow-soft`), smooth micro-interactions, responsive mobile-first layouts.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
- **React 19** with **Vite**
- **Tailwind CSS v4** (`@tailwindcss/vite` 4.x with `@theme` token definitions)
- **React Router v7**
- **Framer Motion** & **Canvas Confetti**
- **Lucide React** icons
- **React Hook Form** + **Zod** validation

### Backend (`server/`)
- **Node.js** & **Express.js 5**
- **MongoDB** & **Mongoose 9**
  - Connects to remote `MONGODB_URI` or local MongoDB.
  - Automatically launches an embedded `mongodb-memory-server` if no external database is configured, ensuring zero setup friction.
  - Automatically seeds realistic hairstyles, gallery photos, initial appointments, reviews, and promotional coupons on initial start.
- **Authentication:** JWT (JSON Web Tokens) & **bcryptjs** password hashing for admin portal.
- **Image Handling:** Multer disk upload with local serving + **Cloudinary** SDK support.
- **RESTful API** with full CORS, Morgan logging, and error handling.

---

## 🚀 Quick Start Guide

This project is organized into two separate folders: `client` and `server`. You can run them concurrently in separate terminal windows.

### 1. Start the Backend Server

```bash
cd server
pnpm install
pnpm dev
```

- Server will start on `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`
- Default Admin Account:
  - **Email:** `admin@nkathaa.com`
  - **Password:** `AdminPassword123!`

### 2. Start the Frontend Application

```bash
cd client
pnpm install
pnpm dev
```

- Vite dev server will start on `http://localhost:5173` (or `http://localhost:5174` if port 5173 is occupied)
- API requests to `/api` and `/uploads` are automatically proxied to the backend.

---

## 🌟 Pages & Key Features

### 1. Home Page (`/`)
- **Hero Section:** Large hairstyle photograph, brand name, tagline, Tomato Red "Book Appointment" CTA, Lavender "Explore Hairstyles" CTA, and floating trust badges (100% Tension-Free, VIP Studio Care).
- **Featured Hairstyles:** Quick catalog preview with direct booking triggers and AI matcher teaser.
- **Why Choose Us:** 4 pillar highlights (Professional styling, Quality products, Convenient booking, Personalized service).
- **Statistics Counter:** 100+ Happy Clients, 50+ Hairstyles Completed, Flexible Booking, 4.9★ Average Rating.
- **Testimonials Preview:** Client reviews with star ratings and verified customer badges.
- **Gallery Preview:** High-res preview grid linking to the full lookbook.
- **Contact & Booking Banner:** Direct WhatsApp chat link, phone number, and studio directions.
- **Branded Footer:** Operating hours, studio location, newsletter signup, and copyright.

### 2. Hairstyles Showcase (`/hairstyles`)
- Catalog displaying all styles (Medium Knotless Braids, Luxury Boho Knotless, Passion Twists, Fulani Tribal Cornrows, French Curl Braids, Goddess Soft Locs, Stitch Cornrows, Natural Mini Twists).
- **Filters:**
  - Live search bar.
  - Category selector chips (All, Knotless, Boho, Twists, Cornrows, Goddess, Locs, Trending).
  - Price range tiers.
  - Duration filters.
  - Trending & Popular toggles.
  - Sorting (Popular, Price Low to High, Price High to Low, Shortest Duration).

### 3. Hairstyle Details Page (`/hairstyles/:id`)
- Multi-photo gallery with interactive thumbnail switcher.
- Full description, specifications (hair length required, duration, price in KES).
- Step-by-step **Maintenance Instructions** for preserving curls and roots.
- Interactive **Frequently Asked Questions (FAQ)** accordion.
- Tomato Red **"Book This Style"** button that pre-selects the style in the booking wizard.
- Related hairstyles in the same category.

### 4. Booking System (`/book`)
- Complete 4-step appointment booking flow:
  1. **Hairstyle Selection:** Visual selector with duration and price details.
  2. **Date & Time Slot Selection:** Fetches live availability for the chosen date. **Prevents double booking** by disabling already-booked slots.
  3. **Client Information:** Name, phone, email, preferred braid hair color (with natural black, blonde, burgundy, and ombre swatches), and special notes.
  4. **Discount Coupon Validation:** Enter promo codes like `FIRST10` (10% off) or `NKATHAAVIP` (15% off) with instant discount calculation.
  5. **Confirmation:** Shows confirmation message: *"Your appointment request has been received. We will contact you shortly."*
- **M-Pesa STK Push Simulation:** Allows clients to enter their Safaricom number and simulate paying a KES 1,000 deposit via STK Push, generating an authentic transaction code (e.g., `QKD829104B`) and marking the booking as Confirmed.
- **WhatsApp Direct Connect:** Generates a pre-filled WhatsApp message with appointment details.

### 5. Pinterest-Style Gallery (`/gallery`)
- Dynamic masonry layout with variable photo aspect ratios.
- Category filters (All, Knotless, Boho Braids, Twists, Cornrows, Goddess, Locs, Editorial).
- Interactive **Lightbox Preview** with high-resolution zoom, tag cloud, like counter, and direct "Book Similar Style" button.

### 6. Client Reviews (`/reviews`)
- Overall 5.0 rating score display, star ratings, and review distribution breakdown.
- Client testimonial cards with verified customer badges.
- **"Write a Review" Modal:** Allows clients to rate (1–5 interactive stars), write feedback, and submit reviews directly to the database.

### 7. About Page (`/about`)
- The story behind Braiding with Nkathaa: The founder's journey to eliminate braiding pain and traction alopecia.
- Core values: Scalp Health First, Geometric Precision, and Punctual & Respectful Service.

### 8. Contact Page (`/contact`)
- Studio location in Kilimani, Nairobi with interactive OpenStreetMap preview.
- Business hours (Mon–Sat 8am–7pm, Sun VIP).
- Direct WhatsApp, Instagram, and TikTok links.
- Interactive contact message form.

### 9. AI Hairstyle Recommendation (`/ai-stylist`)
- Interactive 4-step beauty consultation questionnaire:
  - Face shape (Oval, Round, Heart, Square).
  - Primary lifestyle (Corporate, Active/Gym, Vacation/Glamour, Low Maintenance).
  - Scalp sensitivity and daily maintenance preference.
- Generates a tailored AI Stylist Consultation Note from Nkathaa and top matching hairstyles with match percentages (e.g. 98% Match) and styling reasoning.

### 10. Client Self-Service: My Bookings (`/my-bookings`)
- Clients can look up their upcoming and past appointments by entering their phone number or email address.
- Shows status (`Pending`, `Confirmed`, `Completed`, `Cancelled`), M-Pesa receipt verification, and payment balance.

### 11. Secure Admin Dashboard (`/admin`, `/admin/login`)
- **Dashboard Analytics:**
  - Total Bookings counter.
  - Upcoming Appointments in queue.
  - Revenue Overview (collected revenue vs. potential total).
  - Most Booked Hairstyle metric.
  - Monthly booking trajectory bar chart (last 6 months).
  - Status pipeline breakdown (Pending, Confirmed, Completed, Cancelled).
- **Bookings Management:** Filter by status, search by client/phone/style, update status (`Confirmed`, `Completed`, `Cancelled`), or delete records.
- **Hairstyles Management:** Add new hairstyles, edit existing ones, upload images from local storage, or delete styles.
- **Client Directory:** Aggregated lifetime appointments, total spend, and VIP loyalty status.
- **Reviews Moderation:** Approve or hide customer feedback.
- **Gallery Management:** Upload new hairstyle photos with categories and tags.

---

## 🔒 Security & Best Practices

- Password hashing using `bcryptjs` with salt rounds.
- Admin route protection via Bearer JWT tokens.
- Double-booking prevention via atomic database checks on active appointment slots.
- Responsive mobile-first layout tested across breakpoints.
- Clean REST architecture with decoupled controllers, models, and routes.
