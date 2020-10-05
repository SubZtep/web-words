/**
 * GO Button Click
 */
const importDictMessage = () => {
  browser.runtime.sendMessage({ type: "IMPORT_DICT" })
}

/**
 * Translate Popup HTML
 */
const localeTranslate = () => {
  const div = document.getElementById("importDict") as HTMLDivElement
  const btn = document.getElementById("importDictGO") as HTMLButtonElement
  div.innerText = browser.i18n.getMessage("importDict")
  btn.textContent = browser.i18n.getMessage("importDictGO")

  btn.addEventListener("click", importDictMessage)
}

document.addEventListener("DOMContentLoaded", localeTranslate)
