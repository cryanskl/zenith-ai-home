# Implementation Plan

## Phase 1: Scaffold

目标：创建 Vite + React + TypeScript 项目。

命令：

```bash
npm create vite@latest . -- --template react-ts
npm install
```

验收：

```bash
npm run build
```

预期：build 成功，生成 `dist/`。

## Phase 2: Harness Documents

目标：确认 harness 文档存在并可作为后续 agent 约束。

必须存在：

```text
AGENTS.md
docs/harness/00-project-brief.md
docs/harness/01-content-contract.md
docs/harness/02-ui-contract.md
docs/harness/03-implementation-plan.md
docs/harness/04-acceptance-checklist.md
docs/harness/05-github-publication.md
```

检查命令：

```bash
find docs/harness -maxdepth 1 -type f | sort
```

## Phase 3: Data Model

目标：创建 `src/data/`，把内容和 UI 分离。

创建：

```text
src/data/types.ts
src/data/profile.ts
src/data/projects.ts
src/data/timeline.ts
src/data/prompts.ts
src/data/insights.ts
src/data/reading.ts
```

验收：

- 没有虚构真实经历。
- 没有假链接。
- 占位内容明确包含「待补充」。

## Phase 4: Homepage UI

目标：实现单页 landing page。

页面顺序：

1. Hero
2. Featured AI Projects
3. Timeline
4. Recommended Prompts
5. Technical Insights
6. Recommended Reading
7. Contact / Footer

验收：

- 所有模块从 `src/data/*.ts` 读取内容。
- 没有不可用按钮。
- 没有 fake stats。
- 移动端无横向溢出。

## Phase 5: Styling

目标：实现浅色工程杂志风格。

要求：

- 高可读性排版
- 克制色彩
- 清晰分区
- Timeline 可扫描
- 卡片不做过度装饰

验收：

- 桌面端和移动端都可读。
- 文本不溢出父容器。
- 第一屏能看到下一段内容提示。

## Phase 6: Documentation

目标：补充 README 和运行说明。

README 必须包含：

- 项目定位
- 本地运行命令
- 内容维护方式
- 真实性约束
- GitHub 发布前检查

## Phase 7: Verification

命令：

```bash
npm run build
npm run dev -- --host 127.0.0.1
```

浏览器检查：

- 桌面宽度
- 移动宽度
- 首屏信息层级
- Timeline 可读性
- 链接状态
- 文本溢出

## Phase 8: Public GitHub Preparation

目标：让项目可以安全上传到 public GitHub。

检查：

```bash
git branch --show-current && git rev-parse --show-toplevel
git status --short
gh auth status
```

发布命令：

```bash
gh repo create zenith-ai-home --public --source=. --remote=origin --push
```

注意：发布前必须完成 staged secret scan。
