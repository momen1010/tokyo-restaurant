// Arabic-friendly search: ignores diacritics/tatweel and unifies alef, yaa and taa-marbuta forms.
export const normalizeText = (s = '') =>
    String(s).toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').trim()
  
  /** Keeps the section structure; drops sections with no match. */
  export function filterSections(sections, term) {
    const t = normalizeText(term)
    if (!t) return sections
    return sections
      .map((s) => ({ ...s, products: s.products.filter((p) => normalizeText(`${p.name} ${p.description}`).includes(t)) }))
      .filter((s) => s.products.length > 0)
  }