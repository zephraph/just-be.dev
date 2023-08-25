export const rewriteAttribute = (attributeName: string, replace: (attribute: string) => string) => new class AttributeRewriter implements HTMLRewriterElementContentHandlers {
  element(element: HTMLElement) {
    const attribute = element.getAttribute(attributeName)
    if (attribute) {
      element.setAttribute(
        attributeName,
        replace(attribute),
      )
    }
  }
}

export const rewriteContent = (replace: (content: string) => string) => new class ContentRewriter implements HTMLRewriterElementContentHandlers {
  text(text: Text) {
    text.replace(replace(text.text), { html: true })
  }
}
