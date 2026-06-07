# zenith-ai-home

中文 AI 个人品牌 landing page，面向技术同行。V1 是单页结构，展示 AI 工程实践、项目证据、关键经历、推荐提示词、技术见解和阅读推荐。

## 项目定位

不是普通简历页，也不是资讯站。访问者在一分钟内应该能看出：

- 你关注哪些 AI 工程问题
- 你做过哪些 AI 项目或实验
- 你的关键经历、活动、人物连接、外部认可
- 你如何使用 prompt、工具和工程方法解决问题
- 你有哪些值得继续阅读的技术见解

页面顺序固定为：

1. Hero
2. Featured AI Projects
3. Timeline
4. Recommended Prompts
5. Technical Insights
6. Recommended Reading
7. Contact / Footer

详见 `docs/harness/00-project-brief.md`。

## 本地运行

```bash
npm install
npm run dev -- --host 127.0.0.1
```

构建：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run preview
```

要求 Node 20+。

## 目录结构

```text
docs/harness/        设计与内容契约（项目简报、内容契约、UI 契约、实现计划、验收清单、GitHub 发布）
src/data/            全部内容（profile / projects / timeline / prompts / insights / reading）
src/sections/        单页各 section 组件，只负责展示
src/App.tsx          单页组合
src/main.tsx         入口
src/index.css        浅色工程杂志风样式
index.html           页面骨架（lang="zh-CN"）
```

## 内容维护

所有个人内容都在 `src/data/*.ts` 里，section 组件只读不写。要更新内容：

- `src/data/profile.ts`：姓名、title、headline、summary、currentFocus、links
- `src/data/projects.ts`：title、summary、problem、approach、stack、proof、links
- `src/data/timeline.ts`：date、event、context、people、result、link
- `src/data/prompts.ts`：scenario、prompt、whyItWorks、variables
- `src/data/insights.ts`：title、summary、tags、href
- `src/data/reading.ts`：title、source、reason、href

UI 改完 `src/data/*.ts` 后不需要碰组件就能看到效果。

## 真实性约束

本项目强制不编造任何真实信息：

- 不编造真实人物、活动、会议、奖项、名次、项目成果
- 不编造 GitHub、Demo、文章、公司、媒体链接
- 不使用看似真实的假数据（例如「服务 1000+ 用户」）
- 没有真实素材时只能写「待补充：xxx」占位
- 没有真实链接时，UI 会自动不渲染对应的 `<a>`，避免出现假链接

UI 已实现"诚实渲染"：当 `href` 是空或以「待补充」开头时，组件不会生成可点击的链接。

## GitHub 发布前检查

参考 `docs/harness/05-github-publication.md`。最小硬门禁：

1. 确认目录与分支：

   ```bash
   pwd
   git branch --show-current && git rev-parse --show-toplevel
   ```

   预期：

   ```text
   /Users/zenith/Desktop/zenith-ai-home
   main
   ```

2. 确认 `.gitignore` 排除：`node_modules`、`dist`、`.env*`、`*.log`、`.DS_Store`、`.vite`、`coverage`。

3. Staged secret scan：

   ```bash
   git diff --cached --name-only
   git diff --cached | rg -n "(OPENAI_API_KEY|ANTHROPIC_API_KEY|GITHUB_TOKEN|ghp_|sk-|xoxb-|BEGIN (RSA|OPENSSH|PRIVATE) KEY)" || true
   ```

   命中任何真实 secret 必须停止发布并清理。

4. 确认 `npm run build` 通过。

5. 确认 `gh auth status` 已登录。

6. 公开仓库名称：`zenith-ai-home`（public）。

发布命令：

```bash
gh repo create zenith-ai-home --public --source=. --remote=origin --push
```

发布后确认：

```bash
gh repo view --json name,visibility,url
```

## 验证清单

- [ ] `npm install` 成功
- [ ] `npm run build` 成功
- [ ] `npm run dev -- --host 127.0.0.1` 启动后，桌面端 / 移动端浏览器均可读
- [ ] 项目模块早于 Timeline
- [ ] 没有不可用按钮、没有 fake stats
- [ ] 移动端 Timeline 不横向溢出
- [ ] 文本不溢出按钮、卡片、标签
- [ ] 占位内容明确写「待补充」
- [ ] `.gitignore` 正确
- [ ] staged secret scan 通过

## 许可证与使用约定

**代码许可：待定。** 仓库目前没有附带 `LICENSE` 文件。在正式许可证添加之前，请视为"All rights reserved"，未经作者明确许可不要复制、再分发或商用本站代码。

**个人内容不授权复用。** 即便未来添加了开源许可证，下列内容也**不**在任何许可证授权范围内：

- `src/data/profile.ts` 里的姓名、定位、当前关注、链接
- `src/data/projects.ts` 里的项目、问题、方法、证据、链接
- `src/data/timeline.ts` 里的日期、事件、人物、结果、链接
- `src/data/prompts.ts` 里基于个人工作流整理的提示词
- `src/data/insights.ts`、`src/data/reading.ts` 里的标题、摘要、推荐理由

这些内容是个人经历和判断的事实记录，请勿直接复制、翻译、改写后用作自己的展示。

如果你想在你的项目里复用本站的代码或结构（页面骨架、组件、样式系统），请先和作者确认。
