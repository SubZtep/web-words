import { languageName } from "@/assets/lang"
import { Dict } from "./assets/types"
let dictTabId: number | undefined
let dictData: string

const saveDict = async (words: string[][]) => {
  //TODO: don't multiply code with AddDictionary.vue
  const dict: Dict = {}
  words.forEach(([, fromCode, toCode, fromWord, toWord]) => {
    const fromLang = languageName(fromCode)
    const toLang = languageName(toCode)
    if (fromLang && toLang) {
      if (dict[fromLang] === undefined) dict[fromLang] = {}
      if (dict[fromLang][toLang] === undefined) dict[fromLang][toLang] = []
      dict[fromLang][toLang].push([fromWord.trim().toLowerCase(), toWord.trim().toLowerCase()])
    }
  })
  for (const [fromLang, toLangs] of Object.entries(dict)) {
    await browser.storage.local.set({ [fromLang]: toLangs })
  }
  await browser.tabs.remove(dictTabId as number)
}

const collectDictData = (requestDetails: any) => {
  let decoder = new TextDecoder("utf-8")
  let filter: any = browser.webRequest.filterResponseData(requestDetails.requestId)

  filter.ondata = (event: any) => {
    dictData += decoder.decode(event.data, { stream: true })
    filter.write(event.data)
  }

  filter.onstop = (event: any) => {
    filter.close()
    try {
      const raw = JSON.parse(dictData)
      saveDict(raw[2])
    } catch {}
  }
}

browser.runtime.onMessage.addListener(async (message, sender) => {
  switch (message.type) {
    case "ASK_LANGUAGE":
      if (sender.tab?.id) {
        const code = await browser.tabs.detectLanguage()
        const language = languageName(code)
        if (language) {
          browser.tabs.sendMessage(sender.tab.id, { type: "TAB_LANGUAGE", language })
        }
      }
      break
    case "WORDS_FOUND":
      if (sender.tab?.id) {
        browser.browserAction.setBadgeText({
          text: message.count.toString(),
          tabId: sender.tab.id,
        })
      }
      break
    case "IMPORT_DICT":
      dictData = ""
      const tab = await browser.tabs.create({ url: "https://translate.google.com/#view=saved" })
      dictTabId = tab.id
      browser.webRequest.onBeforeRequest.addListener(
        collectDictData,
        {
          tabId: dictTabId,
          urls: ["*://*/*/sg?*"],
          types: ["xmlhttprequest"],
        },
        ["blocking"]
      )
      break
  }
})
