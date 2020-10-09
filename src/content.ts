import { findWords, splitToWords, spanFactory, translatable, replaceWithParts } from "./utils"

const state: ContentState = {
  language: undefined,
  latin: true,
}

const translatePage = async (wordList: Words) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  if (!node) return

  console.time("web-words")
  const fromWordList = Object.keys(wordList).sort((a, b) => b.length - a.length)
  let words: string[]
  let found: boolean
  let foundCount = 0
  let nodeSlices: Node[]

  do {
    found = false
    if (node.nodeValue && translatable(node)) {
      words = splitToWords(node.nodeValue)
      if (words.length > 1) {
        nodeSlices = words.map(chunk => {
          const toLang = wordList[chunk]
          if (toLang !== undefined) {
            found = true
            foundCount++
            return spanFactory(chunk, toLang)
          }
          return document.createTextNode(chunk)
        })
      } else {
        nodeSlices = findWords(node.nodeValue, wordList, fromWordList).map(item => {
          if (typeof item === "string") {
            return document.createTextNode(item)
          }
          found = true
          foundCount++
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

  console.timeEnd("web-words")
}

const startTranslate = async (language: string) => {
  const dict: Dict = await browser.storage.local.get(language)
  if (dict[language] === undefined) {
    console.warn("No dict")
    return
  }
  //TODO: Handle words with multiple language translations.
  const words: Words = Object.fromEntries(Object.values(dict[language]).flat())
  translatePage(words)
}

browser.runtime.onMessage.addListener(message => {
  console.log("CONTENT", message)
  switch (message.type) {
    case "TAB_LANGUAGE":
      state.language = message.language as string
      startTranslate(state.language)
      break
    case "GET_CONTENT_STATE":
      browser.runtime.sendMessage({ type: "CONTENT_STATE", state })
      break
  }
})

// First step is ask language from the background script.
// If we have it then the translation can happen.
browser.runtime.sendMessage({ type: "ASK_LANGUAGE" })
