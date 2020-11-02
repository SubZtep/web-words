document.addEventListener("DOMContentLoaded", () => {
  document.querySelector<HTMLInputElement>("#sync")!.addEventListener("change", async ev => {
    // @ts-ignore
    console.log("looool", await browser.storage.local.getBytesInUse())
  })

  document.querySelector<HTMLButtonElement>("#del")!.addEventListener("click", async ev => {
    browser.storage.local.clear()
  })
})
