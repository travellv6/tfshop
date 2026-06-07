# TFShop 生产环境完整部署 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 TFShop 生产服务器从"最小可运行"升级为"完整功能可用"——Redis 连接、数据库迁移、完整 Next.js 多语言店面部署、Admin 验证。

**Architecture:** 分层递进：先修复基础设施依赖（Redis），再创建数据表（迁移），然后部署完整店面（替换 placeholder），最后验证管理后台自定义页面。每步有独立验证点。

**Tech Stack:** Medusa 2.15.5, Next.js 14 (App Router), next-intl, Redis 7, PostgreSQL 16, systemd, nginx, rsync

**Spec:** `docs/superpowers/specs/2026-06-07-tfshop-production-deployment-design.md`

**Server access:** `ssh tfshop-server` (Ed25519 key, user root, IP 47.237.219.210)

---

## File Map

### Remote files modified on server (47.237.219.210)

| File | Action | Purpose |
|------|--------|---------|
| `/opt/tfshop/tfshop-app/medusa-config.js` | Modify | Add `redisUrl` to `projectConfig` |
| `/etc/systemd/system/tfshop-storefront.service` | Modify | Add `NEXT_PUBLIC_MEDUSA_URL` env var, update ExecStart port |
| `/opt/tfshop/storefront-app/` | Replace entire directory | Deploy full Next.js storefront replacing placeholder |

### Local files used as source

| File | Purpose |
|------|---------|
| `apps/storefront/` | Complete Next.js 14 multilingual storefront source |
| `apps/storefront/.next/` | Build output to transfer to server |

---

## Task 1: 配置 Redis 连接

**Goal:** 让 Medusa 使用 Docker 中已运行的 Redis 7（127.0.0.1:6379），消除 fake redis / in-memory warnings。

**Remote files:**
- Modify: `/opt/tfshop/tfshop-app/medusa-config.js`

- [ ] **Step 1: 停止 storefront 崩溃循环**

当前 storefront 服务因端口冲突已崩溃重启 1770 次，先停掉释放 CPU 资源。

```bash
ssh tfshop-server 'systemctl stop tfshop-storefront'
```

Expected: `systemctl status tfshop-storefront` shows `inactive (dead)`

- [ ] **Step 2: 验证 Redis 连接可用**

```bash
ssh tfshop-server 'docker exec tfshop-redis redis-cli ping'
```

Expected: `PONG`

- [ ] **Step 3: 读取当前 medusa-config.js 确认结构**

```bash
ssh tfshop-server 'cat /opt/tfshop/tfshop-app/medusa-config.js'
```

Expected: `projectConfig` 中没有 `redisUrl` 字段。`modules` 中有 `factory`, `rfq`, `tiered_pricing`。

- [ ] **Step 4: 在 projectConfig 中添加 redisUrl**

在 `projectConfig` 的 `databaseUrl` 行之后添加 `redisUrl`。使用 `process.env.REDIS_URL`（systemd 服务文件中已设置 `Environment=REDIS_URL=redis://127.0.0.1:6379`）。

将这段：
```js
  projectConfig: {
    databaseUrl: DATABASE_URL,
    http: {
```

改为：
```js
  projectConfig: {
    databaseUrl: DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
```

```bash
ssh tfshop-server "sed -i 's/databaseUrl: DATABASE_URL,/databaseUrl: DATABASE_URL,\n    redisUrl: process.env.REDIS_URL,/' /opt/tfshop/tfshop-app/medusa-config.js"
```

- [ ] **Step 5: 验证修改结果**

```bash
ssh tfshop-server 'cat /opt/tfshop/tfshop-app/medusa-config.js | grep -A2 redisUrl'
```

Expected:
```
    redisUrl: process.env.REDIS_URL,
    http: {
```

- [ ] **Step 6: 重启后端服务**

```bash
ssh tfshop-server 'systemctl restart tfshop-backend'
```

- [ ] **Step 7: 等待后端启动并检查日志**

```bash
ssh tfshop-server 'sleep 15 && journalctl -u tfshop-backend -n 30 --no-pager'
```

