import startTranslate from "./parse/translate"

browser.runtime.onMessage.addListener(message => {
  switch (message.type) {
    case "TAB_LANGUAGE":
      startTranslate(message.language as string)
      break
  }
})
