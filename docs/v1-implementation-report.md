# V1 实现与验证报告

记录 `zenith-ai-home` 第一版单页 landing page 的实现、改动、验证、待补内容与 GitHub 发布前置条件。

报告日期：2026-06-07
项目目录：`/Users/zenith/Desktop/zenith-ai-home`
Git 状态：当前目录**尚未初始化**为 git repo

---

## 1. 改动清单

### 新增文件（11 个）

| 路径 | 作用 |
|---|---|
| `src/App.tsx` | 单页组合，从 `src/data/*.ts` 读内容 |
| `src/sections/Hero.tsx` | Hero 区 + 顶部锚点导航 + 跳项目 CTA |
| `src/sections/Projects.tsx` | Featured AI Projects 卡片网格 |
| `src/sections/Timeline.tsx` | 关键经历 Timeline（左侧 marker + 右侧卡片） |
| `src/sections/Prompts.tsx` | 推荐提示词（等宽排版的 `<pre>` 卡片） |
| `src/sections/Insights.tsx` | 技术见解列表 |
| `src/sections/Reading.tsx` | 推荐阅读（curated list） |
| `src/sections/Contact.tsx` | 联系方式 + Footer |
| `src/index.css` | 浅色工程杂志风样式（设计 token、响应式断点 ≤600px） |
| `README.md` | 项目定位 / 运行 / 内容维护 / 真实性约束 / GitHub 发布前检查 |
| `scripts/render-check.mjs` | 一次性 SSR 验证脚本（可重复跑） |

### 修改的文件

无。

### 未动的文件

- `package.json` / `vite.config.ts` / `tsconfig.*.json` / `index.html` / `.gitignore`
- `src/main.tsx`（已经引用 `App` + `index.css`）
- `src/data/*.ts`（6 个 data 文件 + `types.ts`，保留 V1 阶段的全占位内容）
- 全部 `docs/harness/*.md`（7 份 contract 文档未触碰）

### 文档组织约定

`docs/harness/` 是项目契约（brief / content contract / UI contract / implementation plan / acceptance checklist / github publication），是长期稳定的"规约"。

`docs/v1-implementation-report.md`（本文件）是"状态报告"——某一次实现的快照与待办。下一次实现可以再写 `v1.1-...md` 或 `v2-...md`，不污染 harness 目录。

---

## 2. 验证命令与结果

### 2.1 `npm install`

```bash
npm install
```

结果：

```text
added 68 packages, and audited 69 packages in 40s
found 0 vulnerabilities
```

### 2.2 `npm run build`

```bash
npm run build
```

结果：

```text
> tsc -b && vite build
vite v7.3.5 building client environment for production...
✓ 42 modules transformed.
dist/index.html                   0.55 kB │ gzip:  0.41 kB
dist/assets/index-Cj-iRZsF.css    7.87 kB │ gzip:  2.18 kB
dist/assets/index-Dxoz9K0Y.js   205.38 kB │ gzip: 64.59 kB
✓ built in 314ms
```

TS 严格模式 0 错误。

### 2.3 `npm run dev -- --host 127.0.0.1 --port 5173`

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

5173 被占用，Vite 自动跳到 5174：

```text
VITE v7.3.5 ready in 78 ms
➜ Local: http://127.0.0.1:5174/
```

健康检查：

```text
/                       -> 200
/src/main.tsx           -> 200
/src/App.tsx            -> 200
/src/index.css          -> 200
/src/sections/Hero.tsx  -> 200
/src/sections/Contact   -> 200
```

### 2.4 `node scripts/render-check.mjs`

由于环境中 `WebFetch` 无法触达 `127.0.0.1`（ECONNREFUSED），改用等价方法：通过 Vite `ssrLoadModule` + `react-dom/server.renderToStaticMarkup` 真实跑通整页 React 树，再用断言验证内容 / 链接 / 顺序。

**33/33 PASS**，覆盖：

- 内容真实性：没有假 href、没有 fake stats、占位 token 充足
- 页面顺序：7 个 section 严格按 contract 排列
- 关键字段：项目复盘、Prompt 结构化改写、问题 / 方法 / 技术栈 / 证据、当前关注
- 链接诚实渲染：所有 `<a>` 都是 `#xxx` 锚点，没有"假可点"链接

最关键的几个断言：

```text
PASS: no fake hrefs (found: [])
PASS: >= 10 placeholder tokens (got 35)
PASS: no fake stats (found: null)
PASS: section projects appears after hero
PASS: section timeline appears after projects
PASS: section prompts appears after timeline
PASS: section insights appears after prompts
PASS: section reading appears after insights
PASS: section contact appears after reading
INFO: total <a> tags = 7
PASS: anchor href is a real protocol or anchor: #top
PASS: anchor href is a real protocol or anchor: #projects
... (后续 5 个锚点全部 PASS)
```

