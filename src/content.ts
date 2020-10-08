import { isLatin, splitToWords, spanFactory, translatable, replaceWithParts } from "./utils"

const state: ContentState = {
  language: undefined,
  latin: true,
}

const findWords = (chunks: (string | Node)[], word: string, translated: string) => {
  const newChunks: (string | Node)[] = []
  let chunk: string | Node
  let splitted: string[]
  let spit: string
  let i: number

  for (chunk of chunks) {
    if (typeof chunk !== "string") {
      newChunks.push(chunk)
      continue
    }

    splitted = chunk.split(word)
    i = splitted.length

    for (spit of splitted) {
      if (spit !== "") {
        newChunks.push(spit)
      }
      if (--i > 0) {
        newChunks.push(spanFactory(word, translated))
      }
    }
  }

  return newChunks
}

const translatePage = async (wordList: Words) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  if (!node) return

  console.time("web-words")
  const fromWordList = Object.keys(wordList).sort((a, b) => b.length - a.length)

  let foundCount = 0
  let chunks: string[]
  let fromWord: string
  let nodeSlices: (Node | Node[])[] = []
  let returns: (string | Node)[]

  do {
    let found = false
    if (node.nodeValue && translatable(node)) {
      chunks = splitToWords(node.nodeValue)

      nodeSlices = chunks.map(chunk => {
        // const latinEngine = isLatin(chunk)
        const latinEngine = true

        if (latinEngine) {
          const toLang = wordList[chunk]
          // if (toLang) console.log("LATIN", [chunk, toLang])
          if (toLang !== undefined) {
            found = true
            foundCount++
            return spanFactory(chunk, toLang)
          }
        } else {
          console.log("NON-LATIN", chunk)
          state.latin = false
          returns = [chunk]
          for (fromWord of fromWordList) {
            returns = findWords(returns, fromWord, wordList[fromWord])
          }

          returns = returns.map(item => {
            if (typeof item === "string") {
              return document.createTextNode(item)
            }

            found = true
            foundCount++
            return item
          })

          return returns as Node[]
        }
        return document.createTextNode(chunk)
      })
    }

    const next = walker.nextNode()
    if (found) {
      replaceWithParts(node, nodeSlices.flat())
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
  //TODO: Handle words with multiple languge translations.
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
