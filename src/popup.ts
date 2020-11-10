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
  const fetchButton = document.querySelector<HTMLButtonElement>(".fetchDict")!
  fetchButton.addEventListener("click", async () => {
    fetchButton.disabled = true
    await browser.runtime.sendMessage({ type: "FETCH_DICTIONARY" } as AppMessage)
    window.close()
  })

  // translate
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach(translateEl)
}

document.addEventListener("DOMContentLoaded", main)
