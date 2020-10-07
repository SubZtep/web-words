import { languageName } from "./utils"
import { Dict } from "./types/types"

let dictTabId: number | undefined
let dictData: string

const simpleCode = (code: string) => code.split("-")[0]

browser.runtime.onMessage.addListener(async (message, sender) => {
  switch (message.type) {
    /**
     * Detect current page language and send msg
     */
    case "ASK_LANGUAGE":
      if (sender.tab?.id) {
        let language = await browser.tabs.detectLanguage()
        language = simpleCode(language)
        browser.tabs.sendMessage(sender.tab.id, { type: "TAB_LANGUAGE", language })
        // const language = languageName(code)
        // if (language) {
        //   browser.tabs.sendMessage(sender.tab.id, { type: "TAB_LANGUAGE", language })
        // }
      }
      break
    /**
     * Set Word Count on the Badge
     */
    case "WORDS_FOUND":
      if (sender.tab?.id) {
        browser.browserAction.setBadgeText({
          text: message.count.toString(),
          tabId: sender.tab.id,
        })
      }
      break
    /**
     * Create new tab
     */
    case "IMPORT_DICT":
      dictData = ""
      const tab = await browser.tabs.create({ url: "https://translate.google.com/#view=saved" })
      dictTabId = tab.id

      browser.webRequest.onCompleted.addListener(
        async ({ url }) => {
          const res = await fetch(url)
          const data = await res.json()
          browser.storage.local.clear()
          const dict: Dict = {}
          data[2].forEach(([, fromLang, toLang, fromWord, toWord]: string[]) => {
            fromLang = simpleCode(fromLang)
            toLang = simpleCode(toLang)
            if (dict[fromLang] === undefined) dict[fromLang] = {}
            if (dict[fromLang][toLang] === undefined) dict[fromLang][toLang] = []
            dict[fromLang][toLang].push([fromWord, toWord])
          })
          for (const [fromLang, toLangs] of Object.entries(dict)) {
            await browser.storage.local.set({ [fromLang]: toLangs })
            console.log({ [fromLang]: toLangs })
          }
          await browser.tabs.remove(dictTabId as number)
        },
        {
          tabId: dictTabId,
          urls: ["*://*/*/sg?*"],
        },
        ["responseHeaders"]
      )
      break
  }
})
