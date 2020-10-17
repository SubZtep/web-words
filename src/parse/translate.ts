import { findWords, splitToWords, spanFactory, translatable, replaceWithParts } from "./utils"

const translatePage = async (wordList: Words) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  if (!node) return

  const fromWordList = Object.keys(wordList).sort((a, b) => b.length - a.length)
  let words: string[]
  let found: boolean
  let foundCount = 0
  let nodeSlices: Node[]
  let value: string

  do {
    found = false
    if (translatable(node)) {
      value = node.nodeValue!
      words = splitToWords(value)
      if (words.length > 1) {
        nodeSlices = words.map(chunk => {
          const toLang = wordList[chunk.toLowerCase()]
          if (toLang !== undefined) {
            found = true
            foundCount++
            console.log("Word Match", [chunk, toLang])
            return spanFactory(chunk, toLang)
          }
          return document.createTextNode(chunk)
        })
      } else {
        nodeSlices = findWords(value, wordList, fromWordList).map(item => {
          if (typeof item === "string") {
            return document.createTextNode(item)
          }
          found = true
          foundCount++
          console.log("Text Search", [value, item.textContent])
          return item
        })
      }
    }

    const next = walker.nextNode()
    if (found) {
      replaceWithParts(node, nodeSlices!)
    }
    node = next
  } while (node)

  if (foundCount > 0) {
    browser.runtime.sendMessage({ type: "WORDS_FOUND", count: foundCount })
  }
}

export default async (language: string) => {
  console.time("web-words")
  const dict: Dict = await browser.storage.local.get(language)
  if (dict[language] === undefined) {
    console.info("No dict")
    return
  }
  //TODO: Handle words with multiple language translations.
  const words: Words = Object.fromEntries(Object.values(dict[language]).flat())
  await translatePage(words)
  console.timeEnd("web-words")
}