Expected: 日志中不再出现以下任何警告：
- ❌ "fake redis" 或 "FakeRedis"
- ❌ "Local Event Bus"
- ❌ "in-memory Locking"
- ✅ "Server is ready on port: 9000"

- [ ] **Step 8: 验证 API 正常响应**

```bash
ssh tfshop-server 'curl -s http://localhost:9000/health | head -5'
```

Expected: `{"status": "ok"}` 或类似健康响应

---

## Task 2: 数据库迁移

**Goal:** 为 factory、rfq、tiered_pricing 三个自定义模块创建数据库表和模块关联。

**Prerequisite:** Task 1 完成，后端使用 Redis 正常运行。

**Remote commands only — no local files.**

- [ ] **Step 1: 执行数据库迁移**

```bash
ssh tfshop-server 'cd /opt/tfshop/tfshop-app && npx medusa db:migrate 2>&1'
```

Expected: 输出迁移执行的模块列表，包含 factory、rfq、tiered_pricing。无报错退出。

- [ ] **Step 2: 执行关联同步**

```bash
ssh tfshop-server 'cd /opt/tfshop/tfshop-app && npx medusa db:sync-links 2>&1'
```

Expected: 输出同步的 link 列表，无报错退出。

- [ ] **Step 3: 重启后端加载新表结构**

```bash
ssh tfshop-server 'systemctl restart tfshop-backend'
```

- [ ] **Step 4: 等待启动并验证 Factory API**

```bash
ssh tfshop-server 'sleep 15 && curl -s http://localhost:9000/admin/factories -H "Content-Type: application/json" | python3 -m json.tool 2>/dev/null || curl -s http://localhost:9000/admin/factories'
```

Expected: 401 Unauthorized（需要认证 token），或者包含 `"factories"` 字段的 JSON。**不应该是** 500 错误或 `"factory" table not found` 之类。

- [ ] **Step 5: 验证 RFQ API**

```bash
ssh tfshop-server 'curl -s http://localhost:9000/admin/rfq -H "Content-Type: application/json"'
```

Expected: 401 Unauthorized 或包含 `"rfqs"` 字段的 JSON。不是 500 错误。

- [ ] **Step 6: 验证 Tiered Pricing API**

```bash
ssh tfshop-server 'curl -s http://localhost:9000/admin/tiered-pricing -H "Content-Type: application/json"'
```

Expected: 401 Unauthorized 或包含 `"tiered_prices"` 字段的 JSON。不是 500 错误。

- [ ] **Step 7: 获取 Admin Token 进行完整 API 验证**

```bash
ssh tfshop-server 'curl -s -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@toyfactory.cc\",\"password\":\"Admin2026!\"}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get(\"token\",\"NO_TOKEN\"))"'
```

将输出的 token 保存为变量用于后续测试。

```bash
TOKEN="<paste-token-here>"
ssh tfshop-server "curl -s http://localhost:9000/admin/factories -H 'Authorization: Bearer $TOKEN'"
```

Expected: `{"factories":[],"count":0,"offset":0,"limit":20}` 或类似空列表响应。

---

## Task 3: 本地构建完整店面

**Goal:** 在本地 `apps/storefront/` 执行生产构建，生成 `.next/` 目录。

**Local files:**
- Build from: `apps/storefront/`
- Output: `apps/storefront/.next/`

- [ ] **Step 1: 确认依赖已安装**

```bash
cd /Users/svan/app/tfshop/apps/storefront && ls node_modules/.package-lock.json 2>/dev/null && echo "DEPS_INSTALLED" || echo "NEED_INSTALL"
```

If "NEED_INSTALL", run:
```bash
cd /Users/svan/app/tfshop/apps/storefront && npm install
```

Expected: `node_modules/` 存在，`package-lock.json` 存在。

- [ ] **Step 2: 执行生产构建**

设置 `NEXT_PUBLIC_MEDUSA_URL` 为生产域名，这样构建产物中硬编码的 API 地址正确。

```bash
cd /Users/svan/app/tfshop/apps/storefront && NEXT_PUBLIC_MEDUSA_URL=https://toyfactory.cc npm run build
```

Expected: 构建成功，输出类似：
```
✓ Compiled successfully
  Generating static pages (XX/XX)
✓ Finalizing page optimization
```

