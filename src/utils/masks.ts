/**
 * Utilitários de máscaras de entrada para os formulários do PawCare
 */

/**
 * Máscara de Data: DD/MM/AAAA
 */
export const formatDateMask = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

/**
 * Máscara Monetária Brasileira: R$ 0,00
 */
export const formatCurrencyMask = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const num = (parseInt(digits, 10) / 100).toFixed(2);
  const parts = num.split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${intPart},${parts[1]}`;
};

/**
 * Máscara de Telefone: (DD) 99999-9999 ou (DD) 9999-9999
 */
export const formatPhoneMask = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

/**
 * Máscara de Idade (apenas números inteiros até 99 anos)
 */
export const formatAgeMask = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 2);
};

/**
 * Máscara de Peso em KG (ex: 28.5 ou 4.2)
 */
export const formatWeightMask = (value: string): string => {
  let clean = value.replace(/[^0-9.,]/g, '').replace(',', '.');
  const parts = clean.split('.');
  if (parts.length > 2) {
    clean = parts[0] + '.' + parts.slice(1).join('');
  }
  return clean.slice(0, 5);
};

/**
 * Máscara de Microchip (padrão ISO 11784/11785 - 15 dígitos numéricos)
 */
export const formatMicrochipMask = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 15);
};
