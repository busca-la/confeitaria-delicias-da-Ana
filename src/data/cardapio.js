// Cardápio transcrito da arte enviada pela cliente.
// Valores em reais, por quilograma. Confirmar alterações diretamente com a confeitaria.
export const cakeFlavors = [
  { name: 'Brigadeiro de maracujá', price: 75 },
  { name: 'Leite Ninho', price: 75 },
  { name: 'Beijinho', price: 75 },
  { name: 'Trufado de brigadeiro', price: 80 },
  { name: 'Ninho trufado', price: 80 },
  { name: 'Prestígio', price: 80 },
  { name: 'Paçoca', price: 85 },
  { name: '4 leite com abacaxi', price: 90 },
  { name: 'Doce de leite', price: 90 },
  { name: 'Trufado de brigadeiro com morango', price: 90 },
  { name: 'Abacaxi com coco', price: 90 },
  { name: 'Ninho trufado com morango', price: 90 },
  { name: 'Doce de leite com ameixa', price: 98 },
  { name: 'Ninho com Nutella', price: 98 },
  { name: 'Bolo Kit Kat', price: 120 },
  { name: 'Bolo bombom', price: 140 },
];

export const formatBRL = (amount) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
