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

    if (top < 100) {
      // below
      tooltip.style.top = `${top + scrollY + height + 6}px`
    } else {
      // above
      tooltip.style.top = `${top + scrollY - 30}px` // Tooltip hight cca. 30px
    }

    const protrusion = 150 - width // Tooltip width cca. 150px
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
