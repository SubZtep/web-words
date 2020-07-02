const main = async () => {
  const fromLang = "English"
  const toLang = "Hungarian"
  const key = `${fromLang}-${toLang}`
  const dict = await browser.storage.local.get(key)

  let html = document.body.innerHTML

  if (dict[key] === undefined) {
    console.log("No dict")
    return
  }

  dict[key].forEach((ab: string[]) => {
    const re = new RegExp(`(?<!<[^>]*)\\b${ab[0]}\\b`, "gi")
    const matches = html.matchAll(re)

    for (const match of Array.from(matches).reverse()) {
      if (match.index === undefined) continue
      const word = `<span class="web-words-item" title="${ab[1]}">${match[0]}</span>`
      html = html.substring(0, match.index) + word + html.substring(match.index + match[0].length)
    }
  })

  if (document.body.innerHTML !== html) {
    document.body.innerHTML = html
  }
}
main()
