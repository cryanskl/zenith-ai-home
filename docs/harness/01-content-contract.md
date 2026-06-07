# Content Contract

## 总原则

内容真实性优先于页面丰富度。没有用户提供的真实素材时，只使用明确占位内容。

禁止：

- 编造真实人物
- 编造活动和会议
- 编造奖项、名次、项目成果
- 编造 GitHub、Demo、文章、公司或媒体链接
- 使用看似真实的假数据，例如「服务 1000+ 用户」

允许：

- 使用「待补充」占位内容
- 使用结构化字段说明未来需要补什么
- 使用非事实性的设计文案，例如「聚焦 AI 工程实践」

## Profile

建议文件：`src/data/profile.ts`

字段：

```ts
export type Profile = {
  name: string;
  title: string;
  headline: string;
  summary: string;
  currentFocus: string[];
  links: {
    label: string;
    href: string;
  }[];
};
```

占位规则：

- `name` 可以使用 `Zenith`。
- 联系链接没有真实 URL 时，不要填假链接。

## Projects

建议文件：`src/data/projects.ts`

字段：

```ts
export type Project = {
  title: string;
  summary: string;
  problem: string;
  approach: string;
  stack: string[];
  proof?: string;
  links?: { label: string; href: string }[];
};
```

占位规则：

- `proof` 没有真实证据时写「待补充：项目截图 / Demo / GitHub / 用户反馈」。
- `links` 没有真实链接时留空数组。

## Timeline

建议文件：`src/data/timeline.ts`

字段：

```ts
export type TimelineItem = {
  date: string;
  event: string;
  context: string;
  people?: string[];
  result?: string;
  link?: string;
};
```

占位规则：

- `people` 只能写用户明确提供的人名。
- `result` 只能写真实结果，例如名次、奖项、入选、演讲、项目里程碑。
- 没有真实结果时写「待补充：活动结果」。

## Prompts

建议文件：`src/data/prompts.ts`

字段：

```ts
export type PromptItem = {
  scenario: string;
  prompt: string;
  whyItWorks: string;
  variables: string[];
};
```

内容要求：

- Prompt 必须按场景组织。
- 每条 prompt 要解释为什么有效。
- 变量必须显式列出，方便替换。

## Insights

建议文件：`src/data/insights.ts`

字段：

```ts
export type InsightItem = {
  title: string;
  summary: string;
  tags: string[];
  href?: string;
};
```

占位规则：

- 没有真实文章时，`href` 留空。
- 标题可以是未来要写的主题，但不能声称已经发表。

## Reading

建议文件：`src/data/reading.ts`

字段：

```ts
export type ReadingItem = {
  title: string;
  source: string;
  reason: string;
  href?: string;
};
```

内容要求：

- 推荐阅读是长期 curated list，不是每日热点。
- 推荐理由要体现选择标准，不只是「值得一读」。
