let tooltip: HTMLDivElement | null

export const createTooltip = () => {
  tooltip = document.querySelector(".webwords-tooltip")
  if (tooltip !== null) {
    // Tooltip already exists
    return
  }
  tooltip = document.createElement("div")
  tooltip.className = "webwords-tooltip"

  document.body.appendChild(tooltip)
}

export const showTooltip = (text: string) => {
  if (tooltip) {
    tooltip.textContent = text
    tooltip.style.display = "block"
  }
}

export const hideTooltip = () => {
  if (tooltip) {
    tooltip.style.display = "none"
  }
}

export const overHandler = (ev: MouseEvent) => {
  if (!tooltip) {
    createTooltip()
  }
  const target: HTMLElement | null = ev.currentTarget as HTMLElement
  const text = target.getAttribute("data-webwords")

  if (target && tooltip && text) {
    const { top, left, width, height } = target.getBoundingClientRect()
    const { scrollX, scrollY } = window

    // popupWidth = 150px
    // popupHeight = cca. 100px

    if (top < 100) {
      tooltip.style.top = `${top + scrollY + height + 6}px`
      tooltip.style.bottom = "auto"
    } else {
      tooltip.style.top = "auto"
      tooltip.style.bottom = `${document.body.clientHeight - top - scrollY + 4}px`
    }

    const protrusion = 150 - width
    const leftOffset =
      left < protrusion
        ? 0
        : document.body.clientWidth - left - width - protrusion < 0
        ? width - 150
        : -(protrusion / 2)
    tooltip.style.left = `${left + scrollX + leftOffset}px`

    showTooltip(text)
  }
}
