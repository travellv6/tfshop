# TFShop 生产环境完整部署设计

> **日期**: 2026-06-07
> **状态**: 已确认
> **前置条件**: 自定义模块（factory, rfq, tiered_pricing）已完成代码开发、本地构建、Git 推送和服务器注册

## 概述

将 TFShop 生产服务器从"最小可运行"状态升级为"完整功能可用"状态。包括：基础设施优化、数据库迁移、完整店面部署和管理后台验证。

## 服务器环境

- **IP**: 47.237.219.210（阿里云）
- **域名**: toyfactory.cc（Let's Encrypt SSL，2026-09-05 到期）
- **OS**: Ubuntu 26.04 LTS, 3.4GB RAM, 20GB 磁盘（当前剩余 5.1G）
- **Docker**: PostgreSQL 16 + Redis 7（运行中）
- **Medusa**: v2.15.5，端口 9000，systemd 管理
- **SSH**: `ssh tfshop-server`（Ed25519 密钥认证）

## 当前问题

| 问题 | 严重性 | 影响 |
|------|--------|------|
| Redis 未连接（使用 fake redis） | 🔴 高 | Event Bus、Cache、Locking、Workflow Engine 均为内存模式，重启丢失 |
| Storefront 端口 3000 冲突 | 🔴 高 | 服务循环崩溃（已重启 1770 次） |
| 自定义模块数据表未创建 | 🔴 高 | Factory/RFQ/Tiered Pricing API 无法读写数据 |
| 店面仅为 placeholder | 🟡 中 | 用户看到空白页面 |

## 执行方案：分层递进（4 步）

### Step 1: 基础设施修复

**目标**: 配置 Redis 连接，消除所有 fake/in-memory 警告

**操作**:
1. 修改 `/opt/tfshop/tfshop-app/medusa-config.js`，在 `projectConfig` 中添加：
   ```js
   redisUrl: "redis://127.0.0.1:6379"
   ```
2. 重启后端服务：`systemctl restart tfshop-backend`
3. 检查日志确认：
   - 不再出现 "fake redis" 警告
   - 不再出现 "Local Event Bus" 警告
   - 不再出现 "in-memory Locking" 警告
   - Server 在端口 9000 就绪

**回退方案**: 删除 `redisUrl` 配置行，重启服务即可恢复

**额外操作**: 停止 storefront 崩溃循环：`systemctl stop tfshop-storefront`（将在 Step 3 重新部署）

### Step 2: 数据库迁移

**目标**: 为 3 个自定义模块创建数据库表和关联关系

**操作**:
1. 在服务器上执行：
   ```bash
   cd /opt/tfshop/tfshop-app
   npx medusa db:migrate
   ```
2. 执行关联同步：
   ```bash
   npx medusa db:sync-links
   ```
3. 验证迁移结果：
   - `GET /admin/factories` 返回 `{ factories: [], count: 0, ... }`（非错误）
   - `GET /admin/rfq` 返回 `{ rfqs: [], count: 0, ... }`（非错误）
   - `GET /admin/tiered-pricing` 返回 `{ tiered_prices: [], count: 0, ... }`（非错误）

**回退方案**: Medusa 迁移支持回滚，通过 `npx medusa db:migrate --revert` 回退

### Step 3: 完整店面部署

**目标**: 将本地 `apps/storefront/` 的完整 Next.js 14 多语言店面部署到服务器，替换 placeholder

**本地店面特性**:
- Next.js 14 App Router
- next-intl 多语言（EN / ES / AR / ZH）
- @medusajs/js-sdk 集成
- @tanstack/react-query 数据管理
- TailwindCSS 样式
- 完整功能：产品浏览、工厂展示、RFQ 询价、购物车、结算、买家中心、登录注册

**操作**:

A. 本地构建：
```bash
cd apps/storefront
npm install
NEXT_PUBLIC_MEDUSA_URL=https://toyfactory.cc npm run build
```

B. 服务器部署：
1. 停止 storefront 服务：`systemctl stop tfshop-storefront`
2. 备份当前 placeholder：`mv /opt/tfshop/storefront-app /opt/tfshop/storefront-app.bak`
3. 创建新目录：`mkdir /opt/tfshop/storefront-app`
4. rsync 传输（排除 node_modules 和 .next）：
   ```bash
   rsync -avz --exclude='node_modules' --exclude='.next' \
     ./apps/storefront/ tfshop-server:/opt/tfshop/storefront-app/
   ```
5. 在服务器上安装生产依赖：
   ```bash
   cd /opt/tfshop/storefront-app && npm install --production
   ```
6. 传输构建产物：
   ```bash
   rsync -avz ./apps/storefront/.next/ tfshop-server:/opt/tfshop/storefront-app/.next/
   ```
7. 配置环境变量（更新 systemd service 文件）：
   ```
   Environment=NEXT_PUBLIC_MEDUSA_URL=https://toyfactory.cc
   Environment=PORT=3000
   ```
8. 重启服务：`systemctl daemon-reload && systemctl start tfshop-storefront`

C. 验证：
- `curl -I https://toyfactory.cc` 返回 200
- `curl -I https://toyfactory.cc/en` 返回 200（英文首页）
- `curl -I https://toyfactory.cc/es` 返回 200（西班牙语）
- `curl -I https://toyfactory.cc/ar` 返回 200（阿拉伯语）
- `curl -I https://toyfactory.cc/zh` 返回 200（中文）

**回退方案**:
```bash
systemctl stop tfshop-storefront
rm -rf /opt/tfshop/storefront-app
mv /opt/tfshop/storefront-app.bak /opt/tfshop/storefront-app
systemctl start tfshop-storefront
```

**磁盘空间评估**: Next.js 构建产物约 50-100MB，node_modules 约 200-300MB。当前可用 5.1G，足够。备份 placeholder 占用约 10MB。

### Step 4: Admin 验证

**目标**: 确认 3 个自定义模块的管理页面在浏览器中正常工作

**操作**:
1. 浏览器访问 `https://toyfactory.cc/app`
2. 使用 `admin@toyfactory.cc / Admin2026!` 登录
3. 验证以下页面：
   - 侧边栏出现 Factories 菜单项，点击进入工厂列表页
   - 侧边栏出现 RFQ 菜单项，点击进入 RFQ 列表页
   - 侧边栏出现 Tiered Pricing 菜单项，点击进入阶梯定价列表页
4. 验证 CRUD 操作：
   - 创建一个测试工厂
   - 创建一个测试阶梯定价规则
   - 查看工厂详情页
   - 删除测试数据

**验收标准**:
- 所有页面加载无 JS 错误
- 创建/读取/删除操作成功
- 列表页显示正确的空状态或数据

## 风险评估

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| Redis 连接失败 | 低 | 中 | Docker 容器已运行健康检查通过，配置简单 |
| 数据库迁移失败 | 低 | 高 | Medusa 支持迁移回滚，且备份在 Docker volume |
| 店面构建失败 | 中 | 低 | 可在本地多次尝试，不影响线上服务 |
| 磁盘空间不足 | 低 | 高 | 当前 5.1G 可用，备份 placeholder 后删除可释放 |
| Admin 页面路由丢失 | 中 | 低 | 已在之前部署中同步 dashboard dist |

## 不在本范围

以下项目不在本次部署范围内，将在后续迭代中处理：
- Buyer Tier 买家等级模块（Phase 3）
- MOQ Tag 最低起订量模块（Phase 3）
- Stripe 支付集成（Phase 2）
- 银行电汇支付（Phase 2）
- 物流追踪（Phase 3）
- 性能优化和 CDN 配置
