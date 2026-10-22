# StoreFlex — On-Demand Business Storage Marketplace
> **“Jitni jagah chahiye, utni hi rent karo.”**  
> *On-demand storage infrastructure for growing businesses.*

---

## 1. Project Overview

**StoreFlex** is a full-stack Indian B2B marketplace startup that connects growing businesses needing extra storage capacity with verified warehouse and commercial property owners who have vacant space.

### Core Value Proposition
- **For Businesses:** Instead of leasing an entire 5,000 sq ft warehouse on a 3-year lock-in with 6 months deposit, a merchant can rent 200 sq ft for 3 months at ₹18/sq ft/month.
- **For Space Owners:** Unused floor capacity is monetized with verified commercial tenants and automated monthly payouts.
- **For StoreFlex:** A marketplace model charging a configurable platform commission (default: 20%) without the capital risk of owning real estate.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js, Express REST API, server-side capacity validation and transaction management
- **Database:** Normalized persistent storage engine (`.storeflex-data.json`) with ACID-like atomic writes, foreign key relations, seed hydration, and capacity locking
- **Build & Dev Tooling:** Vite 8, `tsx`, Node native ESM test runner (`node:test`)
- **Visuals & Charts:** Pure SVG interactive area, bar, and donut charts

---

## 3. Database Structure & Domain Models

StoreFlex models are normalized in `src/types/index.ts` and managed by `src/server/db.ts`:

1. **User:** ID, name, email, phone, role (`business` | `owner` | `admin`), password, company, KYC status.
2. **Property:** ID, ownerId, name, propertyType, address, city, totalArea, availableArea, ceilingHeight, floor, storageType, accessHours, pricePerSqFt, facilities, images, verificationStatus (`pending` | `verified` | `rejected`), rating.
3. **StorageUnit:** Physical unit code (e.g., `MER-04-B17`, `GZB-01-A04`), floor, area, status.
4. **Booking:** Unique ID (`SF-2026-000123`), businessId, propertyId, storageUnitId, area, duration, monthlyRate, storageTotal, platformFee, deposit, GST, ownerNetPayout, status (`Active`, `Cancelled`).
5. **InventoryItem:** SKU code (`SKU-ELC-104`), name, category, quantity, unit, unitValue, totalValue, storageUnitId.
6. **InventoryMovement:** Inward/Outward movements (`IN`, `OUT`, `TRANSFER`, `ADJUSTMENT`) with timestamp and previous/new balances.
7. **Payment:** Mock Razorpay transaction reference, amount, method, status (`Paid`).
8. **Invoice:** Tax invoice number (`INV-SF-2026-081`), base rent, platform fee, GST, deposit, due date.
9. **Payout:** Net host remittance (`PO-2026-0044`), bank account masked, commission deducted.
10. **DigitalAgreement:** IT Act-compliant storage lease agreement with rules and deposit refund policy.
11. **Dispute & DisputeMessage:** Multi-party arbitration thread between Business, Owner, and Admin.
12. **LogisticsOrder:** Doorstep vehicle request (Tata Ace, E-Loader, Bolero Maxi, 14ft Canter) with dynamic pricing formula.
13. **CommissionSetting:** Dynamically configurable platform take-rate % and minimum fees.
14. **AppNotification:** In-app notification center for booking, payment, and audit events.

---

## 4. Available User Roles & Route Protection

Role-based access control (RBAC) enforces strict separation across portals:

| Role | Intended User | Default Dashboard | Key Capabilities |
|---|---|---|---|
| **Business** | Retailer, Wholesaler, E-commerce Merchant | `/business/dashboard` | Search storage, 7-step booking, inventory ledger, logistics dispatch, payment receipts |
| **Space Owner** | Warehouse & Commercial Landlord | `/owner/dashboard` | List properties, track bay occupancy, view bookings, monitor monthly net payouts |
| **Admin** | StoreFlex Operations & Trust Team | `/admin/dashboard` | Review property verification queue, audit KYC, adjust commission %, arbitrate disputes |

*Note: Attempting to access an unauthorized portal triggers the role barrier view with a 1-click switcher.*

---

## 5. Demo Accounts

Pre-configured development accounts (Password: `StoreFlex@2026` or 1-click login on `/login`):

