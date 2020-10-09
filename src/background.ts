import { langCode } from "./utils/utils"
import importDict from "./import/google-translate"

browser.runtime.onMessage.addListener(async (message, sender) => {
  switch (message.type) {
    /**
     * Detect current page language and send msg
     */
    case "ASK_LANGUAGE":
      if (sender.tab?.id) {
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
      await importDict()
      break
  }
})

browser.runtime.onInstalled.addListener(importDict)