`.next/` 目录生成，包含 `server/`, `static/`, `BUILD_ID` 等文件。

- [ ] **Step 3: 验证构建产物**

```bash
ls -la /Users/svan/app/tfshop/apps/storefront/.next/ && echo "---" && cat /Users/svan/app/tfshop/apps/storefront/.next/BUILD_ID
```

Expected: `.next/BUILD_ID` 存在，`.next/server/` 和 `.next/static/` 目录存在。

- [ ] **Step 4: 测试本地启动（可选，快速验证）**

```bash
cd /Users/svan/app/tfshop/apps/storefront && NEXT_PUBLIC_MEDUSA_URL=https://toyfactory.cc npx next start -p 8888 &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:8888
kill %1 2>/dev/null
```

Expected: HTTP 200 或 307（redirect 到 locale）

---

## Task 4: 部署店面到服务器

**Goal:** 将本地构建的完整 Next.js 店面部署到服务器，替换 placeholder。

**Prerequisite:** Task 3 构建成功。

**Remote files:**
- Replace: `/opt/tfshop/storefront-app/`
- Modify: `/etc/systemd/system/tfshop-storefront.service`

- [ ] **Step 1: 确认 storefront 服务已停止**

```bash
ssh tfshop-server 'systemctl stop tfshop-storefront && systemctl status tfshop-storefront | head -5'
```

Expected: `inactive (dead)`

- [ ] **Step 2: 备份当前 placeholder**

```bash
ssh tfshop-server 'mv /opt/tfshop/storefront-app /opt/tfshop/storefront-app.bak && mkdir -p /opt/tfshop/storefront-app'
```

- [ ] **Step 3: rsync 源码到服务器（排除构建产物和依赖）**

```bash
rsync -avz --exclude='node_modules' --exclude='.next' --exclude='.git' \
  /Users/svan/app/tfshop/apps/storefront/ tfshop-server:/opt/tfshop/storefront-app/
```

Expected: 传输所有源码文件（src/, package.json, next.config.mjs, middleware.ts, tailwind.config.ts 等）

- [ ] **Step 4: 在服务器上安装生产依赖**

```bash
ssh tfshop-server 'cd /opt/tfshop/storefront-app && npm install --omit=dev 2>&1'
```

Expected: 安装 react, react-dom, next, next-intl, @medusajs/js-sdk, @tanstack/react-query。无报错。

- [ ] **Step 5: rsync 构建产物到服务器**

```bash
rsync -avz /Users/svan/app/tfshop/apps/storefront/.next/ tfshop-server:/opt/tfshop/storefront-app/.next/
```

Expected: 传输 `.next/server/`, `.next/static/`, `.next/BUILD_ID` 等文件。

- [ ] **Step 6: 验证服务器文件完整性**

```bash
ssh tfshop-server 'cd /opt/tfshop/storefront-app && echo "=== BUILD_ID ===" && cat .next/BUILD_ID && echo "" && echo "=== KEY FILES ===" && ls -la package.json next.config.mjs middleware.ts src/app/layout.tsx src/app/\[locale\]/layout.tsx && echo "=== NODE_MODULES ===" && ls node_modules/next node_modules/react node_modules/next-intl node_modules/@medusajs/js-sdk 2>&1 | head -20'
```

Expected: BUILD_ID 有内容，所有关键文件和 node_modules 存在。

- [ ] **Step 7: 更新 systemd 服务文件**

当前 `/etc/systemd/system/tfshop-storefront.service` 的 ExecStart 没有 `-p` 参数，依赖 `PORT` 环境变量。需要添加 `NEXT_PUBLIC_MEDUSA_URL` 环境变量。

将当前内容：
```ini
Environment=PORT=3000
ExecStart=/usr/bin/npx next start -H 0.0.0.0
```

改为：
```ini
Environment=PORT=3000
Environment=NEXT_PUBLIC_MEDUSA_URL=https://toyfactory.cc
ExecStart=/usr/bin/npx next start -H 0.0.0.0 -p 3000
```

