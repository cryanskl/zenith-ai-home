import type { Profile } from '../data/types';

type Props = {
  profile: Profile;
};

export function Hero({ profile }: Props) {
  const hasLinks = profile.links.length > 0;

  return (
    <header className="hero" id="top">
      <nav className="hero-nav" aria-label="主导航">
        <a className="hero-nav-brand" href="#top">
          {profile.name}
        </a>
        <ul className="hero-nav-links">
          <li>
            <a href="#projects">项目</a>
          </li>
          <li>
            <a href="#timeline">经历</a>
          </li>
          <li>
            <a href="#prompts">提示词</a>
          </li>
          <li>
            <a href="#insights">见解</a>
          </li>
          <li>
            <a href="#reading">阅读</a>
          </li>
          <li>
            <a href="#contact">联系</a>
          </li>
        </ul>
      </nav>

      <div className="hero-body">
        <div className="hero-copy">
          <p className="hero-title">{profile.title}</p>
          <h1 className="hero-headline">{profile.headline}</h1>
          <p className="hero-summary">{profile.summary}</p>

          {hasLinks && (
            <ul className="hero-links" aria-label="联系方式">
              {profile.links.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a href={link.href} rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <a className="hero-cta" href="#projects">
            查看项目证据
          </a>
        </div>

        {profile.currentFocus.length > 0 && (
          <aside className="hero-panel" aria-label="当前关注方向">
            <div className="hero-panel-rule" aria-hidden="true" />
            <p className="hero-panel-title">Fieldnotes in progress</p>
            <p className="hero-panel-copy">
              当前页面保留真实内容占位，只在你补充素材后展示具体经历、链接与成果。
            </p>
            <ul className="hero-focus-list">
              {profile.currentFocus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </header>
  );
}
