const findWords = (chunks: string[], word: string) => {
  const newChunks: string[] = []
  let chunk: string
  let splitted: string[]
  let spit: string
  let i: number

  for (chunk of chunks) {
    if (chunk.charAt(0) === ".") {
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
        newChunks.push(`.${word}`)
      }
    }
  }

  return newChunks
}

describe("find words in text", () => {
  const cases = [
    [["a"], ["a"], [".a"]],
    [["b"], ["a"], ["b"]],
    [["ab"], ["a"], [".a", "b"]],
    [["ab"], ["a", "b"], [".a", ".b"]],
    [["bbaxxbxxc"], ["a", "b", "bb", "c"], [".bb", ".a", "xx", ".b", "xx", ".c"]],
    [["bbaxxbbbxxc"], ["a", "b", "bb", "c"], [".bb", ".a", "xx", ".bb", ".b", "xx", ".c"]],
  ]

  test.each(cases)(`chunckcheck %p`, (chunks, words, ret) => {
    words = words.sort((a, b) => b.length - a.length)

    const chunk = chunks.shift()!
    let returns = [chunk]

    for (const word of words) {
      returns = findWords(returns, word)
    }

    expect(ret).toEqual(returns)
  })
})
