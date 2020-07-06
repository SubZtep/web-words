// import { join } from "path"
import { expect } from "chai"
// import { readFileSync } from "fs"
import * as parser from "@/assets/parser"

describe("Parser", () => {
  it("basic html", () => {
    const html = "<html><body><div><p>Hello</p><p>World</p></div></body></html>"

    // console.log(parser.parse(html))

    expect(parser.parse(html)).not.empty
  })

  // const html = readFileSync(join(process.cwd(), "tests", "data", "github.html")).toString()

  // it("truish", () => {
  //   expect(html).not.empty
  // })
})
