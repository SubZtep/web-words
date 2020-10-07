// Content

export const isLatin = (word: string) => !/[^\u0000-\u00ff]/.test(word)

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
  span.title = title
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

// Etc

export const parse = (html: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  return doc
}

/** From Google Translate Web:
Afrikaans
Albanian
Amharic
Arabic
Armenian
Azerbaijani
Basque
Belarusian
Bengali
Bosnian
Bulgarian
Catalan
Cebuano
Chichewa
Chinese - why from only chinese (no simplified or traditional)
Chinese (Simplified)
Chinese (Traditional)
Corsican
Croatian
Czech
Danish
Dutch
English
Esperanto
Estonian
Filipino
Finnish
French
Frisian
Galician
Georgian
German
Greek
Gujarati
Haitian Creole
Hausa
Hawaiian
Hebrew
Hindi
Hmong
Hungarian
Icelandic
Igbo
Indonesian
Irish
Italian
Japanese
Javanese
Kannada
Kazakh
Khmer
Kinyarwanda
Korean
Kurdish (Kurmanji)
Kyrgyz
Lao
Latin
Latvian
Lithuanian
Luxembourgish
Macedonian
Malagasy
Malay
Malayalam
Maltese
Maori
Marathi
Mongolian
Myanmar (Burmese)
Nepali
Norwegian
Odia (Oriya)
Pashto
Persian
Polish
Portuguese
Punjabi
Romanian
Russian
Samoan
Scots Gaelic
Serbian
Sesotho
Shona
Sindhi
Sinhala
Slovak
Slovenian
Somali
Spanish
Sundanese
Swahili
Swedish
Tajik
Tamil
Tatar
Telugu
Thai
Turkish
Turkmen
Ukrainian
Urdu
Uyghur
Uzbek
Vietnamese
Welsh
Xhosa
Yiddish
Yoruba
Zul
*/

export const languageName = (code: string): string | undefined => {
  code = code.trim().toLowerCase()
  switch (code) {
    case "en":
      return "english"
    case "hu":
      return "hungarian"
    default:
      return undefined
  }
}
