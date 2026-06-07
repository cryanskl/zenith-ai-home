import type { Profile } from '../data/types';

type Props = {
  profile: Profile;
};

function isRealHref(href: string): boolean {
  if (!href) return false;
  if (href.trim() === '') return false;
  if (/^待补充/.test(href.trim())) return false;
  return true;
}

export function Contact({ profile }: Props) {
  const realLinks = profile.links.filter((l) => isRealHref(l.href));
  return (
    <footer className="contact" id="contact">
      <div className="contact-body">
        <p className="contact-eyebrow">06 · Contact</p>
        <h2 className="contact-title">联系 / 后续</h2>

        {realLinks.length > 0 ? (
          <ul className="contact-links" aria-label="联系方式">
            {realLinks.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <a href={link.href} rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="contact-placeholder">
            待补充：联系方式（邮箱 / GitHub / 公众号等）。当前阶段不会渲染任何假链接。
          </p>
        )}

        <p className="contact-foot">
          © {new Date().getFullYear()} {profile.name} · zenith-ai-home
        </p>
      </div>
    </footer>
  );
}
