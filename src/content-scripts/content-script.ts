import { Dict } from "@/assets/types"

// const main = async () => {
const main = () => {
  const fromLang = "English"
  const toLang = "Hungarian"
  const key = `${fromLang}-${toLang}`
  // const dict: Dict = await browser.storage.local.get(key)
  const dict: Dict = {
    [key]: [
      ["information", "infoinfoinfo"],
      //["for", "nyunyunyu"],
    ],
  }

  if (dict[key] === undefined) {
    console.log("No dict")
    return
  }

  let node: Node | null
  const tree = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)

  let text: string
  let chunks: string[]
  let group: HTMLSpanElement
  let span: HTMLSpanElement
  let chunkLength: number
  let wordLength: number
  let offset: number
  let until: number

  while ((node = tree.nextNode())) {
    text = node?.nodeValue || ""

    dict[key].forEach(([word, title]) => {
      // chunks = text.split(new RegExp(`\\b${word}\\b`, "i"))
      chunks = text.split(word)
      if (chunks.length < 2) return

      console.log({ text, word })

      group = document.createElement("span")
      wordLength = word.length
      until = chunks.length - 1
      offset = 0

      chunks.forEach((chunk, index) => {
        chunkLength = chunk.length
        if (chunkLength > 0) {
          group.appendChild(
            document.createElement("span").appendChild(document.createTextNode(chunk))
          )
          offset += chunkLength
        }
        if (index < until) {
          span = document.createElement("span")
          span.className = "web-words-item"
          span.title = title
          span.innerText = text.substring(offset, offset + wordLength)
          group.appendChild(span)
          offset += word.length
        }
      })

      node!.parentNode?.replaceChild(group, node!)
    })
  }
}
main()
