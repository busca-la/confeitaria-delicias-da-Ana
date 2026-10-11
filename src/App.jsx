import { useEffect, useState } from 'react';
import OrderSystem from './components/OrderSystem.jsx';

const INSTAGRAM = 'https://www.instagram.com/confeitaria_deliiciasdaana/';
const photo = (id, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

function Arrow({ diagonal = false }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {diagonal
        ? <path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M4 12h16m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

function Flourish() {
  return (
    <svg viewBox="0 0 112 28" fill="none" aria-hidden="true" className="flourish">
      <path d="M0 14h38m36 0h38M42 14c5-2 8-9 14-9s9 7 14 9c-5 2-8 9-14 9s-9-7-14-9Z" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="56" cy="14" r="3" fill="currentColor" />
    </svg>
  );
}

function Brand({ footer = false }) {
  return (
    <a className={`brand ${footer ? 'brand-footer' : ''}`} href="#inicio" aria-label="Delícias da Ana, voltar ao início">
      <span className="brand-emblem"><img src="/logo-ana.webp" alt="" /></span>
      <span className="brand-wordmark">
        <span className="brand-top">Delícias <i>da Ana</i></span>
        <span className="brand-bottom">CONFEITARIA</span>
      </span>
    </a>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.classList.add('is-visible');
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <div className="shell header-inner">
          <Brand />
          <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Navegação principal" id="primary-navigation">
            <a href="#inicio" onClick={closeMenu}>Início</a>
            <a href="#cardapio" onClick={closeMenu}>Cardápio</a>
            <a href="#contato" onClick={closeMenu}>Contato</a>
          </nav>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="header-instagram">
            Instagram <Arrow diagonal />
          </a>
          <button
            type="button"
            className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span /><span />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-texture" aria-hidden="true" />
          <div className="shell hero-grid">
            <div className="hero-copy reveal">
              <div className="eyebrow"><span className="eyebrow-line" /> DOCES PARA MOMENTOS ESPECIAIS</div>
              <h1>Um carinho<br />em forma de<br /><em>doçura.</em></h1>
              <p>Bolos, tortas, sobremesas e doces para tornar cada ocasião ainda mais especial.</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#cardapio">Ver cardápio <Arrow /></a>
                <a className="text-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Nosso Instagram <Arrow diagonal /></a>
              </div>
              <div className="hero-footnote"><Flourish /><span>Feito para adoçar os bons momentos.</span></div>
            </div>

            <div className="hero-visual reveal">
              <span className="hero-art-word" aria-hidden="true">Ana</span>
              <div className="hero-image-arch">
                <img
                  src={photo('photo-1578985545062-69928b1d9587', 1200)}
                  alt="Bolo de confeitaria em fotografia ilustrativa"
                  fetchPriority="high"
                />
                <div className="image-sheen" />
              </div>
              <span className="image-credit">Imagem ilustrativa</span>
              <span className="floating-spark spark-one" aria-hidden="true">✳</span>
              <span className="floating-spark spark-two" aria-hidden="true">✳</span>
            </div>
          </div>
          <div className="hero-side-label" aria-hidden="true">DELICADEZA EM CADA DETALHE —</div>
        </section>

        <div className="ticker" aria-label="Bolos, tortas, sobremesas e doces">
          <div className="ticker-track" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={index}>BOLOS <b>✳</b> TORTAS <b>✳</b> SOBREMESAS <b>✳</b> DOCES <b>✳</b></span>
            ))}
          </div>
        </div>

        <OrderSystem />

        <section className="contact section-pad" id="contato">
          <div className="contact-ornament ornament-one" aria-hidden="true">✳</div>
          <div className="contact-ornament ornament-two" aria-hidden="true">✳</div>
          <div className="shell contact-inner reveal">
            <span className="contact-kicker">UM DOCE CONVITE</span>
            <Flourish />
            <h2>Tem sempre um bom<br />motivo para <em>adoçar.</em></h2>
            <p>Escolha seu sabor favorito e consulte sua encomenda diretamente pelo Instagram.</p>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn btn-light">
              Conversar pelo Instagram <Arrow diagonal />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell">
          <div className="footer-main">
            <div><Brand footer /><p>Um mundo de doçuras para compartilhar.</p></div>
            <div className="footer-links"><span>EXPLORE</span><a href="#inicio">Início</a><a href="#cardapio">Cardápio</a><a href="#contato">Contato</a></div>
            <div className="footer-links"><span>ACOMPANHE</span><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="#contato">Contato</a></div>
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} Delícias da Ana</span><span>Bolos · Tortas · Sobremesas · Doces</span></div>
        </div>
      </footer>
    </>
  );
}
