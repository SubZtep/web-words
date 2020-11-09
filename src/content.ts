import { startObserve, stopObserve } from "./parse/mutation"
import startTranslate from "./parse/translate"

let language = ""

const observed = async () => {
  await startTranslate(language)
}

browser.runtime.onMessage.addListener(async message => {
  switch (message.type) {
    case "TAB_LANGUAGE":
      language = message.language as string
      await startTranslate(language)
      startObserve(observed)
      break
    case "TAB_PROCESSING":
      stopObserve()
      break
    case "IMPORT_DICT":
      const script = document.createElement("script")
      script.setAttribute("type", "text/javascript")
      script.setAttribute("src", browser.extension.getURL("import.js"))
      document.body.appendChild(script)
      break
  }
})
