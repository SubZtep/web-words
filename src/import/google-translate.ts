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

export const parseResponse = (data: object) => {
  let dict: Dict = {}
  data[2].forEach(([, fromLang, toLang, fromWord, toWord]: string[]) => {
    dict = addWord(fromLang, toLang, fromWord, toWord, dict)
  })
  return dict
}

const starListener = async ({ url }) => {
  const res = await fetch(url)
  if (!res.ok) {
    return
  }
  const data = await res.json()
  const dict: Dict = parseResponse(data)
  await saveDict(dict)
}

export const importDict = (tabId: number) => {
  //TODO: use webRequest/filterResponseData if possible
  if (browser.webRequest.onCompleted.hasListener(starListener)) {
    return
  }
  browser.webRequest.onCompleted.addListener(
    starListener,
    {
      tabId,
      urls: ["https://*/*/sg?*"],
      types: ["xmlhttprequest"],
    },
    ["responseHeaders"]
  )
}

export const importDictGone = () => {
  if (browser.webRequest.onCompleted.hasListener(starListener)) {
    browser.webRequest.onCompleted.removeListener(starListener)
  }
}

/**
 * Add starred word to local dictionary.
 */
export const watchStarred = (cb: () => void) => {
  browser.webRequest.onBeforeRequest.addListener(
    // @ts-ignore
    async ({ method, requestBody, url }) => {
      if (method !== "POST" || !url.startsWith("https://translate.google")) return

      const {
        formData: { q, utrans },
      } = requestBody as AddRequestData

      if (!Array.isArray(q) || q.length !== 1 || !Array.isArray(utrans) || utrans.length !== 1)
        return

      let langs: { [key: string]: string }
      try {
        langs = Object.fromEntries(
          url
            .split("?")[1]
            .split("&")
            .filter(q => q.startsWith("sl=") || q.startsWith("tl="))
            .map(q => q.split("="))
        )
      } catch {
        return
      }
      if (Object.keys(langs).length !== 2) return

      let dict = await browser.storage.local.get(langCode(langs["sl"]))
      dict = addWord(langs["sl"], langs["tl"], q[0], utrans[0], dict)
      await saveDict(dict)
      cb()
    },
    {
      urls: ["https://*/translate_a/sg?*"],
      types: ["xmlhttprequest"],
    },
    ["requestBody"]
  )
}
