import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

// RTL doesn't auto-clean DOM between tests with globals off (explicit imports)
afterEach(() => {
  cleanup()
})

// jsdom defines HTMLDialogElement but not its methods
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () {
    if (this.open) {
      throw new DOMException("The dialog is already open", "InvalidStateError")
    }
    this.open = true
  }

  HTMLDialogElement.prototype.close = function () {
    if (!this.open) return
    this.open = false
    this.dispatchEvent(new Event("close"))
  }
}
