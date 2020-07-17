import { languageName } from "@/assets/lang"

browser.runtime.onMessage.addListener(async (message, sender) => {
  if (sender.tab?.id) {
    switch (message.type) {
      case "ASK_LANGUAGE":
        const code = await browser.tabs.detectLanguage()
        const language = languageName(code)
        if (language) {
          browser.tabs.sendMessage(sender.tab.id, { type: "TAB_LANGUAGE", language })
        }
        break
      case "WORDS_FOUND":
        browser.browserAction.setBadgeText({
          text: message.count.toString(),
          tabId: sender.tab.id,
        })
        break
    }
  }
})
