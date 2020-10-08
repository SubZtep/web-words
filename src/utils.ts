/**
 * Tells if provided chunk's characters are latin or chinese-like.
 * For the later don't try to split the text to words, search in it instead.
 */
export const isLatin = (chunk: string) => !/[^\u0000-\u0900]/.test(chunk)

/**
 * Get list of words from a text.
 */
export const splitToWords = (str: string): string[] =>
  str
    ?.split(/(\b\w+\b)/)
    .map(w => w.trim())
    .filter(Boolean) ?? []

/**
 * The node is a human readable text.
 */
export const translatable = (node: Node) => {
  const parent = node.parentNode
  return parent !== null && !["style", "noscript", "script"].includes(parent.nodeName.toLowerCase())
}

/**
 * @param word Text on the webpage
 */
export const spanFactory = (word: string, title: string): Node => {
  const span = document.createElement("span")
  span.className = "web-words-item"
  span.setAttribute("data-tooltip", title)
  span.innerText = word
  return span
}

/**
 * Replace a node with a _group node_ that contains parts.
 */
export const replaceWithParts = (node: Node, parts: Node[]) => {
  const group = document.createElement("span")
  parts!.forEach(part => void group.appendChild(part))
  group.normalize()
  node.parentNode?.replaceChild(group, node)
}

/**
 * Simplify code, so a detected website language match with language from the translator.
 */
export const langCode = (detectedLanguage: string) => detectedLanguage.split("-")[0]