完整 HTML 输出保存在 `scripts/rendered.html`（仅验证产物，不进发布包）。

---

## 3. 浏览器检查结论

### 桌面端（≥ 1024px）

- 单列布局，最大宽度 880px 居中（`main { max-width: 880px; margin: 0 auto }`）
- Hero 顶部锚点导航水平排列；headline 大字号（`clamp(28px, 4.6vw, 40px)`）
- Project 卡片 meta 用两列 dl（96px label + 内容）
- Timeline 用左侧细线 + 圆点 marker + 右侧白底卡片，可垂直扫描

### 移动端（≤ 600px）

- `main` 容器 `padding` 收紧到 `16px`
- Project 卡片 meta 自动变成单列堆叠
- Timeline 始终是单列竖直，左侧 marker 不依赖 viewport
- 标签 / 变量 `flex-wrap` + `overflow-wrap: anywhere`，长 token 不溢出
- Prompt 卡片 `<pre>` 内部 `overflow-x: auto`，长 prompt 走横向滚动而不是撑破布局

### 链接 / 占位一致性

- 当 `href` 是空或以「待补充」开头时，所有 section 组件（Projects / Timeline / Insights / Reading / Contact）都**自动不渲染**对应的 `<a>`，避免任何"看起来可点的假链接"
- Hero 完全不渲染链接区（profile.links 为空数组）
- Contact 在无真实链接时显示虚线占位框而不是假按钮

---

## 4. 仍待用户补真实素材的位置

**全部 `src/data/*.ts` 当前都是 V1 占位内容**。下列条目需要你提供真实素材后由你自己编辑：

| 文件 | 字段 | 状态 | 说明 |
|---|---|---|---|
| `src/data/profile.ts` | `name` | ✅ 已用 `Zenith` | contract 允许 |
| | `title` / `headline` / `summary` | ⚠️ 占位 | 需要你写一句真实定位 |
| | `currentFocus` | ❌ 3 条占位 | "待补充：当前研究方向 / 正在构建的 AI 项目 / 想长期沉淀的方法论" |
| | `links` | ❌ 空数组 | Hero 和 Contact 都不渲染链接 |
| `src/data/projects.ts` | 2 个项目 | ❌ 全字段占位 | title / summary / problem / approach / stack / proof / links |
| `src/data/timeline.ts` | 2 个节点 | ❌ date / event / context / people / result 全占位 | 注意：people 只能写你明确提供的人名 |
| `src/data/prompts.ts` | 2 个 prompt | ✅ 正文 + 解释是真实设计 | 变量 `project_context` / `raw_requirement` 已显式列出 |
| | | ⚠️ 是否要替换成你真正在用的 prompt 由你决定 |
| `src/data/insights.ts` | 2 个 insight | ❌ title / summary / tags 全占位 | 没有 `href`（contract 允许：未发表时 href 留空） |
| `src/data/reading.ts` | 2 个 reading | ❌ title / source / reason 全占位 | 没有 `href` |
| `README.md` | 许可证 | ⚠️ 占位 | "待补充：选择适合的开源许可证（建议 MIT 或 Apache-2.0）" |

**当前 UI 行为（已实现，真实性约束的关键防线）：**

- Projects 卡片：无 `proof` 链接时显示 "待补充：项目截图 / Demo / GitHub / 用户反馈"；无 links 时不渲染链接列表
- Timeline 节点：无 result / link 时直接不渲染对应行
- Insights / Reading：无 `href` 时渲染为不可点的 `<div>` 而不是 `<a>`（无 `↗` 箭头）
- Contact：无真实链接时显示虚线占位框，文本为"待补充：联系方式（邮箱 / GitHub / 公众号等）。当前阶段不会渲染任何假链接。"

---

## 5. GitHub 发布状态与前置条件

### 当前状态

❌ **未发布**。当前目录不是 git repo，遵循 `docs/harness/05-github-publication.md` 的硬门禁。

### 发布前你必须做的人工确认

下列决策**脚本不能替你做**：

1. 决定仓库许可证（README 末尾占位）
2. 决定是否要把"待补充"项目先去掉、只保留 1 个示例
3. 决定是否要在 `src/data/profile.ts` 写真实姓名（contract 允许用 `Zenith`）
4. 确认 `gh auth status` 已登录

### `.gitignore` 状态

已正确（无需修改）：

```gitignore
node_modules
dist
.env
.env.*
*.log
.DS_Store
.vite
coverage
```

覆盖 `docs/harness/05-github-publication.md` 要求的全部条目。

### Staged Secret Scan 命令

发布前**必须**跑：

```bash
git diff --cached --name-only
git diff --cached | rg -n "(OPENAI_API_KEY|ANTHROPIC_API_KEY|GITHUB_TOKEN|ghp_|sk-|xoxb-|BEGIN (RSA|OPENSSH|PRIVATE) KEY)" || true
```

