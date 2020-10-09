import startTranslate from "./parse/translate"

browser.runtime.onMessage.addListener(message => {
  switch (message.type) {
    case "TAB_LANGUAGE":
      startTranslate(message.language as string)
      break
  }
})

// First step is ask language from the background script.
// If we have it then the translation can happen.
browser.runtime.sendMessage({ type: "ASK_LANGUAGE" })
