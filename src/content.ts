import { isLatin, splitToWords, spanFactory, translatable, replaceWithParts } from "./utils"

const findWords = (chunks: (string | Node)[], word: string, translated: string) => {
  const newChunks = []
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
  let nodeSlices: (Node | Node[])[] = []
  let returns: (string | Node)[]

  do {
    let found = false
    if (node.nodeValue && translatable(node)) {
      chunks = splitToWords(node.nodeValue)

      nodeSlices = chunks.map(chunk => {
        if (isLatin(chunk)) {
          // console.log("Test for exact word match")
          const toLang = wordList[chunk]
          if (toLang !== undefined) {
            found = true
            foundCount++
            return spanFactory(chunk, toLang)
          }
        } else {
          //console.log("Test word exists in the full text", chunk)
          returns = [chunk]
          for (const fromWord of fromWordList) {
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

browser.runtime.sendMessage({ type: "ASK_LANGUAGE" })

browser.runtime.onMessage.addListener(message => {
  if (message.type === "TAB_LANGUAGE") {
    startTranslate(message.language)
  }
})
