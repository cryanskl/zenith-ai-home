import type { TimelineItem } from '../data/types';

type Props = {
  items: TimelineItem[];
};

function hasRealText(value: string | undefined): boolean {
  if (!value) return false;
  if (value.trim() === '') return false;
  if (/^待补充/.test(value.trim())) return false;
  return true;
}

export function Timeline({ items }: Props) {
  return (
    <section className="section" id="timeline" aria-labelledby="timeline-title">
      <header className="section-header">
        <p className="section-eyebrow">02 · Timeline</p>
        <h2 className="section-title" id="timeline-title">
          关键经历
        </h2>
        <p className="section-subtitle">
          不是成长日记，而是支撑个人品牌的证据链：场域、人物与结果。
        </p>
      </header>

      <ol className="timeline">
        {items.map((item, idx) => {
          const realPeople = (item.people ?? []).filter(hasRealText);
          return (
            <li className="timeline-item" key={`${item.date}-${idx}`}>
              <div className="timeline-marker" aria-hidden="true">
                <span className="timeline-dot" />
              </div>
              <div className="timeline-content">
                <p className="timeline-date">{item.date}</p>
                <h3 className="timeline-event">{item.event}</h3>
                <p className="timeline-context">{item.context}</p>

                {realPeople.length > 0 && (
                  <p className="timeline-people">
                    <span className="timeline-label">涉及</span>
                    {realPeople.join('、')}
                  </p>
                )}

                {hasRealText(item.result) && (
                  <p className="timeline-result">
                    <span className="timeline-label">结果</span>
                    {item.result}
                  </p>
                )}

                {hasRealText(item.link) && (
                  <p className="timeline-link">
                    <a href={item.link} rel="noopener noreferrer">
                      详情 →
                    </a>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
