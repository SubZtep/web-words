import { addWord, saveDict } from "./import/google-translate"

// @ts-ignore
window.importDict = async () => {
  console.log("JUHII")
  const isDict = ({ isError, data }: DataChunk) =>
    !isError &&
    Array.isArray(data) &&
    data.length > 0 &&
    Array.isArray(data[0]) &&
    data[0].length > 0 &&
    Array.isArray(data[0][0]) &&
    data[0][0].length === 6

  const d: DataRow[] | undefined = window.AF_initDataChunkQueue?.find(isDict)?.data[0]

  if (d) {
    let dict: Dict = {}
    d.forEach(([, fromLang, toLang, fromWord, toWord]) => {
      // dict = addWord(fromLang, toLang, fromWord, toWord, dict)
      console.log({ fromLang, toLang, fromWord, toWord, dict })
      try {
        addWord(fromLang, toLang, fromWord, toWord, dict)
      } catch (e) {
        console.log("IMPORT", e)
      }
    })
    await saveDict(dict)
  }
}

// importDict()
