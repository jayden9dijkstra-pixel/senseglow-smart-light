import { useEffect } from "react";
import { addLocale, useI18n } from "./I18nProvider";

const ATTRS = ["placeholder", "aria-label", "title"] as const;
const SKIP = "script, style, code, pre, textarea, [data-no-translate]";

export function DomTranslator() {
  const { locale, t } = useI18n();

  useEffect(() => {
    const textOriginals = new WeakMap<Text, string>();
    const attrOriginals = new WeakMap<Element, Map<string, string>>();

    const translateText = (node: Text) => {
      const parent = node.parentElement;
      if (!parent || parent.closest(SKIP)) return;
      const current = node.nodeValue || "";
      const trimmed = current.trim();
      if (!trimmed || !/[A-Za-zÀ-ÿ]/.test(trimmed)) return;
      const original = textOriginals.get(node) || trimmed;
      textOriginals.set(node, original);
      const translated = locale === "nl" ? original : t(original);
      if (translated !== trimmed) node.nodeValue = current.replace(trimmed, translated);
    };

    const translateElement = (element: Element) => {
      if (element.matches(SKIP) || element.closest(SKIP)) return;
      for (const attr of ATTRS) {
        const current = element.getAttribute(attr);
        if (!current || !/[A-Za-zÀ-ÿ]/.test(current)) continue;
        let originals = attrOriginals.get(element);
        if (!originals) { originals = new Map(); attrOriginals.set(element, originals); }
        const original = originals.get(attr) || current;
        originals.set(attr, original);
        element.setAttribute(attr, locale === "nl" ? original : t(original));
      }
    };

    const translateTree = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) translateText(root as Text);
      if (root.nodeType === Node.ELEMENT_NODE) translateElement(root as Element);
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (node.nodeType === Node.TEXT_NODE) translateText(node as Text);
        else translateElement(node as Element);
      }
    };

    translateTree(document.body);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") translateText(record.target as Text);
        record.addedNodes.forEach(translateTree);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [locale, t]);

  useEffect(() => {
    const localizeLinks = (root: ParentNode) => {
      root.querySelectorAll?.("a[href]").forEach((anchor) => {
        const href = anchor.getAttribute("href");
        if (!href || !href.startsWith("/") || href.startsWith("//")) return;
        anchor.setAttribute("href", addLocale(href, locale));
      });
    };
    localizeLinks(document);
    const observer = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.matches("a[href]")) localizeLinks(element.parentNode as ParentNode);
        else localizeLinks(element);
      }
    })));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  return null;
}
