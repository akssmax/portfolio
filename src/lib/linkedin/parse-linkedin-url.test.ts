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

  it("rejects invalid hosts", () => {
    expect(parseLinkedInProfileUrl("https://example.com/in/jane")).toBeNull()
  })
})
