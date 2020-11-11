import { langCode } from "../utils/utils"
import { notification } from "./notification"

const saveDict = async (dict: Dict) => {
  const dictEntries = Object.entries(dict)
  if (dictEntries.length > 0) {
    browser.storage.local.clear()
    for (const [fromLang, toLangs] of dictEntries) {
      await browser.storage.local.set({ [fromLang]: toLangs })
    }
    return true
  }
  return false
}

export const addWord = (dict: Dict) => ([, fromLang, toLang, fromWord, toWord]: DataRow) => {
  fromLang = langCode(fromLang)
  toLang = langCode(toLang)
  fromWord = fromWord.toLowerCase()
  toWord = toWord.toLowerCase()

  if (dict[fromLang] === undefined) dict[fromLang] = {}
  if (dict[fromLang][toLang] === undefined) dict[fromLang][toLang] = []

  const words = dict[fromLang][toLang]
  if (words === undefined || words[fromWord] !== toWord) {
    dict[fromLang][toLang].push([fromWord, toWord])
  }

  return dict
}

export const parseTag = (text: string): DataRow[] | undefined => {
  let rows: DataRow[]
  try {
    rows = JSON.parse(
      text.split("data:", 2)[1]?.split("sideChannel:", 1)[0].trimEnd().slice(0, -1)
    )[0]
    if (!Array.isArray(rows) || rows.length === 0 || rows[0].length !== 6) {
      return undefined
    }
  } catch {
    return undefined
  }
  return rows
}

const scriptTags = (html: string) =>
  Array.from(new DOMParser().parseFromString(html, "text/html").querySelectorAll("script"))

/**
 * Google Translate API - Get Starred Words of logged user and sav3e to browser storage.
 */
export const starredIntoLocal = async () => {
  const res = await fetch("https://translate.google.com/saved")
  if (!res.ok) {
    notification("FETCH_FAIL")
    return
  }
  const dict: Dict = {}
  const add = addWord(dict)

  // First success breaks and stop the iteration
  scriptTags(await res.text()).some(({ innerText }) => {
    const dataRows = parseTag(innerText)
    if (dataRows && dataRows.length > 0) {
      dataRows.forEach(add)
      return true
    }
  })

  const success = await saveDict(dict)

  notification(success ? "IMPORT_SUCCESS" : "IMPORT_FAIL")
}