```bash
ssh tfshop-server "sed -i 's|Environment=PORT=3000|Environment=PORT=3000\nEnvironment=NEXT_PUBLIC_MEDUSA_URL=https://toyfactory.cc|' /etc/systemd/system/tfshop-storefront.service && sed -i 's|next start -H 0.0.0.0|next start -H 0.0.0.0 -p 3000|' /etc/systemd/system/tfshop-storefront.service"
```

- [ ] **Step 8: 重新加载 systemd 并启动服务**

```bash
ssh tfshop-server 'systemctl daemon-reload && systemctl start tfshop-storefront'
```

- [ ] **Step 9: 等待启动并验证服务状态**

```bash
ssh tfshop-server 'sleep 8 && systemctl status tfshop-storefront | head -15'
```

Expected: `active (running)`, 无端口冲突错误。

- [ ] **Step 10: 验证多语言路由响应**

逐个检查 4 种语言路由：

```bash
# 英文首页
ssh tfshop-server 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en'
# 西班牙语
ssh tfshop-server 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/es'
# 阿拉伯语
ssh tfshop-server 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ar'
# 中文
ssh tfshop-server 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/zh'
# 根路径重定向
ssh tfshop-server 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/'
```

Expected: 所有返回 200。

- [ ] **Step 11: 通过 HTTPS 验证（nginx 代理）**

```bash
curl -s -o /dev/null -w "%{http_code}" https://toyfactory.cc/
curl -s -o /dev/null -w "%{http_code}" https://toyfactory.cc/en
curl -s -o /dev/null -w "%{http_code}" https://toyfactory.cc/zh
```

Expected: 所有返回 200。

- [ ] **Step 12: 清理备份（确认一切正常后）**

```bash
ssh tfshop-server 'rm -rf /opt/tfshop/storefront-app.bak'
```

释放约 10MB 磁盘空间。

---

## Task 5: Admin 自定义页面验证

**Goal:** 通过浏览器验证 factory、rfq、tiered-pricing 三个管理模块的页面可正常加载和操作。

**Prerequisite:** Task 1 + Task 2 完成（Redis 配置 + 数据库迁移）。

**This task requires manual browser verification.** The agent will use the browser MCP tools to perform the checks.

- [ ] **Step 1: 获取 Admin JWT Token**

```bash
ssh tfshop-server 'curl -s -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@toyfactory.cc\",\"password\":\"Admin2026!\"}"'
```

Expected: 返回包含 `token` 字段的 JSON。记录 token 值。

- [ ] **Step 2: 通过 API 验证 Factory CRUD**

创建测试工厂：
```bash
TOKEN="<from-step-1>"
ssh tfshop-server "curl -s -X POST http://localhost:9000/admin/factories \
  -H 'Authorization: Bearer $TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{\"name\":\"Test Factory\",\"description\":\"Verification test\",\"location\":\"Guangdong, China\",\"status\":\"active\"}'"
```

Expected: 返回包含 `factory` 对象，有 `id` 字段。记录 factory ID。

- [ ] **Step 3: 验证 Factory 列表**

```bash
ssh tfshop-server "curl -s http://localhost:9000/admin/factories \
  -H 'Authorization: Bearer $TOKEN'"
```

Expected: `{"factories":[{"id":"...","name":"Test Factory",...}],"count":1,...}`

- [ ] **Step 4: 验证 Factory 详情**

```bash
ssh tfshop-server "curl -s http://localhost:9000/admin/factories/<FACTORY_ID> \
  -H 'Authorization: Bearer $TOKEN'"
```

Expected: 返回完整 factory 对象。

- [ ] **Step 5: 验证 Tiered Pricing CRUD**

创建测试阶梯定价：
```bash
ssh tfshop-server "curl -s -X POST http://localhost:9000/admin/tiered-pricing \
  -H 'Authorization: Bearer $TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{\"variant_id\":\"test-variant\",\"min_quantity\":10,\"max_quantity\":50,\"amount\":999,\"currency_code\":\"usd\",\"status\":\"active\"}'"
```

Expected: 返回包含 `tiered_price` 对象，有 `id` 字段。

- [ ] **Step 6: 验证 RFQ 列表**

```bash
ssh tfshop-server "curl -s http://localhost:9000/admin/rfq \
  -H 'Authorization: Bearer $TOKEN'"
```

