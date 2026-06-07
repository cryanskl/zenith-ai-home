# AGENTS.md

## 项目目标

`zenith-ai-home` 是一个中文 AI 个人品牌站，面向技术同行。第一版必须突出：

- AI 工程实践与项目证据
- 关键经历 Timeline
- 推荐提示词与使用方法
- 技术见解与推荐阅读
- 可公开发布到 GitHub 的干净项目结构

## 工作流约定

- 开始任何任务前先显式分类：「小修复」还是「功能/重构」，并简短说明理由。
- 非平凡功能走：理解 harness 文档 -> 明确计划 -> 实现 -> build 验证 -> 浏览器验证 -> 汇报。
- 小修复可以直接做定向修改，但仍需运行相关验证。
- 默认最小实现：不要添加 CMS、搜索、每日热点自动刷新、后台管理、登录、评论系统等未要求功能。
- 用中文回复。

## 内容真实性约束

- 不得编造真实人物、活动、奖项、名次、项目成果、链接、公司名、统计数字。
- 没有真实素材时，只能使用明确标记的占位内容。
- 占位内容必须使用可替换语义，例如「待补充：项目名称」，不能写成看似真实的经历。
- 所有个人经历、遇到的人、名次、活动结果、项目 proof 都必须来自用户提供素材。

## 实现约束

- 站点采用 Vite + React + TypeScript。
- 个人内容放在 `src/data/*.ts`，组件只负责展示。
- UI 风格遵循 `docs/harness/02-ui-contract.md`。
- 页面结构遵循 `docs/harness/00-project-brief.md`。
- 内容字段遵循 `docs/harness/01-content-contract.md`。
- 不引入后端、数据库或运行时 API。

## 验证约束

- 每次实现后至少运行 `npm run build`。
- 涉及 UI 的改动必须启动本地 dev server 并做浏览器验证。
- 浏览器验证至少覆盖桌面宽度和移动宽度。
- 检查文本是否溢出、Timeline 是否可读、链接是否真实或为空。

## Git 与公开发布安全

- commit / push / 文件编辑前，存在多 worktree 或并行会话时先确认 worktree。
- commit 前必须运行：

```bash
git branch --show-current && git rev-parse --show-toplevel
```

- 公开发布前必须检查 `.env*`、`node_modules`、`dist`、日志、缓存和 staged secrets。
- 不得执行破坏性 Git 操作，除非用户在当前消息中明确授权。
- 不得用 `--amend` 修复 pre-commit hook 失败；hook 失败代表 commit 未发生，应修复后重新 add 并创建新 commit。

## 汇报格式

最终汇报必须包含：

- 改了什么
- 运行了哪些验证命令
- 浏览器检查结果
- 哪些内容仍等待用户补真实素材
- 是否已发布到 GitHub；如果没有，列出下一步命令和前置检查
