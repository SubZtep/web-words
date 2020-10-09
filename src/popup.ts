const msg = (type: "IMPORT_DICT") => void browser.runtime.sendMessage({ type })

const t = (id: string) => (word?: string) => {
  const el = document.getElementById(id)
  el!.innerText = word === undefined ? browser.i18n.getMessage(id) : word
  return el
}

const main = () => {
  t("importDict")()
  t("importDictGO")()!.addEventListener("click", () => msg("IMPORT_DICT"))
}

document.addEventListener("DOMContentLoaded", main)
