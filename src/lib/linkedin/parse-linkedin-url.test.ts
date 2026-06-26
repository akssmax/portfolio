import { describe, expect, it } from "vitest"

import { parseLinkedInProfileUrl } from "@/lib/linkedin/parse-linkedin-url"

describe("parseLinkedInProfileUrl", () => {
  it("normalizes linkedin.com/in URLs", () => {
    const parsed = parseLinkedInProfileUrl("linkedin.com/in/Jane-Doe")
    expect(parsed).toEqual({
      slug: "jane-doe",
      normalizedUrl: "https://www.linkedin.com/in/jane-doe",
    })
  })

  it("parses generic profile or portfolio URLs", () => {
    const parsed = parseLinkedInProfileUrl("https://example.com/in/jane")
    expect(parsed).toEqual({
      slug: "jane",
      normalizedUrl: "https://example.com/in/jane",
    })
  })

  it("rejects empty inputs", () => {
    expect(parseLinkedInProfileUrl("")).toBeNull()
  })
})