- **Businessman:** `business@storeflex.demo` (Rajesh Sharma — Sharma Retail & Electronics)
- **Space Owner:** `owner@storeflex.demo` (Vikram Malhotra — Malhotra Logistics & Warehousing)
- **Admin:** `admin@storeflex.demo` (StoreFlex Operations Team)

---

## 6. Main Routes

### Public & Marketing
- `/` — Public Landing Page (Hero, Problem, How It Works, Value Props, Trust & Safety, Roadmap)
- `/roadmap` — Product Roadmap (Phases 1 through 5)
- `/notifications` — In-App Notifications Center
- `/login` — Account Sign In + 1-Click Demo Switcher
- `/register` — Account Registration (Business or Space Owner)
- `/forgot-password` — Password Recovery Simulation

### Businessman Portal
- `/business/dashboard` — Overview: Active units, space used, monthly cost, quick actions, inventory summary
- `/business/storage` — Marketplace search with filters (City, Area, Price, CCTV, Loading Dock, 24/7 Access) and Smart Matching score
- `/business/storage-calculator` — Rule-based volumetric estimator (Cartons/Pallets ➔ Recommended Sq Ft & Cost)
- `/business/inventory` — Digital SKU inventory management, stock inward/outward log, unit QR pass
- `/business/logistics` — On-demand vehicle transport request with instant distance & handling quotes
- `/business/payments` — Invoices, GST breakdown, and transaction history

### Space Owner Portal
- `/owner/dashboard` — Capacity metrics, occupancy rate, passive yield summary
- `/owner/properties` — Property portfolio with verification audit badges
- `/owner/properties/new` — Submit new warehouse for field verification
- `/owner/bookings` — Tenant reservation registry
- `/owner/earnings` — Gross revenue, StoreFlex 20% commission deduction, net payout history
- `/owner/analytics` — Historical occupancy trends and revenue yield charts

### Admin Portal
- `/admin/dashboard` — 12 core marketplace metrics, GMV, platform revenue, disputes
- `/admin/properties` — Verification audit queue (Verify & Approve, Reject, Suspend)
- `/admin/users` — Merchant & Host directory with KYC status toggle
- `/admin/bookings` — Master booking timeline with cancellation & capacity release
- `/admin/settings/commission` — Dynamic take-rate configuration (default: 20%)
- `/admin/disputes` — Multi-party complaint arbitration with resolution logs
- `/admin/analytics` — Geographic demand distribution & unmet capacity alerts
- `/admin/logistics` — Commercial fleet vehicle & driver assignment

---

## 7. How to Run the Project

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
node --test

# 3. Start full-stack development server (Express + Vite)
npm run dev

# App runs at: http://localhost:3000
```

---

## 8. Feature Status: Real vs Demo

| Feature | Status | Notes |
|---|---|---|
| Storage Marketplace & Search | **Real** | Filtered directly against server database |
| Capacity Allocation & Release | **Real** | Verified property capacity reduces on booking and restores on cancellation |
| Smart Matching Engine | **Real** | Multi-factor weighted compatibility formula (Location, Price, Capacity, Facilities, Category) |
| Volumetric Calculator | **Real** | Pure mathematical volumetric engine accounting for pallet footprint, stacking, and aisle allowance |
| Digital Agreements | **Real** | Auto-generated legal contract with timestamp and print layout |
| Inventory & Stock Movements | **Real** | Full inward/outward movement history with low-stock alerts |
| In-App Notifications | **Real** | Real-time event notifications with unread badges |
| Admin Property Verification | **Real** | Approving a property makes it immediately visible in the public marketplace |
| Dynamic Commission Settings | **Real** | Updating the take-rate immediately affects new bookings |
| Payments | **Demo Mode** | Mock Razorpay flow simulating payment confirmation and receipt generation |
| Vehicle Transport | **Demo Mode** | Quote calculation is real; driver assignment is simulated |
| Cargo Insurance | **Planned** | Roadmap Phase 3 integration |

---

## 9. Recommended Next Development Steps

1. **Phase 3:** Integrate live Razorpay Route webhook for automatic split payouts between StoreFlex and host bank accounts.
2. **Phase 3:** Partner with a licensed Indian general insurer (e.g., ICICI Lombard or Digit) for embedded per-trip cargo coverage.
3. **Phase 4:** Connect camera-based computer vision for automated bay fill-level estimation.
4. **Phase 5:** Expand physical field officer network into Bhiwandi (Mumbai), Peenya (Bengaluru), and Surat.
