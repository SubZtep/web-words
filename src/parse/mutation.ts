let delay = 1000 // tatency between mutations in ms
let timeoutID: number | undefined = undefined
let mutated: () => void
let target: HTMLBodyElement | null
let observer: MutationObserver

const mutationCallback: MutationCallback = () => {
  if (timeoutID !== undefined) {
    window.clearTimeout(timeoutID)
    timeoutID = undefined
  }
  timeoutID = window.setTimeout(() => {
    stopObserve()
    mutated()
    timeoutID = undefined
    startObserve()
  }, delay)
}

export const startObserve = (cb?: () => void) => {
  if (!target) {
    target = document.querySelector("body")
    if (!target) {
      return
    }
  }
  if (cb) {
    mutated = cb
  }
  if (!observer) {
    observer = new MutationObserver(mutationCallback)
  }
  observer.observe(target, {
    subtree: true,
    childList: true,
    attributes: false,
    characterData: true,
  })
}

export const stopObserve = () => {
  if (observer) {
    observer.takeRecords()
    observer.disconnect()
  }
}
