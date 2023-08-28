export const rewriteAttribute = (
  attributeName: string,
  replace: (attribute: string) => string | undefined
): HTMLRewriterElementContentHandlers => ({
  element(element: HTMLElement) {
    const attribute = element.getAttribute(attributeName);
    if (attribute) {
      const replacement = replace(attribute);
      if (!replacement) return;
      element.setAttribute(attributeName, replacement);
    }
  },
});

export const rewriteContent = (
  replace: (content: string) => string
): HTMLRewriterElementContentHandlers => ({
  text(text: Text) {
    text.replace(replace(text.text), { html: true });
  },
});

export const appendContent = (
  content: string
): HTMLRewriterElementContentHandlers => ({
  element(element: Element) {
    element.append(content, { html: true });
  },
});
