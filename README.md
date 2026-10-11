# Delícias da Ana

Site independente da confeitaria, feito com React + Vite.

## Identidade
- Vinho `#771D2B`
- Creme `#F5E8D3`
- Chocolate `#513527`

## Cardápio e pedidos
Sistema de pedidos inspirado no projeto da Tapiocaria da Fonte, adaptado para a confeitaria.

- 16 sabores de bolos com **preços por kg** transcritos do cardápio da Ana.
- Abas Bolos, Doces, Tortas e Sobremesas; categorias sem preços ficam **sob consulta**, sem produtos fictícios.
- Adição e remoção de bolos, sacola, quantidade e notas da encomenda.
- Peso **estimado por bolo** (opcional, preenchido na sacola). Subtotal só é mostrado quando todos os pesos forem informados.
- Massa branca ou chocolate, além de opção **A definir**.
- Mensagem de pedido com observações e solicitação de confirmação de valor final/entrega/disponibilidade.
- **Instagram é o contato confirmado:** botão para copiar o resumo e abrir o perfil da confeitaria.
- **WhatsApp opcional:** somente após confirmar o número da confeitaria, defina `VITE_ORDER_WHATSAPP` no ambiente de produção (código do país + DDD + número, apenas dígitos). Então o carrinho apresenta o link de envio direto ao WhatsApp. **Nunca assumir que o número da Tapiocaria da Fonte também é o da confeitaria.**

## Condições que constam na arte
- Bolos feitos com chantininho, com massa branca ou de chocolate.
- Novos sabores, cento de doces e topos especiais com preço sob consulta.
- Pagamento via Pix, crédito, débito ou dinheiro; entrega a combinar.
- A grafia "4 leite com abacaxi" foi preservada da arte; consultar a cliente.

## Executar
```bash
npm install
npm run dev
npm run build
```

## Pendências para publicação
- Confirmar se os preços atuais ainda são os da imagem recebida.
- Validar WhatsApp da confeitaria para ativar envio direto, se desejado.
- Substituir fotografias ilustrativas pela galeria real aprovada da Ana.
- Testar no celular e fazer um pedido de ponta a ponta. O carrinho prepara a mensagem, mas não registra pedido em banco de dados.
- A verificação automática de build fica em `.github/workflows/build.yml`.
