import { langCode } from "../utils/utils"

export const parseResponse = (data: object) => {
  const dict: Dict = {}
  data[2].forEach(([, fromLang, toLang, fromWord, toWord]: string[]) => {
    fromLang = langCode(fromLang)
    toLang = langCode(toLang)

    if (dict[fromLang] === undefined) dict[fromLang] = {}
    if (dict[fromLang][toLang] === undefined) dict[fromLang][toLang] = []

    dict[fromLang][toLang].push([fromWord.toLowerCase(), toWord.toLowerCase()])
  })
  return dict
}

export default async () => {
  const tab = await browser.tabs.create({ url: "https://translate.google.com/#view=saved" })

  browser.webRequest.onCompleted.addListener(
    async ({ url }) => {
      const res = await fetch(url)
      if (!res.ok) return

      const data = await res.json()
      const dict: Dict = parseResponse(data)

      // save
      const dictEntries = Object.entries(dict)
      if (dictEntries.length > 0) {
        browser.storage.local.clear()
        for (const [fromLang, toLangs] of dictEntries) {
          await browser.storage.local.set({ [fromLang]: toLangs })
        }
      } else {
        alert("I didn't find any words (／ˍ・、)")
      }

      await browser.tabs.remove(tab.id!)
    },
    {
      tabId: tab.id,
      urls: ["*://*/*/sg?*"],
    },
    ["responseHeaders"]
  )
}
