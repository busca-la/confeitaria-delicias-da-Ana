import { useEffect, useRef, useState } from 'react';
import { cakeFlavors, formatBRL } from '../data/cardapio.js';

const INSTAGRAM = 'https://www.instagram.com/confeitaria_deliiciasdaana/';
// Configure VITE_ORDER_WHATSAPP somente após a confirmação do número da confeitaria.
// Nunca reutilizar automaticamente o número da Tapiocaria da Fonte.
const ORDER_PHONE = (import.meta.env.VITE_ORDER_WHATSAPP || '').replace(/\D/g, '');

const sections = [
  { id: 'bolos', label: 'Bolos', count: cakeFlavors.length },
  { id: 'doces', label: 'Doces' },
  { id: 'tortas', label: 'Tortas' },
  { id: 'sobremesas', label: 'Sobremesas' },
];

function parseWeight(raw) {
  if (!raw.trim()) return null;
  const value = Number(raw.trim().replace(',', '.'));
  return Number.isFinite(value) && value > 0 ? value : null;
}
function weightLabel(kg) {
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(kg)} kg`;
}
function Icon({ name, size = 18 }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    close: <path d="M5 5l14 14M19 5 5 19" />,
    arrow: <path d="M5 19 19 5M7 5h12v12" />,
    bag: <><path d="M4 8h16l-1 12H5L4 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function OrderSystem() {
  const [selected, setSelected] = useState('bolos');
  const [visibleCount, setVisibleCount] = useState(6);
  // { [flavorName]: { qty, weight, dough } }, weight = kg estimados por bolo
  const [cart, setCart] = useState({});
  const [drawer, setDrawer] = useState(false);
  const [notes, setNotes] = useState('');
  const [copyState, setCopyState] = useState('idle');
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!drawer) return;
    const oldOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function keydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setDrawer(false);
      }
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const focusable = Array.from(drawerRef.current.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])')).filter((el) => el.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener('keydown', keydown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
      else triggerRef.current?.focus();
    };
  }, [drawer]);

  function changeQty(name, amount) {
    setCart((prev) => {
      const existing = prev[name] || { qty: 0, weight: '', dough: 'A definir' };
      const qty = Math.max(0, existing.qty + amount);
      if (!qty) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: { ...existing, qty } };
    });
  }
  function updateCart(name, key, value) {
    setCart((prev) => prev[name] ? { ...prev, [name]: { ...prev[name], [key]: value } } : prev);
  }
  function changeCategory(id) {
    setSelected(id);
    setVisibleCount(6);
  }

  const entries = cakeFlavors.filter((f) => cart[f.name]?.qty > 0).map((f) => ({ ...f, ...cart[f.name] }));
  const itemCount = entries.reduce((sum, f) => sum + f.qty, 0);
  const hasAllWeights = entries.length > 0 && entries.every((f) => parseWeight(f.weight) !== null);
  const estimate = entries.reduce((sum, f) => {
    const kg = parseWeight(f.weight);
    return sum + (kg ? kg * f.price * f.qty : 0);
  }, 0);
  const completeEstimate = hasAllWeights ? formatBRL(estimate) : 'A confirmar';

  const summary = [
    'Olá! Gostaria de consultar esta encomenda na Delícias da Ana:',
    '',
    ...entries.flatMap((f) => [
      `${f.qty}x ${f.name} — ${formatBRL(f.price)}/kg`,
      `   Peso desejado por bolo: ${parseWeight(f.weight) ? weightLabel(parseWeight(f.weight)) + ' (aproximado)' : 'a combinar'}`,
      `   Massa: ${f.dough}`,
      ...(parseWeight(f.weight) ? [`   Valor estimado: ${formatBRL(f.price * parseWeight(f.weight) * f.qty)}`] : []),
      '',
    ]),
    `Estimativa total: ${completeEstimate}`,
    !hasAllWeights ? 'O peso de um ou mais bolos ainda precisa ser definido.' : 'Estimativa baseada no peso informado, sujeita a confirmação.',
    '',
    `Observações: ${notes.trim() || 'Nenhuma'}`,
    'Cobertura: chantininho (conforme cardápio).',
    'Entrega: a combinar.',
    '',
    'Por favor, confirmem peso possível, preço final, disponibilidade e prazo. Obrigado!',
  ].join('\n');

  const whatsappUrl = ORDER_PHONE
    ? `https://wa.me/${ORDER_PHONE}?text=${encodeURIComponent(summary)}`
    : null;

  async function copyOrder() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopyState('success');
    } catch {
      setCopyState('manual');
    }
  }

  return (
    <section className="order-section section-pad" id="cardapio" aria-labelledby="order-title">
      <div className="shell">
        <div className="order-heading reveal">
          <div>
            <span className="section-kicker"><span>01</span> / CARDÁPIO DA ANA</span>
            <h2 id="order-title">Escolha seu<br /><em>doce favorito.</em></h2>
            <p>Explore os sabores, escolha os bolos e monte sua sacola para consultar a encomenda.</p>
          </div>
          <div className="order-heading-detail"><span>DELÍCIAS DA ANA</span><strong>Feito para momentos especiais</strong></div>
        </div>
        <div className="order-tabs" role="tablist" aria-label="Categorias do cardápio">
          {sections.map((tab) => (
            <button type="button" key={tab.id} role="tab" id={`tab-${tab.id}`}
              aria-selected={selected === tab.id} aria-controls="order-panel"
              className={`order-tab ${selected === tab.id ? 'order-tab-selected' : ''}`}
              onClick={() => changeCategory(tab.id)}>
              {tab.label} {tab.count && <span>{tab.count}</span>}
            </button>
          ))}
        </div>

        <div id="order-panel" role="tabpanel" aria-labelledby={`tab-${selected}`}>
          {selected === 'bolos' ? (
            <>
              <div className="order-meta">
                <span>BOLOS COM CHANTININHO · MASSA BRANCA OU CHOCOLATE</span>
                <span>VALORES POR KG</span>
              </div>
              <div className="order-grid">
                {cakeFlavors.slice(0, visibleCount).map((flavor, i) => {
                  const qty = cart[flavor.name]?.qty || 0;
                  return (
                    <article className="order-product" key={flavor.name}>
                      <div className="order-product-top"><span>Nº {String(i + 1).padStart(2,'0')}</span><span>BOLO</span></div>
                      <h3>{flavor.name}</h3>
                      <div className="order-product-bottom">
                        <div className="order-product-price"><strong>{formatBRL(flavor.price)}</strong><small>por kg</small></div>
                        {qty > 0 ? (
                          <div className="order-quantity" aria-label={`Quantidade de ${flavor.name}`}>
                            <button type="button" onClick={() => changeQty(flavor.name, -1)} aria-label={`Remover um ${flavor.name}`}><Icon name="minus" size={17} /></button>
                            <span aria-live="polite">{qty}</span>
                            <button type="button" onClick={() => changeQty(flavor.name, 1)} aria-label={`Adicionar outro ${flavor.name}`}><Icon name="plus" size={17} /></button>
                          </div>
                        ) : (
                          <button type="button" className="order-add" onClick={() => changeQty(flavor.name, 1)}
                            aria-label={`Adicionar ${flavor.name} à sacola`}><Icon name="plus" size={19} /></button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="order-pagination">
                <span aria-live="polite">Exibindo {Math.min(visibleCount, cakeFlavors.length)} de {cakeFlavors.length} sabores</span>
                <div>
                  {visibleCount > 6 && <button className="order-more" type="button" onClick={() => setVisibleCount(6)}>Ver menos</button>}
                  {visibleCount < cakeFlavors.length &&
                    <button className="order-more" type="button" onClick={() => setVisibleCount((n) => Math.min(n + 6, cakeFlavors.length))}>
                      Ver mais sabores <Icon name="plus" size={15} />
                    </button>}
                </div>
              </div>
            </>
          ) : (
            <div className="order-consult">
              <div className="order-consult-mark">✳</div>
              <div>
                <span className="section-kicker">CONSULTE AS OPÇÕES</span>
                <h3>{selected === 'doces' ? 'Um docinho para cada ocasião.' : selected === 'tortas' ? 'Tortas para compartilhar.' : 'O final mais doce.'}</h3>
                <p>{selected === 'doces'
                  ? 'O cento de doces tem preço sob consulta. Confira as opções disponíveis diretamente com a confeitaria.'
                  : 'As opções e os valores desta categoria ainda não foram fornecidos. Consulte a confeitaria antes de encomendar.'}</p>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Consultar no Instagram <Icon name="arrow" size={16} /></a>
              </div>
            </div>
          )}
        </div>

        <div className="order-footnote">✳ Preços informados por quilo no cardápio fornecido. Peso, acabamento, disponibilidade e valor final devem ser confirmados na encomenda.</div>
        <div className="order-extras reveal">
          <div><span>01 / PERSONALIZAÇÃO</span><h3>Do seu jeito.</h3><p>Bolos com chantininho e massa branca ou chocolate. Topos com flores, 3D ou laminados: valor sob consulta.</p></div>
          <div><span>02 / OUTRAS DELÍCIAS</span><h3>Para cada ocasião.</h3><p>Novos sabores e cento de doces com valores sob consulta.</p></div>
          <div><span>03 / ENCOMENDAS</span><h3>Combinamos os detalhes.</h3><p>Pix, cartão de crédito, débito ou dinheiro. Entrega a combinar.</p></div>
        </div>
      </div>

      <button type="button" ref={triggerRef} className={`order-cart-fab ${itemCount ? 'order-cart-has-items' : ''}`}
        onClick={() => setDrawer(true)} aria-label={`Abrir sua sacola, ${itemCount} ${itemCount === 1 ? 'bolo' : 'bolos'}`}>
        <span className="order-cart-icon"><Icon name="bag" size={23} />{itemCount > 0 && <b>{itemCount}</b>}</span>
        <span>{itemCount ? 'Ver sua encomenda' : 'Sua sacola'}<small>{itemCount ? `${itemCount} ${itemCount === 1 ? 'bolo' : 'bolos'}` : 'Monte seu pedido'}</small></span>
        <Icon name="arrow" size={18} />
      </button>

      {drawer && (
        <div className="order-overlay">
          <button className="order-shade" onClick={() => setDrawer(false)} type="button" aria-label="Fechar sacola" />
          <aside className="order-drawer" ref={drawerRef} role="dialog" aria-modal="true" aria-labelledby="order-dialog-title">
            <div className="order-drawer-header">
              <div><span>DELÍCIAS DA ANA</span><h2 id="order-dialog-title">Sua encomenda</h2><p>{itemCount ? `${itemCount} ${itemCount === 1 ? 'bolo selecionado' : 'bolos selecionados'}` : 'Sua sacola está vazia'}</p></div>
              <button type="button" className="order-drawer-close" ref={closeRef} aria-label="Fechar sacola" onClick={() => setDrawer(false)}><Icon name="close" size={21} /></button>
            </div>
            {itemCount > 0 ? (
              <>
                <div className="order-drawer-items">
                  {entries.map((item) => {
                    const kg = parseWeight(item.weight);
                    return (
                      <div className="order-drawer-item" key={item.name}>
                        <div className="order-drawer-item-title"><h3>{item.name}</h3><strong>{formatBRL(item.price)}/kg</strong></div>
                        <div className="order-fields">
                          <label>Quantidade de bolos
                            <span className="order-quantity">
                              <button type="button" onClick={() => changeQty(item.name, -1)} aria-label={`Remover um ${item.name}`}><Icon name="minus" size={15} /></button>
                              <span>{item.qty}</span>
                              <button type="button" onClick={() => changeQty(item.name, 1)} aria-label={`Adicionar outro ${item.name}`}><Icon name="plus" size={15} /></button>
                            </span>
                          </label>
                          <label>Peso estimado por bolo (kg)
                            <input type="text" inputMode="decimal" autoComplete="off" placeholder="A combinar"
                              value={item.weight} onChange={(e) => updateCart(item.name, 'weight', e.target.value)}
                              aria-label={`Peso estimado por bolo de ${item.name}, em quilos`} />
                          </label>
                          <label>Tipo de massa
                            <select value={item.dough} onChange={(e) => updateCart(item.name, 'dough', e.target.value)}
                              aria-label={`Tipo de massa de ${item.name}`}>
                              <option>A definir</option>
                              <option>Branca</option>
                              <option>Chocolate</option>
                            </select>
                          </label>
                        </div>
                        <div className="order-line-price">{kg ? <>Estimativa: <strong>{formatBRL(item.price * kg * item.qty)}</strong></> : 'Informe o peso desejado para estimar o valor.'}</div>
                      </div>
                    );
                  })}
                  <label className="order-notes">Observações sobre sua encomenda
                    <textarea rows={3} maxLength={500} placeholder="Tema, decoração, data desejada ou outras informações"
                      value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </label>
                </div>
                <div className="order-drawer-checkout">
                  <div className="order-drawer-sum"><span>{hasAllWeights ? 'Total estimado' : 'Total a confirmar'}</span><strong>{completeEstimate}</strong></div>
                  <p>O peso é uma estimativa. Valor final, disponibilidade e entrega são confirmados com a Ana.</p>
                  {whatsappUrl ? (
                    <a className="order-checkout-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Enviar pelo WhatsApp <Icon name="arrow" size={18} /></a>
                  ) : (
                    <>
                      <button className="order-checkout-primary" type="button" onClick={copyOrder}>
                        <Icon name={copyState === 'success' ? 'check' : 'copy'} size={18} />
                        {copyState === 'success' ? 'Resumo copiado!' : 'Copiar resumo da encomenda'}
                      </button>
                      {copyState === 'manual' && (
                        <div className="order-manual-copy"><span>Selecione e copie o resumo abaixo:</span><textarea readOnly value={summary} rows={5} aria-label="Resumo para copiar manualmente" onFocus={(e) => e.target.select()} /></div>
                      )}
                      <a className="order-checkout-secondary" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                        Abrir Instagram para enviar <Icon name="arrow" size={16} />
                      </a>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="order-empty">
                <div className="order-empty-symbol">✳</div>
                <h3>Seu pedido começa aqui.</h3>
                <p>Escolha um sabor no cardápio e adicione o bolo à sacola.</p>
                <button type="button" className="order-checkout-primary" onClick={() => { setDrawer(false); setSelected('bolos'); document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Ver sabores <Icon name="arrow" size={16} />
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
