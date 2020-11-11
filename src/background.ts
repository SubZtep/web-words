import { langCode } from "./utils/utils"
import { starredIntoLocal } from "./import/google-translate"

const onMessageReceived = async (message: AppMessage, sender: browser.runtime.MessageSender) => {
  switch (message.type) {
    case "WORDS_FOUND":
      if (sender.tab?.id) {
        browser.browserAction.setBadgeText({
          text: message.count.toString(),
          tabId: sender.tab.id,
        })
      }
      break
    case "FETCH_DICTIONARY":
      await starredIntoLocal()
      break
  }
}

/**
 * URL Change - detect tab language
 */
const onTabUpdate = async (tabId: number, { status }: browser.tabs._OnUpdatedChangeInfo) => {
  const message2Content: AppMessage =
    status === "complete"
      ? {
          type: "TAB_LANGUAGE",
          language: langCode(await browser.tabs.detectLanguage(tabId)),
        }
      : {
          type: "TAB_PROCESSING",
        }

  if (status === undefined) return

  try {
    await browser.tabs.sendMessage(tabId, message2Content)
  } catch {
    // FIXME: Error: Could not establish connection. Receiving end does not exist.
    // Change in manifest.json to content_scripts/run_at/document_start makes it better
    // but the problem still exists (especially on google maps).
  }
}

browser.runtime.onMessage.addListener(onMessageReceived)
browser.windows.onCreated.addListener(starredIntoLocal)
browser.tabs.onUpdated.addListener(onTabUpdate)
