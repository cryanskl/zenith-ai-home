import type { ReadingItem } from '../data/types';

type Props = {
  reading: ReadingItem[];
};

function isRealHref(href: string | undefined): href is string {
  if (!href) return false;
  if (href.trim() === '') return false;
  if (/^待补充/.test(href.trim())) return false;
  return true;
}

export function Reading({ reading }: Props) {
  return (
    <section className="section" id="reading" aria-labelledby="reading-title">
      <header className="section-header">
        <p className="section-eyebrow">05 · Recommended Reading</p>
        <h2 className="section-title" id="reading-title">
          推荐阅读
        </h2>
        <p className="section-subtitle">
          长期 curated list：每一条都说明「为什么保留」，不追每日热点。
        </p>
      </header>

      <ul className="reading-list">
        {reading.map((item) => {
          const inner = (
            <>
              <h3 className="reading-title">{item.title}</h3>
              <p className="reading-source">{item.source}</p>
              <p className="reading-reason">
                <span className="reading-label">为什么保留</span>
                {item.reason}
              </p>
            </>
          );
          return (
            <li key={item.title} className="reading-item">
              {isRealHref(item.href) ? (
                <a
                  className="reading-card reading-card-link"
                  href={item.href}
                  rel="noopener noreferrer"
                >
                  {inner}
                  <span className="reading-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ) : (
                <div className="reading-card">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
