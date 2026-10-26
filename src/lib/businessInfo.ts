/**
 * Wettelijke bedrijfsgegevens voor de footer (client én prerender).
 * Rechtsvorm blijft leeg tot Jay die bevestigt.
 */
export const BUSINESS_INFO = {
  companyName: "Jayden Ecom (SenseGlow)",
  legalForm: "",
  kvk: "99634929",
  vat: "NL005399692B39",
  address: "Tolheksleane 4A, 8821 MD Kimswerd",
  addressNote: "post- en retouradres, geen bezoekadres",
  email: "support@senseglow.shop",
};

export type BusinessInfo = typeof BUSINESS_INFO;

/** Eén regel bedrijfsgegevens, zelfde tekst in footer en server-HTML. */
export const businessLine = (info: BusinessInfo = BUSINESS_INFO) =>
  [
    info.legalForm ? `${info.companyName}, ${info.legalForm}` : info.companyName,
    `KvK ${info.kvk}`,
    `btw ${info.vat}`,
    `${info.address} (${info.addressNote})`,
    info.email,
  ].join(" · ");
