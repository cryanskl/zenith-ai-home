import type { Project } from '../data/types';

type Props = {
  projects: Project[];
};

function isRealHref(href: string | undefined): href is string {
  if (!href) return false;
  if (href.trim() === '') return false;
  if (/^待补充/.test(href.trim())) return false;
  return true;
}

export function Projects({ projects }: Props) {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <header className="section-header">
        <p className="section-eyebrow">01 · Featured AI Projects</p>
        <h2 className="section-title" id="projects-title">
          AI 工程实践
        </h2>
        <p className="section-subtitle">
          先看项目，再看经历。问题、方法、技术栈和可验证证据。
        </p>
      </header>

      <div className="project-grid">
        {projects.map((project, index) => {
          const realLinks = (project.links ?? []).filter((l) =>
            isRealHref(l.href),
          );
          const isFeatured = index === 0;

          return (
            <article
              className={isFeatured ? 'project-card project-card-featured' : 'project-card'}
              key={project.title}
            >
              <div className="project-card-head">
                <p className="project-card-kicker">
                  {isFeatured ? 'Primary evidence' : 'Supporting record'}
                </p>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-summary">{project.summary}</p>
              </div>

              <dl className="project-meta">
                <div>
                  <dt>问题</dt>
                  <dd>{project.problem}</dd>
                </div>
                <div>
                  <dt>方法</dt>
                  <dd>{project.approach}</dd>
                </div>
                <div>
                  <dt>技术栈</dt>
                  <dd>
                    <ul className="tag-list">
                      {project.stack.map((s) => (
                        <li key={s} className="tag">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt>证据</dt>
                  <dd>{project.proof ?? '待补充：项目截图 / Demo / GitHub / 用户反馈'}</dd>
                </div>
              </dl>

              {realLinks.length > 0 && (
                <ul className="project-links" aria-label="项目链接">
                  {realLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} rel="noopener noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
