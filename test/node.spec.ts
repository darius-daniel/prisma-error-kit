import { describe, expect, it } from "vitest";

import { add, greet } from "../src";

describe("node adapter", () => {
  it("exposes core and node helpers", () => {
    expect(add(5, 7)).toBe(12);
    expect(greet("Grace")).toBe("Hello, Grace.");
  });
});
