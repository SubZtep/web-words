import { Dict, Words } from "@/assets/types"

const translatePage = async (language: string) => {
  console.time("web-words")

  const dict: Dict = await browser.storage.local.get(language)
  if (dict[language] === undefined) {
    console.log("No dict")
    return
  }

  // Drop (rare) multiply translated words for now.
  const words: Words = Object.fromEntries(Object.values(dict[language]).flat())

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  if (!node) return

  let count = 0
  let chunks: string[]
  let nodeParts: Node[]

  do {
    let found = false

    if (translatable(node)) {
      chunks = node.nodeValue?.split(/(\b\w+\b)/).filter(Boolean) ?? []
      nodeParts = chunks.map(chunk => {
        const toLang = words[chunk.toLowerCase()]
        if (toLang !== undefined) {
          found = true
          count++
          return spanFactory(chunk, toLang)
        }
        return document.createTextNode(chunk)
      })
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

const spanFactory = (word: string, title: string) => {
  const span = document.createElement("span")
  span.className = "web-words-item"
  span.title = title
  span.innerText = word
  return span
}

const translatable = (node: Node) => {
  const parent = node.parentNode
  return parent !== null && !["style", "noscript", "script"].includes(parent.nodeName.toLowerCase())
}

const replaceWithParts = (node: Node, parts: Node[]) => {
  const group = document.createElement("span")
  parts!.forEach(part => void group.appendChild(part))
  group.normalize()
  node.parentNode?.replaceChild(group, node)
}

browser.runtime.sendMessage({ type: "ASK_LANGUAGE" })

browser.runtime.onMessage.addListener(message => {
  if (message.type === "TAB_LANGUAGE") {
    translatePage(message.language)
  }
})
