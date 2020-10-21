import { langCode } from "./utils/utils"
import { importDict, watchStarred } from "./import/google-translate"

const transTabs = new Set<number>()

browser.runtime.onMessage.addListener(async (message, sender) => {
  switch (message.type) {
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
      await importDict()
      break
  }
})

const translateTab = async (tabId: number) => {
  transTabs.add(tabId)
  try {
    await browser.tabs.sendMessage(tabId, {
      type: "TAB_LANGUAGE",
      language: langCode(await browser.tabs.detectLanguage(tabId)),
    })
  } catch {}
}

browser.tabs.onUpdated.addListener(async (tabId, { status }) => {
  if (status === "complete") {
    await translateTab(tabId)
  } else {
    await browser.tabs.sendMessage(tabId, {
      type: "TAB_PROCESSING",
    })
  }
})

browser.tabs.onRemoved.addListener(tabId => void transTabs.delete(tabId))

watchStarred(async () => transTabs.forEach(translateTab))

/**
 * Import dictionary after install
 */
//prod:browser.runtime.onInstalled.addListener(importDict)
