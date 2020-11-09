import { langCode } from "./utils/utils"
import { importDict, importDictGone, watchStarred } from "./import/google-translate"

const transTabs = new Set<number>()

/** Tabs that used for sync local dictionary. */
const dictSyncTabs = new Set<number>()

/**
 * If user visit starred words page then import them into the local dictionary.
 */
const importToLocal = (tabId: number, url = "") => {
  if (/^https:\/\/translate\.google\.(.+)view=saved(.*)$/.test(url || "")) {
    if (!dictSyncTabs.has(tabId)) {
      importDict(tabId)
      dictSyncTabs.add(tabId)
    }
  } else {
    dictSyncTabs.delete(tabId)
    importDictGone()
  }
}

browser.runtime.onMessage.addListener(async (message: MyMessage, sender) => {
  switch (message.type) {
    case "WORDS_FOUND":
      if (sender.tab?.id) {
        browser.browserAction.setBadgeText({
          text: message.count.toString(),
          tabId: sender.tab.id,
        })
      }
      break
  }
})

/**
 * Send language code to tab for translate.
 */
const translateTab = async (tabId: number) => {
  transTabs.add(tabId)
  try {
    await browser.tabs.sendMessage(tabId, {
      type: "TAB_LANGUAGE",
      language: langCode(await browser.tabs.detectLanguage(tabId)),
    })
  } catch {}
}

// browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
//   console.log("ON UPDATED", { tabId, changeInfo, tab })
// })

// browser.webRequest.onCompleted.addListener(
//   async details => {
//     if (
//       details.statusCode === 200 &&
//       !details.fromCache &&
//       details.method === "GET" &&
//       details.url.startsWith("https://translate.google.")
//     ) {
//       try {
//         await browser.tabs.sendMessage(details.tabId, {
//           type: "IMPORT_DICT",
//         })
//       } catch (e) {
//         console.log("EEE", [details.tabId, e.message])
//       }
//     }
//   },
//   {
//     urls: ["https://*/saved*"],
//     types: ["main_frame"],
//   }
// )

browser.tabs.onUpdated.addListener(
  async (tabId, { status }, { url }) => {
    console.log("YYY")
    const res = await fetch("https://translate.google.com/saved")
    if (res.ok) {
      // console.log("XXX", await res.text())
      const parser = new DOMParser()
      const doc = parser.parseFromString(await res.text(), "text/html")
      // console.log("DDDD", doc.querySelectorAll("script"))
      doc.querySelectorAll("script").forEach(({ innerText }) => {
        // console.log(el.innerText)
        // let pos: number
        // pos = innerText.indexOf("data:")
        // if (pos === -1) return
        // console.log(innerText.split("data:", 2)[1].split("[", 2)[1].split("sideChannel:", 1)[0])
        // console.log(innerText.split("data:", 2)[1].split("sideChannel:", 1)[0])
        // const dict = JSON.parse(
        //   innerText.split("data:", 2)[1]?.split("sideChannel:", 1)[0].trimEnd().slice(0, -1)
        // )
        let dict

        try {
          dict = JSON.parse(
            innerText.split("data:", 2)[1]?.split("sideChannel:", 1)[0].trimEnd().slice(0, -1)
          )[0]
          if (!Array.isArray(dict) || dict.length === 0 || dict[0].length !== 6) {
            throw false
          }
        } catch {
          return
        }

        console.log("DICT", dict)
      })
    }

    if (status === "complete" && url) {
      if (/^https:\/\/translate\.google\.(.+)\/saved/.test(url)) {
        // console.log("A", url)
        try {
          await browser.tabs.sendMessage(tabId, {
            type: "IMPORT_DICT",
          })
        } catch (e) {
          console.log("EEE", [tabId, e.message])
        }
      }
      // console.log({ tabId, changeInfo, tab })
    }
  }
  // {
  //   urls: ["https://*/saved*"],
  //   //properties: [],
  // }
)

// browser.tabs.onUpdated.addListener(
//   async (tabId, { status }, { url }) => {
//     importToLocal(tabId, url)
//     if (status === "complete") {
//       await translateTab(tabId)
//     } else {
//       try {
//         await browser.tabs.sendMessage(tabId, {
//           type: "TAB_PROCESSING",
//         })
//       } catch {}
//     }
//   },
//   {
//     urls: ["https://*/saved*"],
//     properties: []
//   }
// )

// browser.tabs.onRemoved.addListener(tabId => {
//   transTabs.delete(tabId)
//   dictSyncTabs.delete(tabId)
//   importDictGone()
// })

//watchStarred(async () => transTabs.forEach(translateTab))
