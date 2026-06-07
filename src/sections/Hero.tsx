import type { Profile } from '../data/types';

type Props = {
  profile: Profile;
};

export function Hero({ profile }: Props) {
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
        </ul>
      </nav>

      <div className="hero-body">
        <p className="hero-eyebrow">{profile.title}</p>
        <h1 className="hero-headline">{profile.headline}</h1>
        <p className="hero-summary">{profile.summary}</p>

        {profile.currentFocus.length > 0 && (
          <div className="hero-focus" aria-label="当前关注方向">
            <span className="hero-focus-label">当前关注</span>
            <ul>
              {profile.currentFocus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {profile.links.length > 0 && (
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
          查看项目证据 →
        </a>
      </div>
    </header>
  );
}
