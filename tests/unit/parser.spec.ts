import * as parser from "@/assets/parser"

describe("Parser", () => {
  it("basic html", () => {
    const html = "<html><body><div><p>Hello</p><p>World</p></div></body></html>"

    expect(parser.parse(html)).toBeTruthy()
  })
})
