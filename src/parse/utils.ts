/**
 * Get list of words from a text.
 */
export const splitToWords = (str: string): string[] => str?.split(/(\b\w+\b)/) ?? []

/**
 * The node is a human readable text.
 */
export const translatable = (node: Node) => {
  if (!node.nodeValue || node.nodeValue.trim() === "") return false
  const parent = node.parentNode
  return parent !== null && !["style", "noscript", "script"].includes(parent.nodeName.toLowerCase())
}

/**
 * @param word Text on the webpage
 */
export const spanFactory = (word: string, title: string): Node => {
  const span = document.createElement("span")
  span.setAttribute("data-webwords", title)
  span.innerText = word
  return span
}

/**
 * Replace a node with a _group node_ that contains parts.
 */
export const replaceWithParts = (node: Node, parts: Node[]) => {
  const group = document.createElement("span")
  parts!.forEach(part => void group.appendChild(part))
  group.normalize()
  node.parentNode?.replaceChild(group, node)
}

/**
 * Find and translate a word in a text
 */
export const findWord = (chunks: (string | Node)[], word: string, translated: string) => {
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

/**
 * Find and translate words in a text
 */
export const findWords = (nodeValue: string, wordList: Words, fromWordList?: string[]) => {
  if (typeof fromWordList === "undefined") {
    fromWordList = Object.keys(wordList).sort((a, b) => b.length - a.length)
  }
  let fromWord: string
  let returns: (string | Node)[] = [nodeValue]
  for (fromWord of fromWordList) {
    returns = findWord(returns, fromWord, wordList[fromWord])
  }
  return returns
}
