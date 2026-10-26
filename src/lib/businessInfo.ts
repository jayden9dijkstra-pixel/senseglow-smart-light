/**
 * Wettelijke bedrijfsgegevens voor de footer. Zolang er nog een veld op
 * PLACEHOLDER staat, toont de footer dit blok niet.
 */
export const PLACEHOLDER = "[INVULLEN]";

export const BUSINESS_INFO = {
  companyName: PLACEHOLDER,
  legalForm: PLACEHOLDER,
  kvk: PLACEHOLDER,
  vat: PLACEHOLDER,
  address: PLACEHOLDER,
};

export type BusinessInfo = typeof BUSINESS_INFO;

export const isBusinessInfoComplete = (info: BusinessInfo = BUSINESS_INFO) =>
  Object.values(info).every((v) => v.trim() !== "" && !v.includes(PLACEHOLDER));
