import { cakeFlavors, formatBRL } from '../data/cardapio.js';

const instagram = 'https://www.instagram.com/confeitaria_deliiciasdaana/';

export default function CakeMenu() {
  return (
    <section className="cake-menu section-pad" id="cardapio" aria-labelledby="menu-title">
      <div className="shell">
        <div className="cake-menu-heading reveal">
          <div>
            <span className="section-kicker"><span>03</span> / CARDÁPIO DE BOLOS</span>
            <h2 id="menu-title">O sabor da sua<br /><em>celebração.</em></h2>
          </div>
          <div className="cake-menu-intro">
            <span>ESCOLHA O SEU FAVORITO</span>
            <p>Dos clássicos aos recheios especiais. Confira nossos sabores e valores por quilo.</p>
          </div>
        </div>

        <div className="menu-board reveal">
          <div className="menu-board-heading">
            <div className="menu-board-identity">
              <span className="menu-board-monogram" aria-hidden="true">A</span>
              <span>Delícias da Ana</span>
            </div>
            <span>BOLOS · PREÇO POR KG</span>
          </div>

          <div className="menu-flavors">
            {cakeFlavors.map((flavor, i) => (
              <div className="menu-flavor" key={flavor.name}>
                <span className="menu-flavor-number">{String(i + 1).padStart(2, '0')}</span>
                <span className="menu-flavor-name">{flavor.name}</span>
                <span className="menu-flavor-leader" aria-hidden="true" />
                <span className="menu-flavor-value"><strong>{formatBRL(flavor.price)}</strong><small>/ kg</small></span>
              </div>
            ))}
          </div>

          <div className="menu-board-signature">
            <span>DOCES MOMENTOS, LINDAS MEMÓRIAS.</span>
            <span>16 SABORES DE BOLOS</span>
          </div>
        </div>

        <div className="menu-additional reveal">
          <article className="menu-additional-item">
            <span className="menu-additional-index">01 / ACABAMENTO</span>
            <h3>Feito do seu jeito.</h3>
            <p>Bolos com chantininho e opção de massa branca ou chocolate.</p>
          </article>
          <article className="menu-additional-item">
            <span className="menu-additional-index">02 / SOB CONSULTA</span>
            <h3>Um toque especial.</h3>
            <p>Novos sabores, cento de doces e topos com flores, 3D ou laminados: consulte os valores.</p>
          </article>
          <article className="menu-additional-item">
            <span className="menu-additional-index">03 / COMO FUNCIONA</span>
            <h3>Para encomendar.</h3>
            <p>Pagamento por Pix, cartão de crédito ou débito e dinheiro. Entrega a combinar.</p>
          </article>
        </div>

        <div className="menu-order reveal">
          <p>Já escolheu seu sabor? <strong>Consulte sua encomenda diretamente com a Ana.</strong></p>
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="menu-order-link">
            Consultar pelo Instagram
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
