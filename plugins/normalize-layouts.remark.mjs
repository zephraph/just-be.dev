export function normalizeLayouts() {
  return (_, file) => {
    const fm = file.data.astro.frontmatter;
    if (fm.layout) {
      fm.layout = `@layouts/${fm.layout}.astro`;
    }
  };
}
