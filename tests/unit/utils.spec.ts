import { isLatin, splitToWords } from "../../src/utils"

describe("Utils", () => {
  it("string has non-latin character(s)", () => {
    expect(isLatin("abc")).toBeTruthy()
    expect(isLatin("árvíztűrő tükörfúrógép")).toBeTruthy()
    expect(isLatin("新型冠狀病毒病")).toBeFalsy()
    expect(isLatin("ni美ce")).toBeFalsy()
  })

  it("split words", () => {
    expect(splitToWords("a  b")).toEqual(["a", "b"])
    expect(
      splitToWords(`
    a b`)
    ).toEqual(["a", "b"])
  })
})
