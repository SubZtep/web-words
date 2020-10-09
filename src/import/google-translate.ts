import { langCode } from "../utils/utils"

export default async () => {
  const tab = await browser.tabs.create({ url: "https://translate.google.com/#view=saved" })

  browser.webRequest.onCompleted.addListener(
    async ({ url }) => {
      const res = await fetch(url)
      if (!res.ok) return

      const data = await res.json()
      const dict: Dict = {}

      // parse
      data[2].forEach(([, fromLang, toLang, fromWord, toWord]: string[]) => {
        fromLang = langCode(fromLang)
        toLang = langCode(toLang)
        if (dict[fromLang] === undefined) dict[fromLang] = {}
        if (dict[fromLang][toLang] === undefined) dict[fromLang][toLang] = []
        dict[fromLang][toLang].push([fromWord, toWord])
      })

      // save
      browser.storage.local.clear()
      const dictEntries = Object.entries(dict)
      if (dictEntries.length > 0) {
        for (const [fromLang, toLangs] of Object.entries(dict)) {
          await browser.storage.local.set({ [fromLang]: toLangs })
        }
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
