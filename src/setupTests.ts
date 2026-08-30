import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

// RTL doesn't auto-clean DOM between tests with globals off (explicit imports)
afterEach(() => {
  cleanup()
})