Expected: `{"rfqs":[],"count":0,...}`（空列表，因为 RFQ 由买家创建）

- [ ] **Step 7: 清理测试数据**

删除测试工厂和阶梯定价：
```bash
ssh tfshop-server "curl -s -X DELETE http://localhost:9000/admin/factories/<FACTORY_ID> \
  -H 'Authorization: Bearer $TOKEN'"
ssh tfshop-server "curl -s -X DELETE http://localhost:9000/admin/tiered-pricing/<TIERED_PRICE_ID> \
  -H 'Authorization: Bearer $TOKEN'"
```

Expected: `{"id":"...","object":"factory","deleted":true}` 和类似响应。

- [ ] **Step 8: 浏览器验证 Admin 页面加载**

使用浏览器访问 `https://toyfactory.cc/app`，登录后检查：
1. 侧边栏是否有 Factories / RFQ / Tiered Pricing 菜单项
2. 点击进入各列表页，确认无 JS 控制台错误
3. 页面加载正常，无白屏或 404

---

## Task 6: 最终部署验证与收尾

**Goal:** 全面验证所有服务正常运行，更新部署文档。

- [ ] **Step 1: 检查所有服务状态**

```bash
ssh tfshop-server 'systemctl status tfshop-backend tfshop-storefront --no-pager | grep -E "(Active:|●)"'
```

Expected: 两个服务都是 `active (running)`。

- [ ] **Step 2: 检查后端日志无警告**

```bash
ssh tfshop-server 'journalctl -u tfshop-backend -n 20 --no-pager'
```

Expected: 无 "fake redis"、"Local Event Bus"、"in-memory Locking" 警告。

- [ ] **Step 3: 完整端点验证**

```bash
echo "=== Backend Health ===" && \
curl -s -o /dev/null -w "%{http_code}" https://toyfactory.cc/health && echo "" && \
echo "=== Admin Dashboard ===" && \
curl -s -o /dev/null -w "%{http_code}" https://toyfactory.cc/app && echo "" && \
echo "=== Storefront EN ===" && \
curl -s -o /dev/null -w "%{http_code}" https://toyfactory.cc/en && echo "" && \
echo "=== Storefront ZH ===" && \
curl -s -o /dev/null -w "%{http_code}" https://toyfactory.cc/zh && echo "" && \
echo "=== Store API ===" && \
curl -s -o /dev/null -w "%{http_code}" https://toyfactory.cc/store/products && echo "" && \
echo "=== Admin API ===" && \
curl -s -o /dev/null -w "%{http_code}" https://toyfactory.cc/admin/products && echo "" && \
echo "=== Factory API ===" && \
curl -s -o /dev/null -w "%{http_code}" https://toyfactory.cc/admin/factories && echo "" && \
echo "=== RFQ API ===" && \
curl -s -o /dev/null -w "%{http_code}" https://toyfactory.cc/admin/rfq && echo "" && \
echo "=== Tiered Pricing API ===" && \
curl -s -o /dev/null -w "%{http_code}" https://toyfactory.cc/admin/tiered-pricing && echo ""
```

Expected 全部结果：
| 端点 | 期望状态码 |
|------|-----------|
| /health | 200 |
| /app | 200 |
| /en | 200 |
| /zh | 200 |
| /store/products | 400 |
| /admin/products | 401 |
| /admin/factories | 401 |
| /admin/rfq | 401 |
| /admin/tiered-pricing | 401 |

- [ ] **Step 4: 检查磁盘空间**

```bash
ssh tfshop-server 'df -h /'
```

Expected: 可用空间 > 3G。

- [ ] **Step 5: Git 提交本地变更（如有）**

```bash
cd /Users/svan/app/tfshop && git add -A && git status
```

如果有未提交的文件，提交：
```bash
git commit -m "chore: production deployment setup complete"
```

- [ ] **Step 6: 更新部署记忆文件**

更新 `~/.claude/projects/-Users-svan-app-tfshop/memory/server-deploy-info.md`：
- 标记 db:migrate 和 db:sync-links 为已完成
- 标记 Redis 配置为已完成
- 标记完整店面部署为已完成
- 标记 Admin 验证为已完成
