import { Dict } from "@/assets/types"

const main = async () => {
  console.time("ext")
  const fromLang = "English"
  const toLang = "Hungarian"
  const key = `${fromLang}-${toLang}`
  const dict: Dict = await browser.storage.local.get(key)
  // const dict: Dict = {
  //   [key]: [
  //     ["information", "infoinfoinfo"],
  //     ["to", "nyunyunyu"],
  //   ],
  // }

  if (dict[key] === undefined) {
    console.log("No dict")
    return
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  if (!node) return

  do {
    let found = false
    const chunks = node.nodeValue?.split(/(\b\w+\b)/) ?? []

    const nodeParts = chunks.map(chunk => {
      if (/\w/.test(chunk)) {
        for (const [word, title] of dict[key]) {
          if (word.toLowerCase() === chunk.toLowerCase()) {
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

    const next = walker.nextNode()
    if (found) {
      const group = document.createElement("span")
      nodeParts.forEach(nodePart => void group.appendChild(nodePart))
      node.parentNode?.replaceChild(group, node)
    }
    node = next
  } while (node)

  console.timeEnd("ext")
}

main()
