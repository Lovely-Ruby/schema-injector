# API Mock Injector

一个 **通过真实后端 API 批量注入（灌入） Mock 数据的 CLI 工具**。

> 🎯 目标很明确：
>
> * **走真实接口**（鉴权 / 校验 / 业务逻辑）
> * **不直连数据库**
> * **专注做一件事：安全、可控地批量插入数据**

---

## ✨ 适用场景

* 本地开发初始化数据
* 测试 / QA 环境快速造数
* 演示环境准备示例数据
* 压测前的数据准备
* 新项目 / 新成员快速拉起环境

> ❌ 本工具 **不是** 通用 CRUD 工具
> ❌ 不推荐用于线上环境

---

## 🧠 核心设计理念

* **API First**：所有数据都通过 HTTP 接口写入
* **Schema 驱动**：使用 Zod 定义请求结构
* **Mock 自动生成**：基于 schema 自动生成合法数据
* **顺序注入**：避免并发导致接口 / 数据库压力
* **可追踪**：每条数据都有 `traceId`，每次执行都有 `runId`

---

## 📦 项目结构

```text
src/
├── schema/          # Zod 请求结构定义
├── mock/            # mock 数据生成逻辑
├── utils/           # http / post / log 等工具
├── scripts/
│   └── inject.ts    # CLI 入口
├── logs/            # 错误日志输出目录
└── .env             # 环境变量配置
```

---

## 🔧 安装

```bash
pnpm install
```

> Node.js >= 18（推荐 20+）

---

## ⚙️ 环境变量配置（.env）

```env
# 后端接口 Token（如 JWT / Bearer Token）
CRM_TOKEN=xxxxxxxxxx

# 默认注入目标地址
TARGET_URL=https://your-api.com/api/v1/customers

# 默认注入数量（可被 CLI 参数覆盖）
INJECT_COUNT=10

# 是否默认 dry run
INJECT_DRY=false
```

---

## 🚀 基本使用

### 1️⃣ Dry Run（只生成数据，不请求接口）

```bash
pnpm ts-node src/scripts/inject.ts --count=5 --dry
```

输出示例：

```text
🧪 DRY RUN（不会写数据库）
┌─────────┬───────────────┬──────────────┐
│ (index) │ name          │ phone        │
├─────────┼───────────────┼──────────────┤
│ 0       │ xxx           │ 138xxxx      │
│ 1       │ xxx           │ 139xxxx      │
└─────────┴───────────────┴──────────────┘
```

---

### 2️⃣ 正式注入数据

```bash
pnpm ts-node src/scripts/inject.ts --count=20
```

或直接使用环境变量：

```bash
pnpm ts-node src/scripts/inject.ts
```

---

### 3️⃣ 指定目标 URL（优先级高于 env）

```bash
pnpm ts-node src/scripts/inject.ts \
  --url=https://api.example.com/api/v1/customers \
  --count=10
```

---

## 🧩 Schema 示例（Zod）

```ts
import { z } from 'zod'

export const CustomerCreateSchema = z.object({
  name: z.string(),
  company_name: z.string(),
  customer_type: z.enum(['domestic', 'international']),
  phone: z.string(),
  email: z.string().email(),
  source: z.string(),
  owner_id: z.number(),
  country_code: z.string().length(2),
  remark: z.string().optional(),
})
```

> `optional()` 表示：
>
> * mock 时 **可能生成，也可能不生成**
> * 更贴近真实业务数据

---

## 🧪 Mock 数据生成

Mock 数据完全基于 schema 自动生成：

* 字符串 → faker 随机文本
* enum → 随机合法值
* optional → 按概率生成
* 每条数据自动注入：

```ts
{
  traceId: 'inject_1730000000000_3',
  runId: '1730000000000'
}
```

---

## 🧾 错误日志

当接口返回非 2xx 时：

* 不会中断整个注入流程
* 自动记录错误到 `logs/` 目录

```text
logs/
└── inject-error-1730000000000.json
```

日志内容包括：

* runId
* traceId
* 请求数据
* 接口返回
* 错误信息

> 每次执行都会生成 **独立日志文件**，不会覆盖

---

## 🔐 鉴权说明

工具默认会在请求头中注入：

```http
Authorization: Bearer <CRM_TOKEN>
```

如需自定义 Header，可在 `src/utils/http.ts` 中扩展。

---

## ⚠️ 注意事项

* ⚠️ **不建议对线上环境使用**
* ⚠️ 请确认接口支持顺序批量写入
* ⚠️ 大批量数据建议分多次执行

---

## 🗺️ Roadmap（刻意保持克制）

* [ ] Seed 支持（可复现 mock）
* [ ] 更细粒度字段概率控制
* [ ] 多 schema 支持
* [ ] 注入结果统计汇总

> ❌ 暂不计划支持随机 update / delete

---

## 📄 License

MIT

---

## 🧠 一句话总结

> **这是一个让你“像真实用户一样造数据”的工具，而不是数据库脚本。**
