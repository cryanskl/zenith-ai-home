# GitHub Publication

## 目标

把 `zenith-ai-home` 安全发布为 public GitHub repo。

Repo 名称：

```text
zenith-ai-home
```

可见性：

```text
Public
```

## 发布前硬门禁

发布前必须确认：

- 当前目录是 `/Users/zenith/Desktop/zenith-ai-home`
- 当前 git repo top-level 匹配该目录
- build 成功
- `.gitignore` 正确排除本地和敏感文件
- staged 文件不包含 secret
- 没有未确认的真实个人信息或假链接

## 初始化 Git

如果目录还不是 git repo：

```bash
git init -b main
```

commit 前必须运行：

```bash
git branch --show-current && git rev-parse --show-toplevel
```

预期：

```text
main
/Users/zenith/Desktop/zenith-ai-home
```

## `.gitignore` 要求

必须排除：

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

## Secret Scan

发布前至少运行：

```bash
git diff --cached --name-only
git diff --cached | rg -n "(OPENAI_API_KEY|ANTHROPIC_API_KEY|GITHUB_TOKEN|ghp_|sk-|xoxb-|BEGIN (RSA|OPENSSH|PRIVATE) KEY)" || true
```

如果命中任何真实 secret，必须停止发布并清理。

## 创建并推送 public repo

确认 GitHub CLI 登录：

```bash
gh auth status
```

创建并推送：

```bash
gh repo create zenith-ai-home --public --source=. --remote=origin --push
```

发布后确认：

```bash
gh repo view --web
gh repo view --json name,visibility,url
```

## 汇报要求

发布后必须汇报：

- GitHub URL
- commit hash
- 运行过的验证命令
- staged secret scan 结果
- 是否还有 clone 后不能直接运行的前置条件
