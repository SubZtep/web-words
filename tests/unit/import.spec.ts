import { join } from "path"
import { readFileSync } from "fs"
import { parseTag, addWord } from "../../src/import/google-translate"

const scriptText = readFileSync(join(__dirname, "../data/script-tag.txt"), { encoding: "utf-8" })
const scriptJson = JSON.parse(
  readFileSync(join(__dirname, "../data/script-tag.json"), { encoding: "utf-8" })
)

describe("Google Translate import", () => {
  it("parse empty tag", () => {
    expect(parseTag("")).toBeUndefined()
  })

  it("parse proper tag", () => {
    expect(parseTag(scriptText)).toStrictEqual(scriptJson)
  })
})

describe("Local dictionary", () => {
  it("add a single data row", () => {
    const rawRow: DataRow = ["idB_TWv-_ec", "en", "hu", "gaze", "tekintet", 1604835783670985]
    const parsedRow: Dict = { en: { hu: [["gaze", "tekintet"]] } }
    const dict: Dict = {}
    addWord(dict)(rawRow)
    expect(dict).toStrictEqual(parsedRow)
  })

  it("add multiple data rows", () => {
    const dict: Dict = {}
    const add = addWord(dict)
    scriptJson.forEach(add)
    expect(Object.keys(dict)).toEqual(expect.arrayContaining(["zh", "en", "hu", "pl"]))
  })
})
