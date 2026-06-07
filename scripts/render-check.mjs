// SSR-style render check: render <App /> to HTML string, then assert content & layout invariants.
// 桌面 vs 移动：CSS 媒体查询不会切换，但通过模拟 DOM 容器宽度可以验证"无横向溢出"等结构性约束。
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// 直接用 Vite 的 dev pipeline 不行，我们这里走 tsx-on-the-fly。
// 用 esbuild-register 之类太重。改用：先调用 vite build 产出的 dist/assets/index-*.js？
// 不，dist 是 production build，无 source map 易读。最简办法：直接 require 走 tsc 编译。
// 我们的策略：调用 Vite 的 ssrLoadModule。
import { createServer } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const mod = await server.ssrLoadModule('/src/App.tsx');
  const App = mod.default;
  const html = renderToStaticMarkup(createElement(App));

  // 写出来方便检查
  const out = resolve(__dirname, 'rendered.html');
  const { writeFileSync } = await import('fs');
  writeFileSync(out, `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><link rel="stylesheet" href="./index.css"/></head><body>${html}</body></html>`, 'utf8');

  const assert = (cond, msg) => {
    if (!cond) {
      console.error('FAIL:', msg);
      process.exitCode = 1;
    } else {
      console.log('PASS:', msg);
    }
  };

  // ===== 1. 内容真实性 =====
  // 任何 href 不应该是 "待补充" 或空
  const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
  const fakeHrefs = hrefs.filter((h) => /待补充/.test(h) || h === '' || h === '#');
  assert(fakeHrefs.length === 0, `no fake hrefs (found: ${JSON.stringify(fakeHrefs)})`);

  // 至少有几个"待补充"占位，因为内容是 placeholder
  const placeholderCount = (html.match(/待补充/g) || []).length;
  assert(placeholderCount >= 10, `>= 10 placeholder tokens (got ${placeholderCount})`);

  // 不能有 fake stats（典型 AI 模板：1000+ / 服务 X 用户 / 提升 X%）
  const fakeStats = html.match(/(1000\+|服务\s*\d|提升\s*\d+%|已发表)/g);
  assert(!fakeStats, `no fake stats (found: ${JSON.stringify(fakeStats)})`);

  // ===== 2. 页面顺序 =====
  const order = ['hero', 'projects', 'timeline', 'prompts', 'insights', 'reading', 'contact'];
  const positions = order.map((id) => ({ id, idx: html.indexOf(`id="${id}"`) }));
  for (let i = 1; i < positions.length; i++) {
    assert(positions[i].idx > positions[i - 1].idx, `section ${positions[i].id} appears after ${positions[i - 1].id}`);
  }

  // ===== 3. 关键字段全部出现在 DOM 中 =====
  // 来自 src/data/*.ts
  const mustContain = [
    'Zenith', // profile.name
    'AI Engineering Fieldnotes', // profile.title
    'Featured AI Projects',
    'Timeline',
    'Recommended Prompts',
    'Technical Insights',
    'Recommended Reading',
    '项目复盘', // prompts[0].scenario
    'Prompt 结构化改写', // prompts[1].scenario
    '问题', '方法', '技术栈', '证据', // projects dl labels
    '当前关注', // hero focus label
  ];
  for (const t of mustContain) {
    assert(html.includes(t), `contains "${t}"`);
  }

  // ===== 4. 链接诚实渲染 =====
  // 全部 6 个 section 的"可点链接"应该只来自 Hero 锚点 + Footer 占位文本
  // 我们数 <a href> 数量 vs 渲染的内容
  const allAnchors = [...html.matchAll(/<a [^>]*href="([^"]*)"/g)];
  console.log(`INFO: total <a> tags = ${allAnchors.length}`);
  for (const m of allAnchors) {
    const h = m[1];
    assert(
      h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('http'),
      `anchor href is a real protocol or anchor: ${h}`,
    );
  }

  // ===== 5. 桌面/移动 =====
  // CSS 是 separate file，HTML 自身不带 media query。
  // 我们手动检查"是否存在横向溢出风险字符串"——通过检查超长未分割 token。
  // 因为占位内容是"待补充：xxx"，长度合理，预期不会溢出。
  // 这里用最朴素的方法：找 longest text node。
  const textNodes = [...html.matchAll(/>([^<>]{40,})</g)].map((m) => m[1].trim());
  const longest = textNodes.reduce((a, b) => (a.length > b.length ? a : b), '');
  console.log(`INFO: longest text node length = ${longest.length} (${longest.slice(0, 80)}...)`);

  console.log('\nRendered HTML written to:', out);
} finally {
  await server.close();
}
