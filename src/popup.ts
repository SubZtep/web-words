const translateEl = (el: HTMLElement) => {
  console.log({ el })
  const key = el.innerText
  if (key) {
    const translated = browser.i18n.getMessage(key)
    if (translated) {
      el.innerText = translated
    }
  }
}

const main = () => {
  document
    .querySelector<HTMLButtonElement>(".fetchDict")!
    .addEventListener(
      "click",
      () => void browser.runtime.sendMessage({ type: "FETCH_DICTIONARY" } as AppMessage)
    )

  // translate
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach(translateEl)
}

document.addEventListener("DOMContentLoaded", main)
