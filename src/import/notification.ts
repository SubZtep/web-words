const countReducer = (subPrev: number, subCurr: any[]) => subPrev + subCurr.length
const valuesCountReducer = (prev: number, curr: { [key: string]: any[] }) =>
  prev + Object.values(curr).reduce(countReducer, 0)

export const notification = async (type: NotificationType) => {
  const iconUrl = "icons/192x192.png"
  let options: browser.notifications.CreateNotificationOptions

  switch (type) {
    case "IMPORT_SUCCESS":
      const dict: Dict = await browser.storage.local.get()
      const languageCount = Object.keys(dict).length
      const wordCount = Object.values(dict).reduce(valuesCountReducer, 0)
      options = {
        type: "list",
        iconUrl,
        title: "Updated",
        message: "Local dictionary updated.",
        items: [
          { title: "Translate From", message: `${languageCount} languages` },
          { title: "All together", message: `${wordCount} words` },
        ],
      }
      break

    case "IMPORT_FAIL":
      options = {
        type: "basic",
        iconUrl,
        title: "Update Failed",
        message: "Local dictionary is not updated",
      }
      break
  }

  await browser.notifications.create(options)
}
