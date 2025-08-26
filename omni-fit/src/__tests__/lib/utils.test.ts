import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Utils", () => {
  describe("cn (className utility)", () => {
    it("should merge class names", () => {
      const result = cn("bg-red-500", "text-white");
      expect(result).toContain("bg-red-500");
      expect(result).toContain("text-white");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toContain("base-class");
      expect(result).toContain("active-class");
    });

    it("should handle falsy conditional classes", () => {
      const isActive = false;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toContain("base-class");
      expect(result).not.toContain("active-class");
    });

    it("should handle arrays of classes", () => {
      const result = cn(["class1", "class2"], "class3");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
      expect(result).toContain("class3");
    });

    it("should handle undefined and null values", () => {
      const result = cn("base", undefined, null, "final");
      expect(result).toContain("base");
      expect(result).toContain("final");
    });
  });
});
