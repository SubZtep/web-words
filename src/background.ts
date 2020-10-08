import { langCode } from "./utils"

let lastTabID = -1

browser.runtime.onMessage.addListener(async (message, sender) => {
  console.log("BACKGROUND", message)
  switch (message.type) {
    /**
     * Fordward message to content page
     */
    case "GET_CONTENT_STATE":
      browser.tabs.sendMessage(lastTabID, message)
      break
    /**
     * Fordward message to popup
     */
    case "CONTENT_STATE":
      browser.runtime.sendMessage(message)
      break
    /**
     * Detect current page language and send msg
     */
    case "ASK_LANGUAGE":
      if (sender.tab?.id) {
        lastTabID = sender.tab.id
        browser.tabs.sendMessage(sender.tab.id, {
          type: "TAB_LANGUAGE",
          language: langCode(await browser.tabs.detectLanguage()),
        })
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
      const tab = await browser.tabs.create({ url: "https://translate.google.com/#view=saved" })

      browser.webRequest.onCompleted.addListener(
        async ({ url }) => {
          const res = await fetch(url)
          if (!res.ok) return

          const data = await res.json()
          const dict: Dict = {}
          browser.storage.local.clear()

          // parse
          data[2].forEach(([, fromLang, toLang, fromWord, toWord]: string[]) => {
            fromLang = langCode(fromLang)
            toLang = langCode(toLang)
            if (dict[fromLang] === undefined) dict[fromLang] = {}
            if (dict[fromLang][toLang] === undefined) dict[fromLang][toLang] = []
            dict[fromLang][toLang].push([fromWord, toWord])
          })

          // save
          for (const [fromLang, toLangs] of Object.entries(dict)) {
            await browser.storage.local.set({ [fromLang]: toLangs })
          }

          await browser.tabs.remove(tab.id!)
        },
        {
          tabId: tab.id,
          urls: ["*://*/*/sg?*"],
        },
        ["responseHeaders"]
      )
      break
  }
})
