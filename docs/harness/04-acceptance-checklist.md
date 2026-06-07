# Acceptance Checklist

## Harness 文档

- [ ] `AGENTS.md` 存在。
- [ ] `docs/harness/00-project-brief.md` 存在。
- [ ] `docs/harness/01-content-contract.md` 存在。
- [ ] `docs/harness/02-ui-contract.md` 存在。
- [ ] `docs/harness/03-implementation-plan.md` 存在。
- [ ] `docs/harness/04-acceptance-checklist.md` 存在。
- [ ] `docs/harness/05-github-publication.md` 存在。

检查命令：

```bash
find docs/harness -maxdepth 1 -type f | sort
```

## 内容真实性

- [ ] 没有编造真实人物。
- [ ] 没有编造活动。
- [ ] 没有编造奖项或名次。
- [ ] 没有编造项目成果。
- [ ] 没有假 GitHub / Demo / 文章链接。
- [ ] 占位内容明确使用「待补充」。

## 实现结构

- [ ] 使用 Vite + React + TypeScript。
- [ ] 内容放在 `src/data/*.ts`。
- [ ] 组件只负责展示。
- [ ] 没有后端、数据库、CMS、搜索、自动热点。

## UI 验收

- [ ] Hero 清楚表达个人定位。
- [ ] 项目模块早于 Timeline。
- [ ] Timeline 作为关键经历证据链。
- [ ] Prompt 卡片包含场景、提示词、解释、变量。
- [ ] 推荐阅读是 curated list，不是每日热点。
- [ ] 桌面端布局可读。
- [ ] 移动端无横向溢出。
- [ ] 文本没有溢出按钮、卡片或标签。
- [ ] 外部链接真实；没有真实链接时不渲染假链接。

## 验证命令

- [ ] `npm install` 成功。
- [ ] `npm run build` 成功。
- [ ] `npm run dev -- --host 127.0.0.1` 成功启动。
- [ ] 浏览器桌面宽度检查完成。
- [ ] 浏览器移动宽度检查完成。

## GitHub 发布前

- [ ] `git branch --show-current && git rev-parse --show-toplevel` 已确认。
- [ ] `.gitignore` 排除 `.env*`、`node_modules`、`dist`、日志、缓存。
- [ ] staged secret scan 已完成。
- [ ] `gh auth status` 成功。
- [ ] public repo 名称确认为 `zenith-ai-home`。
