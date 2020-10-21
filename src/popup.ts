const main = () => {
  document
    .getElementById("importDictGO")!
    .addEventListener("click", () => void browser.runtime.sendMessage({ type: "IMPORT_DICT" }))

  // translate
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = browser.i18n.getMessage(el.getAttribute("data-i18n")!)
  })
}

document.addEventListener("DOMContentLoaded", main)
