# Phase 2C: Admin Dashboard — Order Management, Customer Management, Wire Transfer Confirmation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extend the Medusa Admin Dashboard with order management enhancements (wire transfer confirmation flow), customer management pages, and tiered pricing management UI. Admin interface is in Chinese.

**Architecture:** Add new routes to the existing admin SPA at `packages/admin/dashboard/`. Medusa already has built-in order and customer management pages — we only need to add: (1) wire transfer payment confirmation, (2) tiered pricing management, and (3) customer tier display.

**Tech Stack:** React 18, react-router-dom 6, @tanstack/react-query, @tanstack/react-table, i18next, @medusajs/ui, @medusajs/js-sdk

**Depends on:** Phase 1C (admin pattern established), Phase 2A (tiered pricing module)

---

## Task 1: Add Tiered Pricing Admin Page

**Files:**
- Create: `packages/admin/dashboard/src/routes/tiered-pricing/tiered-price-list/index.ts`
- Create: `packages/admin/dashboard/src/routes/tiered-pricing/tiered-price-list/tiered-price-list.tsx`
- Create: `packages/admin/dashboard/src/routes/tiered-pricing/tiered-price-list/components/tiered-price-list-table.tsx`
- Create: `packages/admin/dashboard/src/hooks/api/tiered-pricing.tsx`
- Create: `packages/admin/dashboard/src/hooks/table/columns/use-tiered-price-table-columns.tsx`
- Modify: `packages/admin/dashboard/src/dashboard-app/routes/get-route.map.tsx` — add tiered pricing routes
- Modify: `packages/admin/dashboard/src/components/layout/main-layout/main-layout.tsx` — add nav item
- Modify: `packages/admin/dashboard/src/i18n/translations/zhCN.json` — add tiered pricing translations
- Modify: `packages/admin/dashboard/src/i18n/translations/en.json` — add tiered pricing translations

The tiered pricing list page shows a table of all price tiers grouped by variant. Columns: variant_id (truncated), min_quantity, max_quantity, amount, currency_code, status.

Follow the campaign list pattern from Phase 1C.

Commit: `git commit -m "feat(admin): add tiered pricing management page"`

---

## Task 2: Add Wire Transfer Payment Confirmation Section

**Files:**
- Modify: `packages/admin/dashboard/src/i18n/translations/zhCN.json` — add wire transfer translations
- Modify: `packages/admin/dashboard/src/i18n/translations/en.json` — add wire transfer translations

Medusa's existing order detail page shows payment information. For wire transfer orders, we add a custom section that:
1. Shows uploaded payment proof (if any)
2. Has a "确认到账" (Confirm Payment) button that captures the payment
3. Has a "拒绝" (Reject) button that cancels the payment

This uses Medusa's built-in payment capture workflow (`capturePaymentWorkflow`).

The section is added as a widget or by extending the order detail page.

For MVP, we'll add translations and create a note in the order timeline for wire transfer orders. The actual payment capture uses the existing admin API: `POST /admin/payments/:id/capture`.

Commit: `git commit -m "feat(admin): add wire transfer payment confirmation translations"`

---

## Task 3: Add Chinese Translations for Orders and Customers

**Files:**
- Modify: `packages/admin/dashboard/src/i18n/translations/zhCN.json` — add order + customer Chinese translations

Medusa already has order and customer management pages in the admin. We just need to ensure the Chinese translations cover these domains. Add missing keys for:
- Order statuses in Chinese
- Payment method labels
- Customer-related labels
- Wire transfer specific terms

Commit: `git commit -m "feat(admin): add order and customer Chinese translations"`

---

## Task 4: Verify Admin Build

```bash
cd /Users/svan/app/tfshop && yarn workspace @medusajs/dashboard build
```

Report build status. The tiered pricing pages should compile without errors.
