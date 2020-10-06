import { Dict, Words } from "./types"
import { isLatin, splitWords, spanFactory, translatable, replaceWithParts } from "./utils"

export const translatePage = async (words: Words) => {
  console.time("web-words")

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  if (!node) return

  let count = 0
  let chunks: string[]
  let nodeParts: Node[]

  do {
    let found = false
    if (translatable(node)) {
      chunks = splitWords(node.nodeValue ?? "")

      nodeParts = chunks.map(chunk => {
        if (isLatin(chunk)) {
          // Test for exact match
          const toLang = words[chunk]
          if (toLang !== undefined) {
            found = true
            count++
            return spanFactory(chunk, toLang)
          }
        } else {
          // Test word exists in the text

          // console.log("XXX", words)
          const returns = []
          let word
          for (word of Object.keys(words).sort((a, b) => b.length - a.length)) {
            if (chunk === word) {
              returns.push(spanFactory(chunk, word))
              continue
            }

            const chunkPieces = [chunk]

            const splitted = chunk.split(word)
            if (splitted.length === 1) {
              continue
            }

            for (const split of splitted) {
              if (split === word) {
                //
              }
            }
          }

          // Object.keys(words).forEach(word => {
          //   if (chunk === word) {
          //     return spanFactory(chunk, word)
          //   }
          //   const splitted = chunk.split(word)
          //   if (splitted.length > 1) {
          //     console.log(chunk)
          //   }
          //   // if (word === "美國") {
          //   //   console.log(chunk, chunk.indexOf(word))
          //   //   // console.log([word, chunk, chunk.indexOf(word)])
          //   // }
          //   // if (chunk.indexOf(word) !== -1) {
          //   //   console.log("JUGHUUUU")
          //   // }
          // })
        }
        return document.createTextNode(chunk)
      })

      // if (nodeParts.length > 0) {
      //   console.log("XCXXXX", nodeParts)
      // }
    }

    const next = walker.nextNode()
    if (found) {
      replaceWithParts(node, nodeParts!)
    }
    node = next
  } while (node)

  if (count > 0) {
    browser.runtime.sendMessage({ type: "WORDS_FOUND", count })
  }

  console.timeEnd("web-words")
}

const startTranslate = async (language: string) => {
  const dict: Dict = await browser.storage.local.get(language)
  if (dict[language] === undefined) {
    console.log("No dict")
    return
  }
  // Drop multiply translated words for now.
  const words: Words = Object.fromEntries(Object.values(dict[language]).flat())
  translatePage(words)
}

browser.runtime.sendMessage({ type: "ASK_LANGUAGE" })

browser.runtime.onMessage.addListener(message => {
  if (message.type === "TAB_LANGUAGE") {
    startTranslate(message.language)
  }
})
