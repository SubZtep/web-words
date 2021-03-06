import { localDict } from "../utils/local-dict"
import { findWords, splitToWords, spanFactory, translatable, replaceWithParts } from "./utils"

const translatePage = async (dict: LocalDict) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  if (!node) return

  let words: string[]
  let found: boolean
  let nodeSlices: Node[]
  let value: string

  do {
    found = false
    if (translatable(node)) {
      value = node.nodeValue!
      words = splitToWords(value)
      if (words.length > 1) {
        nodeSlices = words.map(chunk => {
          const from = chunk.toLowerCase()
          if (dict.has(from)) {
            found = true
            // console.log("Word Match", [chunk, dict.get(from)])
            return spanFactory(chunk, dict.get(from)!)
          }
          return document.createTextNode(chunk)
        })
      } else {
        nodeSlices = findWords(value, dict).map(item => {
          if (typeof item === "string") {
            return document.createTextNode(item)
          }
          found = true
          // console.log("Text Search", [value, item.textContent])
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

  await browser.runtime.sendMessage({
    type: "WORDS_FOUND",
    count: document.querySelectorAll("[data-webwords]").length,
  })
}

export default async (language: string) => {
  const dict = await localDict(language)
  if (dict && dict.size > 0) {
    await translatePage(dict)
  } else {
    console.info("No dict")
  }
}
