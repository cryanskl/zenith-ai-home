import type { InsightItem } from '../data/types';

type Props = {
  insights: InsightItem[];
};

function isRealHref(href: string | undefined): href is string {
  if (!href) return false;
  if (href.trim() === '') return false;
  if (/^待补充/.test(href.trim())) return false;
  return true;
}

export function Insights({ insights }: Props) {
  return (
    <section className="section" id="insights" aria-labelledby="insights-title">
      <header className="section-header">
        <p className="section-eyebrow">04 · Technical Insights</p>
        <h2 className="section-title" id="insights-title">
          技术见解
        </h2>
        <p className="section-subtitle">
          关注的是技术判断，而不是博客摘要。只有当文章已经发表，才展示链接。
        </p>
      </header>

      <ul className="insight-list">
        {insights.map((insight) => {
          const inner = (
            <>
              <h3 className="insight-title">{insight.title}</h3>
              <p className="insight-summary">{insight.summary}</p>
              <ul className="tag-list">
                {insight.tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </>
          );
          return (
            <li key={insight.title} className="insight-item">
              {isRealHref(insight.href) ? (
                <a
                  className="insight-card insight-card-link"
                  href={insight.href}
                  rel="noopener noreferrer"
                >
                  {inner}
                  <span className="insight-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ) : (
                <div className="insight-card">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
