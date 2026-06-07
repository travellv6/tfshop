# Phase 3C: Admin — RFQ Management + Buyer Tier Display

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Add RFQ management pages to the admin dashboard — list, detail with message thread, quote submission. Plus buyer tier display and logistics tracking.

**Architecture:** Add new routes to admin SPA at `packages/admin/dashboard/`. Follow existing factory/campaign patterns.

**Depends on:** Phase 3A (RFQ Admin API), Phase 1C (admin pattern)

---

## Task 1: Add RFQ Admin API Hooks + List Page

- Create `src/hooks/api/rfq.tsx` — useRFQs, useRFQ, useUpdateRFQStatus, useSubmitQuote, useAddRFQMessage
- Create table columns, query hook
- Create list page + table component
- Register route in get-route.map.tsx
- Add sidebar nav item
- Commit: `git commit -m "feat(admin): add RFQ management list page"`

## Task 2: Add RFQ Detail Page with Message Thread

- Create detail page with loader
- Show RFQ info (product, customer, quantity, status)
- Show admin quote form (quoted_price, quoted_lead_time, quoted_terms)
- Show message thread with reply form
- Status change buttons (reviewing → quoted → accepted/rejected)
- Commit: `git commit -m "feat(admin): add RFQ detail page with messaging"`

## Task 3: Add Chinese/English Translations

Add RFQ, buyer tier, and logistics translations to zhCN.json and en.json:
```json
"rfq": {
  "domain": "询价管理",
  "title": "询价单",
  "list": "询价列表",
  "detail": "询价详情",
  "submitQuote": "提交报价",
  "quotedPrice": "报价",
  "leadTime": "交期",
  "messages": "沟通记录",
  "reply": "回复",
  "status": {
    "submitted": "已提交",
    "reviewing": "审核中",
    "quoted": "已报价",
    "negotiating": "协商中",
    "accepted": "已接受",
    "rejected": "已拒绝",
    "expired": "已过期",
    "cancelled": "已取消"
  }
},
"buyerTier": {
  "domain": "买家等级",
  "bronze": "铜牌",
  "silver": "银牌",
  "gold": "金牌",
  "platinum": "铂金"
},
"logistics": {
  "domain": "物流追踪",
  "trackingNumber": "物流单号",
  "carrier": "承运商",
  "status": "状态",
  "estimatedDelivery": "预计到达"
}
```

Commit: `git commit -m "feat(admin): add RFQ, buyer tier, and logistics Chinese translations"`

## Task 4: Verify Build

TypeScript check + report.
