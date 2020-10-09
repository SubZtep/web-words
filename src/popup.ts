const msg = (type: "IMPORT_DICT" | "GET_CONTENT_STATE") =>
  void browser.runtime.sendMessage({ type })

const t = (id: string) => (word?: string) => {
  const el = document.getElementById(id)
  el!.innerText = word === undefined ? browser.i18n.getMessage(id) : word
  return el
}

const main = () => {
  t("importDict")()
  t("importDictGO")()!.addEventListener("click", () => msg("IMPORT_DICT"))

  browser.runtime.onMessage.addListener(message => {
    console.log("POPUP", message)
    if (message.type === "CONTENT_STATE") {
      const state: ContentState = message.state
      t("lang")(state.language ?? "n/a")
      t("words")(state.words.toString())
      t("fulltext")(state.fulltext.toString())
    }
  })
  msg("GET_CONTENT_STATE")
}

document.addEventListener("DOMContentLoaded", main)
