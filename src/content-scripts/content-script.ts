import { Dict } from "@/assets/types"

const main = async () => {
  console.time("web-words")
  const fromLang = "english"
  const toLang = "hungarian"
  const langs = `${fromLang}-${toLang}`
  const key = `dict-${langs}`
  let dict: Dict = await browser.storage.local.get(key)
  if (!dict) {
    console.log("No dict")
    return
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  if (!node) return

  let foundCount = 0
  let nodeParts: Node[]
  let parent: Node | null

  do {
    let found = false
    parent = node.parentNode

    if (
      parent !== null &&
      !["style", "noscript", "script"].includes(parent.nodeName.toLowerCase())
    ) {
      const chunks = node.nodeValue?.split(/(\b\w+\b)/).filter(Boolean) ?? []

      nodeParts = chunks.map(chunk => {
        if (/\w/.test(chunk)) {
          for (const [word, title] of dict[key]) {
            if (word === chunk.toLowerCase()) {
              found = true
              const span = document.createElement("span")
              span.className = "web-words-item"
              span.title = title
              span.innerText = chunk
              return span
            }
          }
        }
        return document.createTextNode(chunk)
      })
    }

    const next = walker.nextNode()
    if (found) {
      const group = document.createElement("span")
      nodeParts!.forEach(nodePart => void group.appendChild(nodePart))
      group.normalize()
      node.parentNode?.replaceChild(group, node)
      foundCount++
    }
    node = next
  } while (node)

  // if (foundCount > 0) {
  //   const badge = { text: foundCount.toString() }
  //   console.log("send message to background", browser.runtime)
  // }

  console.timeEnd("ext")
}

main()
