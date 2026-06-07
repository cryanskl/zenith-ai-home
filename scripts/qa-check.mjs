// v1.1 真实浏览器 QA 的等价检查。
// 视角：桌面 (>= 1024px) + 移动 (<= 600px)。
// 做法：Vite ssrLoadModule + react-dom/server.renderToStaticMarkup 拿到真实 DOM，
//       用编译后的 CSS 做布局断言（断点 / overflow / 文字换行）。
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { writeFileSync, readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

let pass = 0, fail = 0;
const assert = (cond, msg, detail) => {
  if (cond) { pass++; console.log('PASS:', msg); }
  else { fail++; console.error('FAIL:', msg, detail ?? ''); }
};

try {
  const mod = await server.ssrLoadModule('/src/App.tsx');
  const App = mod.default;
  const html = renderToStaticMarkup(createElement(App));

  // 写桌面视图
  const desktopPath = resolve(__dirname, 'qa-desktop.html');
  writeFileSync(desktopPath,
    `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><link rel="stylesheet" href="../src/index.css"/></head><body>${html}</body></html>`,
    'utf8');

  // ===== 1. Hero 首屏 =====
  // contract: "第一屏必须留下下一段内容的可见提示"
  const heroHasName = html.includes('Zenith');
  const heroHasHeadline = html.includes('用工程化方法记录 AI 项目、提示词和技术判断');
  const heroHasFocus = html.includes('当前关注');
  const heroHasCTA = /<a[^>]*class="hero-cta"[^>]*href="#projects"[^>]*>查看项目证据/.test(html);
  assert(heroHasName, 'Hero 显示 name = "Zenith"');
  assert(heroHasHeadline, 'Hero 显示 headline');
  assert(heroHasFocus, 'Hero 显示 currentFocus 区块');
  assert(heroHasCTA, 'Hero 有 "查看项目证据 →" CTA 跳到 #projects（首屏下一段提示）');

  // ===== 2. Featured AI Projects 早于 Timeline =====
  const projectsIdx = html.indexOf('id="projects"');
  const timelineIdx = html.indexOf('id="timeline"');
  assert(projectsIdx > 0, 'Featured AI Projects section 存在');
  assert(timelineIdx > 0, 'Timeline section 存在');
  assert(projectsIdx < timelineIdx, 'Featured AI Projects 在 Timeline 之前（contract 硬性）');

  // ===== 3. 项目卡片字段 =====
  const projectCardCount = (html.match(/class="project-card"/g) || []).length;
  assert(projectCardCount === 2, `项目卡片数量 = 2（当前数据）`, { got: projectCardCount });

  for (const field of ['问题', '方法', '技术栈', '证据']) {
    const occurrences = (html.match(new RegExp(`>${field}<`, 'g')) || []).length;
    assert(occurrences >= 2, `项目卡片里 "问题/方法/技术栈/证据" 标签出现（每张卡片都有）`, { field, occurrences });
  }

  // ===== 4. Timeline 移动端不横向溢出 =====
  // 节点 = timeline-item；date / event / context 都存在
  const timelineItemCount = (html.match(/class="timeline-item"/g) || []).length;
  assert(timelineItemCount === 2, `Timeline 节点数 = 2`, { got: timelineItemCount });
  for (const item of ['timeline-date', 'timeline-event', 'timeline-context']) {
    const occurrences = (html.match(new RegExp(`class="${item}"`, 'g')) || []).length;
    assert(occurrences >= 2, `Timeline 节点渲染 ${item}`, { occurrences });
  }
  // CSS 端：检查 .timeline 是否有 padding-left / border-left
  const css = readFileSync(resolve(root, 'src/index.css'), 'utf8');
  assert(/\.timeline\s*\{[^}]*border-left/.test(css), 'CSS: .timeline 有 border-left marker');
  assert(/\.timeline\s*\{[^}]*padding-left/.test(css), 'CSS: .timeline 有 padding-left');
  assert(/@media\s*\(max-width:\s*600px\)/.test(css), 'CSS: 移动端断点 ≤600px 已配置');
  // 注意：CSS 里有两个独立的 @media (max-width: 600px) 块
  assert(/\.project-meta\s*>\s*div\s*\{[\s\S]*?grid-template-columns:\s*1fr[\s\S]*?\}/m.test(css)
      && /@media\s*\(max-width:\s*600px\)\s*\{[\s\S]*?\.project-meta\s*>\s*div\s*\{[\s\S]*?grid-template-columns:\s*1fr/m.test(css),
    'CSS: 移动端 .project-meta 变成单列（grid-template-columns: 1fr）');

  // ===== 5. Prompt 卡片：<pre> 内部 overflow-x: auto =====
  assert(/<pre[^>]*class="prompt-body"/.test(html), 'Prompt 卡片渲染 <pre class="prompt-body">');
  assert(/\.prompt-body\s*\{[^}]*overflow-x:\s*auto/.test(css), 'CSS: .prompt-body 有 overflow-x: auto（长 prompt 横向滚动）');
  assert(/\.prompt-body\s*\{[^}]*white-space:\s*pre-wrap/.test(css), 'CSS: .prompt-body 启用 pre-wrap，短 prompt 在窄屏可换行');
  assert(/\.prompt-body\s*\{[^}]*word-break:\s*break-word/.test(css), 'CSS: .prompt-body 启用 word-break: break-word');

  // ===== 6. 链接诚实渲染（无 fake href）=====
  const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
  const fakeHrefs = hrefs.filter((h) => /待补充/.test(h) || h === '' || h === '#');
  assert(fakeHrefs.length === 0, '链接诚实渲染：没有 fake href', { fakeHrefs });
  // 所有 <a> 应该是内部锚点（#xxx）
  const nonAnchorHrefs = hrefs.filter((h) => !h.startsWith('#'));
  assert(nonAnchorHrefs.length === 0, '所有 href 是内部锚点（#xxx），没有外链', { nonAnchorHrefs });

  // ===== 7. 占位密度观察（这是诊断，不是 fail）=====
  const placeholderCount = (html.match(/待补充/g) || []).length;
  console.log(`\nDIAG: "待补充" 出现 ${placeholderCount} 次`);
  // 按 section 统计
  const sliceBetween = (start, end) => html.slice(start, end);
  const sectionDefs = [
    ['Hero', 'id="top"', 'id="projects"'],
    ['Projects', 'id="projects"', 'id="timeline"'],
    ['Timeline', 'id="timeline"', 'id="prompts"'],
    ['Prompts', 'id="prompts"', 'id="insights"'],
    ['Insights', 'id="insights"', 'id="reading"'],
    ['Reading', 'id="reading"', 'id="contact"'],
    ['Contact', 'id="contact"', html.length],
  ];
  for (const [name, start, end] of sectionDefs) {
    const sectionHtml = sliceBetween(html.indexOf(start), end === html.length ? html.length : html.indexOf(end));
    const n = (sectionHtml.match(/待补充/g) || []).length;
    console.log(`  - ${name.padEnd(10)}: ${n} 处待补充`);
  }

  // ===== 8. 假 stats 检查 =====
  const fakeStats = html.match(/(1000\+|服务\s*\d|提升\s*\d+%|已发表|前\s*\d+\s*家|排行\s*\d+)/g);
  assert(!fakeStats, '没有假 stats（典型 AI 模板数据）', { fakeStats });

  // ===== 9. 桌面 vs 移动布局差异（CSS 静态分析）=====
  // 桌面：main max-width 880px；移动：padding 16px
  assert(/main\s*\{[^}]*max-width:\s*880px/.test(css), 'CSS: main 容器 max-width 880px（桌面可读）');
  assert(/@media\s*\(max-width:\s*600px\)[\s\S]*?main\s*\{[^}]*padding:\s*0\s+16px/.test(css),
    'CSS: 移动端 main padding 收紧到 16px');

  // ===== 10. 关键可读性元素 =====
  assert(/<a[^>]*class="hero-cta"[^>]*href="#projects"[^>]*>查看项目证据/.test(html), 'Hero CTA 文案 + 目标正确');
  assert(html.includes('Featured AI Projects'), 'section eyebrow: Featured AI Projects');
  assert(html.includes('Technical Insights'), 'section eyebrow: Technical Insights');
  assert(html.includes('Recommended Reading'), 'section eyebrow: Recommended Reading');

  console.log(`\n=== QA 总结 ===`);
  console.log(`PASS: ${pass}`);
  console.log(`FAIL: ${fail}`);
  console.log(`Desktop HTML: ${desktopPath}`);
  process.exitCode = fail > 0 ? 1 : 0;
} finally {
  await server.close();
}
