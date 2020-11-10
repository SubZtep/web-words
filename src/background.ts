import { langCode } from "./utils/utils"
import { fetchDict } from "./import/google-translate"

const backgroundMessageHandler = async (
  message: AppMessage,
  sender: browser.runtime.MessageSender
) => {
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
      const counts = await fetchDict()
      let options: browser.notifications.CreateNotificationOptions = counts
        ? {
            type: "list",
            iconUrl: "icons/192x192.png",
            title: "Updated",
            message: "Local dictionary updated.",
            items: [
              { title: "Translate From", message: `${counts.languageCount} languages` },
              { title: "All together", message: `${counts.wordCount} words` },
            ],
          }
        : {
            type: "basic",
            iconUrl: "icons/192x192.png",
            title: "Update Failed",
            message: "Local dictionary is not updated",
          }
      await browser.notifications.create(options)
      break
  }
}

const tabUpdateHandler = async (tabId: number, { status }: any, tab: any) => {
  const message: AppMessage =
    status === "complete"
      ? {
          type: "TAB_LANGUAGE",
          language: langCode(await browser.tabs.detectLanguage(tabId)),
        }
      : {
          type: "TAB_PROCESSING",
        }

  try {
    await browser.tabs.sendMessage(tabId, message)
  } catch (e) {
    console.error("TAB UPDATE", e)
  }
}

browser.runtime.onMessage.addListener(backgroundMessageHandler)
browser.windows.onCreated.addListener(fetchDict)
browser.tabs.onUpdated.addListener(tabUpdateHandler)
