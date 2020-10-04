import browser from "webextension-polyfill"

const importDict = () => {
  browser.runtime.sendMessage({ type: "IMPORT_DICT" })
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("importDict") as HTMLButtonElement
  btn.textContent = browser.i18n.getMessage("importDict")
  btn.addEventListener("click", importDict)
})
