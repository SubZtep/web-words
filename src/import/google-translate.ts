import { langCode } from "../utils/utils"

export const saveDict = async (dict: Dict) => {
  const dictEntries = Object.entries(dict)
  if (dictEntries.length > 0) {
    browser.storage.local.clear()
    for (const [fromLang, toLangs] of dictEntries) {
      await browser.storage.local.set({ [fromLang]: toLangs })
    }
  } else {
    console.info("I didn't find any words (／ˍ・、)")
  }
}

export const addWord = (
  fromLang: string,
  toLang: string,
  fromWord: string,
  toWord: string,
  dict: Dict
) => {
  fromLang = langCode(fromLang)
  toLang = langCode(toLang)
  fromWord = fromWord.toLowerCase()
  toWord = toWord.toLowerCase()

  if (dict[fromLang] === undefined) dict[fromLang] = {}
  if (dict[fromLang][toLang] === undefined) dict[fromLang][toLang] = []

  // check for duplicate and add
  const words = dict[fromLang][toLang]
  if (words === undefined || words[fromWord] !== toWord) {
    dict[fromLang][toLang].push([fromWord, toWord])
  }

  return dict
}

export const fetchDict = async () => {
  const res = await fetch("https://translate.google.com/saved")
  if (!res.ok) return
  const dict: Dict = {}

  Array.from(
    new DOMParser().parseFromString(await res.text(), "text/html").querySelectorAll("script")
  ).some(({ innerText }) => {
    let rows
    try {
      rows = JSON.parse(
        innerText.split("data:", 2)[1]?.split("sideChannel:", 1)[0].trimEnd().slice(0, -1)
      )[0]
      if (!Array.isArray(rows) || rows.length === 0 || rows[0].length !== 6) {
        return false
      }
    } catch {
      return false
    }

    try {
      rows.forEach(
        async ([, fromLang, toLang, fromWord, toWord]) =>
          void addWord(fromLang, toLang, fromWord, toWord, dict)
      )
    } catch {
      return false
    }
    return true
  })

  await saveDict(dict)

  return {
    languageCount: Object.keys(dict).length,
    wordCount: Object.values(dict).reduce(
      (prev, curr) =>
        prev + Object.values(curr).reduce((subPrev, subCurr) => subPrev + subCurr.length, 0),
      0
    ),
  }
}
