import { langCode } from "./utils"

const long2short = (a: string, b: string) => b.length - a.length
const addWord = (dict: LocalDict) => (words: Words) => (word: string) =>
  void dict.set(word, words[word])

export const localDict = async (language: string) => {
  const localDict: LocalDict = new Map<string, string>()
  const dict: Dict = await browser.storage.local.get(langCode(language))
  const storedLang = dict[language]

  if (storedLang) {
    //TODO: Handle words with multiple language translations.
    const wordList: Words = Object.fromEntries(Object.values(storedLang).flat())
    const toDict = addWord(localDict)(wordList)
    Object.keys(wordList).sort(long2short).forEach(toDict)
  }

  return localDict
}
