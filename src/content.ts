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
      // await browser.notifications.create({
      //   type: "basic",
      //   title: "boo",
      //   message: "ccc",
      // })
      await startTranslate(language)
      startObserve(observed)
      break
    case "TAB_PROCESSING":
      // alert("Booo")
      // await browser.notifications.create({
      //   type: "basic",
      //   title: "boo",
      //   message: "ccc",
      // })
      stopObserve()
      break
  }
})
