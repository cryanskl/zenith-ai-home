import type { PromptItem } from '../data/types';

type Props = {
  prompts: PromptItem[];
};

export function Prompts({ prompts }: Props) {
  return (
    <section className="section" id="prompts" aria-labelledby="prompts-title">
      <header className="section-header">
        <h2 className="section-title" id="prompts-title">
          可复用 Prompt
        </h2>
        <p className="section-subtitle">
          按场景组织，每条都说明「为什么有效」和「变量怎么替换」。
        </p>
      </header>

      <div className="prompt-grid">
        {prompts.map((p) => (
          <article className="prompt-card" key={`${p.scenario}-${p.prompt}`}>
            <header className="prompt-head">
              <h3 className="prompt-scenario">{p.scenario}</h3>
            </header>

            <pre className="prompt-body" aria-label="提示词正文">
              <code>{p.prompt}</code>
            </pre>

            <p className="prompt-why">
              <span className="prompt-label">为什么有效</span>
              {p.whyItWorks}
            </p>

            <div className="prompt-vars">
              <span className="prompt-label">变量</span>
              <ul className="tag-list">
                {p.variables.map((v) => (
                  <li key={v} className="tag tag-var">
                    {`{{${v}}}`}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
