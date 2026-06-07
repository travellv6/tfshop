# TFShop Storefront 全面补全设计

> **日期**: 2026-06-08
> **状态**: 已确认
> **前置条件**: 生产环境已部署，核心模块 API 正常工作

## 概述

将 Storefront 前端从"大部分可用"状态升级为"全部功能接线"状态。修复 2 个部分完成的页面（商品详情、工厂详情），补全 1 个骨架页面（买家中心），让核心用户旅程完整走通。

## 当前状态

| 页面 | 状态 | 问题 |
|------|------|------|
| 首页 | ✅ 完整 | — |
| 商品列表 | ✅ 完整 | — |
| 商品详情 | ⚠️ 部分 | Add to Cart / Request Quote 按钮无事件，无数量/Variant 选择器 |
| 工厂列表 | ✅ 完整 | — |
| 工厂详情 | ⚠️ 部分 | Request Quote 按钮无事件，关联商品未按工厂过滤 |
| 购物车 | ✅ 完整 | — |
| 结算 | ✅ 完整 | Stripe 未集成（不在本次范围） |
| 询价列表 | ✅ 完整 | — |
| 询价详情 | ✅ 完整 | — |
| 买家中心 | ❌ 骨架 | 仅 56 行，只有姓名邮箱展示 |
| 订单列表 | ✅ 完整 | — |
| 订单详情 | ✅ 完整 | — |
| 登录/注册 | ✅ 完整 | — |

## 修复项

### 1. 商品详情页按钮接线

**文件**: `apps/storefront/src/app/[locale]/products/[handle]/page.tsx`

**Add to Cart 按钮**:
- 添加数量选择器（`<input type="number" min={1}>` 或 +/- 按钮）
- 添加 Variant 选择器（如果产品有 variants，显示选项下拉框）
- 按钮点击调用 `CartContext.addItem(variantId, quantity)`
- 添加成功反馈（toast 或按钮文字变为 "Added!"）
- 未选择 Variant 时按钮禁用

**Request Quote 按钮**:
- 点击跳转到 `/[locale]/rfq` 页面，通过 URL query 参数传递产品信息
- 或者创建独立的 RFQ 创建弹窗/页面
- 预填：产品名、产品 ID、工厂信息

### 2. 工厂详情页修复

**文件**: `apps/storefront/src/app/[locale]/factories/[slug]/page.tsx`

**Request Quote 按钮接线**:
- 点击跳转到 `/[locale]/rfq` 页面，通过 query 参数传递工厂信息

**关联商品过滤**:
- 当前 `useProducts({ limit: 12 })` 忽略了 `factory?.id`
- 需要修改 `useProducts` hook 或直接调用 API 传入 `factory_id` 过滤参数
- 检查 Store Product API 是否支持 `factory_id` 过滤（可能需要通过 metadata 或扩展 API）

### 3. 买家中心补全

**文件**: `apps/storefront/src/app/[locale]/account/page.tsx`

从 56 行骨架升级为功能完整的买家中心：
- 用户信息卡（头像、姓名、邮箱、买家等级）
- 功能入口网格：
  - 我的订单 → `/[locale]/account/orders`
  - 我的询价 → `/[locale]/rfq`
  - 地址管理 → `/[locale]/account/addresses`
  - 账号设置 → 编辑姓名、修改密码
- 未登录时显示登录引导

### 4. 新建地址管理页

**文件**: `apps/storefront/src/app/[locale]/account/addresses/page.tsx`（新建）

- 地址列表（从 Medusa Customer Address API 获取）
- 新增地址表单（姓名、电话、地址行、城市、省份、邮编、国家）
- 编辑地址
- 删除地址
- 设置默认地址

### 5. RFQ 创建入口

**文件**: `apps/storefront/src/app/[locale]/rfq/page.tsx` 或新建组件

- 在 RFQ 列表页添加"新建询价"按钮
- 支持 URL query 参数预填（`?product_id=xxx&factory_id=xxx`）
- RFQ 创建表单组件复用 `components/rfq/rfq-form.tsx`

## 技术方案

### CartContext 复用

现有 `apps/storefront/src/lib/cart-context.tsx` 已实现完整的购物车 CRUD：
- `addItem(variantId, quantity)` — 加购
- `updateItemQuantity(itemId, quantity)` — 改数量
- `removeItem(itemId)` — 删除

商品详情页只需 import `useCart()` hook 即可。

### Medusa Store API 使用

- 产品 Variant: `sdk.store.product.list({ handle })` 返回的 product 包含 `variants` 数组
- 客户地址: `sdk.store.customer.listAddresses()` / `sdk.store.customer.addAddress()`
- RFQ 创建: `sdk.client.fetch("/store/rfq", { method: "POST", body })`

### 多语言

所有新增 UI 文本需要在 4 个语言文件中添加对应翻译 key：
- `src/messages/en.json`
- `src/messages/es.json`
- `src/messages/ar.json`
- `src/messages/zh.json`

## 不在本范围

- Stripe 支付集成（Phase 2 后续）
- 邮件通知系统（Phase 3 后续）
- 物流追踪（Phase 3 后续）
- 性能优化 / CDN
- 图片上传
