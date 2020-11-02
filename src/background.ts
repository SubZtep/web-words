import { langCode } from "./utils/utils"
import { importDict, importDictGone, watchStarred } from "./import/google-translate"

const transTabs = new Set<number>()
const dictSyncTabs = new Set<number>()

/**
 * If user visit starred words page then import them into the local dictionary.
 */
const importToLocal = (tabId: number, url = "") => {
  if (/^https:\/\/translate\.google\.(.+)view=saved(.*)$/.test(url || "")) {
    if (!dictSyncTabs.has(tabId)) {
      importDict(tabId)
      dictSyncTabs.add(tabId)
    }
  } else {
    dictSyncTabs.delete(tabId)
    importDictGone()
  }
}

browser.runtime.onMessage.addListener(async (message, sender) => {
  switch (message.type) {
    case "WORDS_FOUND":
      if (sender.tab?.id) {
        browser.browserAction.setBadgeText({
          text: message.count.toString(),
          tabId: sender.tab.id,
        })
      }
      break
  }
})

/**
 * Send language code to tab for translate.
 */
const translateTab = async (tabId: number) => {
  transTabs.add(tabId)
  try {
    await browser.tabs.sendMessage(tabId, {
      type: "TAB_LANGUAGE",
      language: langCode(await browser.tabs.detectLanguage(tabId)),
    })
  } catch {}
}

browser.tabs.onUpdated.addListener(async (tabId, { status }, { url }) => {
  console.log("URL without tab permission", url)
  importToLocal(tabId, url)
  if (status === "complete") {
    await translateTab(tabId)
  } else {
    try {
      await browser.tabs.sendMessage(tabId, {
        type: "TAB_PROCESSING",
      })
    } catch {}
  }
})

browser.tabs.onRemoved.addListener(tabId => {
  transTabs.delete(tabId)
  dictSyncTabs.delete(tabId)
  importDictGone()
})

watchStarred(async () => transTabs.forEach(translateTab))

/**
 * Import dictionary after install
 */
//prod:browser.runtime.onInstalled.addListener(importDict)