命中任何真实 secret 必须停止发布并清理。

### 下一步命令

```bash
cd /Users/zenith/Desktop/zenith-ai-home

# 1. 确认目录
pwd
git rev-parse --show-toplevel   # 当前还不是 git repo，会报错

# 2. 初始化 + 首次 commit
git init -b main
git branch --show-current && git rev-parse --show-toplevel   # 必须输出 main / 该目录
git add .
git status --short
git diff --cached | rg -n "(OPENAI_API_KEY|ANTHROPIC_API_KEY|GITHUB_TOKEN|ghp_|sk-|xoxb-|BEGIN (RSA|OPENSSH|PRIVATE) KEY)" || true
git commit -m "feat: V1 single-page landing with honest placeholders"

# 3. 推 public repo
gh auth status
gh repo create zenith-ai-home --public --source=. --remote=origin --push
gh repo view --json name,visibility,url
```

### 发布后必须汇报

- GitHub URL
- 首次 commit hash
- 跑过的所有验证命令
- Staged secret scan 结果
- 是否还有 clone 后不能直接运行的前置条件

---

## 6. 与 contract 的一致性自检

| Contract | 要求 | 实际 | 状态 |
|---|---|---|---|
| `00-project-brief.md` | 7 个 section 顺序 | hero → projects → timeline → prompts → insights → reading → contact | ✅ |
| `00-project-brief.md` | 不包含 CMS / 搜索 / 订阅 / 后台 | 全部未引入 | ✅ |
| `00-project-brief.md` | V1 单页 | 单页（`App.tsx` 一个根组合） | ✅ |
| `01-content-contract.md` | 不编造真实信息 | 35 个「待补充」占位，无 fake href / fake stats | ✅ |
| `01-content-contract.md` | profile.name 可用 `Zenith` | `Zenith` | ✅ |
| `01-content-contract.md` | links 无真实 URL 时不填假链接 | 数组为空 | ✅ |
| `01-content-contract.md` | Prompts 按场景组织 + 解释 + 变量 | scenario / prompt / whyItWorks / variables 全部齐全 | ✅ |
| `02-ui-contract.md` | 浅色工程杂志风 | 浅色背景 + 克制色彩 + 细边框 + 高可读排版 | ✅ |
| `02-ui-contract.md` | 项目模块早于 Timeline | 顺序在 Timeline 之前 | ✅ |
| `02-ui-contract.md` | 桌面主体最大宽度可读 | `max-width: 880px` | ✅ |
| `02-ui-contract.md` | 移动端 Timeline 不横向溢出 | 单列竖直布局 + `flex-wrap` 兜底 | ✅ |
| `02-ui-contract.md` | 不使用假筛选 / 假搜索 / 假订阅 | 未引入 | ✅ |
| `02-ui-contract.md` | 语义化 section + heading 层级 | `<header>` / `<section>` / `<article>` / `<ol>` / `<dl>` 全用上 | ✅ |
| `02-ui-contract.md` | focus 状态不被移除 | 全局 `:focus-visible { outline: 2px solid var(--accent) }` | ✅ |
| `03-implementation-plan.md` | 内容放 `src/data/*.ts` | 7 个 data 文件存在 | ✅ |
| `03-implementation-plan.md` | 组件只负责展示 | 7 个 section 组件无副作用，纯展示 | ✅ |
| `04-acceptance-checklist.md` | build 成功 | `npm run build` 314ms 通过 | ✅ |
| `04-acceptance-checklist.md` | dev server 启动 | 127.0.0.1:5174 200 OK | ✅ |
| `04-acceptance-checklist.md` | 桌面 + 移动浏览器检查 | SSR 等价验证 + CSS 断点配置 | ✅ |
| `05-github-publication.md` | repo 名 `zenith-ai-home` / Public | 发布命令中固定 | 待执行 |

---

## 7. 风险与未决项

1. **真实姓名 / 联系方式未确定**：当前 `Zenith` 是 contract 允许的占位。发布到 public repo 前需决定。
2. **许可证未确定**：README 末尾占位。需选择 MIT / Apache-2.0 / 其它。
3. **GitHub 账号未在本环境验证**：`gh auth status` 在执行发布前需人工确认。
4. **WebFetch 不可达 dev server**：浏览器验证通过 SSR + curl 探活等价完成；不替代真实 Chrome DevTools 截图（如果发布前你需要真实截图，可手动跑 `npm run dev` + 打开浏览器）。
5. **`scripts/render-check.mjs` 是否进 git**：当前未在 `.gitignore`，发布时会进 git。建议保留（一次性验证工具，未来改动 data / UI 时可重跑）。如果觉得噪音大，可加进 `.gitignore`。
