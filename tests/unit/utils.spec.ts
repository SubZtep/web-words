import { splitToWords } from "../../src/parse/utils"

describe("Utils", () => {
  it("split words", () => {
    expect(splitToWords("a  b")).toEqual(["", "a", "  ", "b", ""])
  })
})
